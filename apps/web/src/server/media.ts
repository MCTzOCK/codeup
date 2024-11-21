/**
 * apps/web/src/server/media.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.11.2024
 *
 */
import formidable from "formidable";
import fs from "fs";
import { randomBytes } from "crypto";
import { IncomingMessage, ServerResponse } from "node:http";
import mongoose from "mongoose";

export const handleMediaRequest = async (
  pathname: string,
  req: IncomingMessage,
  res: ServerResponse,
  parsedUrl: any,
  app: any,
  mediaBucket: any
) => {
  if (pathname?.includes("/upload")) {
    if (req.method === "POST") {
      const form = new formidable.IncomingForm();

      await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
          if (err) {
            await app.render404(req, res, parsedUrl);
            console.log(err);
            return;
          }

          const file = files.file as formidable.File;

          if (!file) {
            await app.render404(req, res, parsedUrl);
            return;
          }

          const content = fs.readFileSync(file.filepath);
          const mimeType = file.mimetype;
          const fileName = file.originalFilename;

          const uploadStream = mediaBucket.openUploadStream(
            randomBytes(128).toString("hex") +
              "." +
              (fileName as string).split(".").pop(),
            {
              contentType: mimeType as string,
              metadata: {
                contentType: mimeType as string,
                fileName: fileName as string,
              },
            }
          );

          uploadStream.write(content);

          uploadStream.end();

          await new Promise((resolve0) => {
            uploadStream.on("finish", () => {
              resolve0(true);
            });
          });

          res.end(
            JSON.stringify({
              status: "success",
              message: "File uploaded successfully.",
              data: {
                url: `/media/${uploadStream.filename}`,
              },
            })
          );

          resolve(true);
        });
      });
      return;
    } else {
      await app.render404(req, res, parsedUrl);
      return;
    }
  } else {
    // URL Structure : /media/:filename

    const filename = pathname.split("/")[pathname.split("/").length - 1];

    const file = await mediaBucket.openDownloadStreamByName(filename);

    if (!file) {
      await app.render404(req, res, parsedUrl);
      return;
    }

    const arr = await mediaBucket.find({ filename }).toArray();

    const gfsFile = arr[0] as typeof arr[0] & {
      metadata: { contentType: string };
    };

    if (gfsFile.metadata) {
      res.setHeader("Content-Type", gfsFile.metadata.contentType);
    }

    await new Promise((resolve) => {
      file.on("data", (chunk: any) => {
        res.write(chunk);
      });
      file.on("end", () => {
        res.end();
        resolve(true);
      });
    });

    return;
  }
};
