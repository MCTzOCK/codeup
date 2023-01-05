/**
 * apps/web/src/server/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.12.2022
 *
 */

import { createServer } from "http";
import { parse } from "url";
import * as next from "next";
import fs from "fs";
import path from "path";
import IDEProjectModel from "@codeup/util/dist/models/IDEProjectModel";
import mongoose from "mongoose";
import * as ts from "typescript";
import * as sass from "sass";
import { compile } from "@codeup/incode-compiler/dist";
import { lookup as mimeLookup } from "mime-types";
import formidable from "formidable";
import { randomBytes } from "crypto";
import { createSocketServer } from "./socket";

const port = parseInt(process.env.PORT || "3000", 10);
const app = next.default({
  dev: process.env.NODE_ENV === "development",
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(async () => {
    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(process.env.MONGO_URI as string);
      } catch (e) {
        console.error("Could not connect to MongoDB");
        console.error(e);
        process.exit(1);
      }
    }

    const mediaBucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      {
        bucketName: "media",
      }
    );

    const httpServer = createServer(async (req, res) => {
      const parsedUrl = parse(req.url!, true);

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("X-Served-By", "CodeUp");

      const { pathname, query } = parsedUrl;

      if (pathname === "/_internal/api/app/stats") {
        if (process.env.NODE_ENV === "production") {
          if (
            fs.existsSync(
              path.join(__dirname, "..", "..", ".codeup_app_stats.json")
            )
          ) {
            res.setHeader("Content-Type", "application/json");
            res.end(
              fs
                .readFileSync(
                  path.join(__dirname, "..", "..", ".codeup_app_stats.json")
                )
                .toString()
            );
          } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                status: "failed",
                message: "This endpoint is currently not available.",
              })
            );
          }
        } else {
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              status: "failed",
              message: "This endpoint is only available in production mode.",
            })
          );
        }

        return;
      }

      if (pathname?.startsWith("/project")) {
        // URL Structure : /project/:customName/:path

        const customName = pathname.split("/")[2];
        let path = pathname.split("/").slice(3).join("/");

        try {
          const project = await IDEProjectModel.findOne({
            publishedCustomName: customName,
          });

          if (!project) {
            throw new Error();
            return;
          }

          if (!project.published) {
            throw new Error();
            return;
          }

          let file = project.files.find(
            (f: { path: string }) =>
              f.path.toLowerCase() === `/${path.toLowerCase()}`
          );

          if (!file) {
            // redirect to index.html
            res.writeHead(302, {
              Location: `/project/${customName}/index.html`,
            });

            res.end();

            return;
          }

          let ret = file.content;

          if (file.path.toLowerCase().endsWith(".ts")) {
            ret = ts.transpileModule(ret, {
              compilerOptions: {
                module: ts.ModuleKind.ESNext,
              },
            }).outputText;
          }

          if (
            file.path.toLowerCase().endsWith(".scss") ||
            file.path.toLowerCase().endsWith(".sass")
          ) {
            ret = sass.compileString(file.content, {
              syntax: file.path.toLowerCase().endsWith(".scss")
                ? "scss"
                : "indented",
            }).css;
          }

          if (file.path.toLowerCase().endsWith(".ic")) {
            ret = `<html><head><title>${
              file.path
            }</title></head><body><script defer>${compile(
              ret
            )}</script></body></html>`;
          }

          const mimeTypes: { [key: string]: string } = {
            js: "application/javascript",
            css: "text/css",
            html: "text/html",
            json: "application/json",
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            svg: "image/svg+xml",
            ic: "text/html",
          };
          const replaceTypes: { [key: string]: string } = {
            "text/x-scss": "text/css",
            "text/x-sass": "text/css",
            "text/x-typescript": "application/javascript",
          };

          let mimeType = "";

          if (mimeTypes[file.path.split(".").pop() as string]) {
            mimeType = mimeTypes[file.path.split(".").pop() as string];
          } else {
            mimeType = mimeLookup(file.path) as string;
          }

          if (!mimeType || !Object.values(mimeTypes).includes(mimeType)) {
            if (mimeType && Object.keys(replaceTypes).includes(mimeType)) {
              mimeType = replaceTypes[mimeType];
            } else {
              mimeType = "text/plain";
            }
          }

          res.setHeader("Content-Type", mimeType);

          res.end(ret);

          return;
        } catch (e) {
          console.log(e);
          await app.render404(req, res, parsedUrl);
          return;
        }
      }

      if (pathname?.startsWith("/media")) {
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
                  console.log(1);
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

          res.setHeader("Content-Type", gfsFile.metadata.contentType);

          await new Promise((resolve) => {
            file.on("data", (chunk) => {
              res.write(chunk);
            });
            file.on("end", () => {
              res.end();
              resolve(true);
            });
          });

          return;
        }
      }

      await handle(req, res, parsedUrl);
    });

    createSocketServer(httpServer);

    httpServer.listen(port, "0.0.0.0", 10, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
