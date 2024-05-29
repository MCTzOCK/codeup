/**
 * apps/web/src/pages/api/projects/[id]/download.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import mongoConnect from "@codeup/util/dist/mongo";
import UserModel from "@codeup/util/dist/models/UserModel";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import * as fs from "fs";
import * as path from "path";
import { tmpdir } from "os";
import archiver from "archiver";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await mongoConnect();
    const { token, id } = req.query;

    if (!id || !token) {
      res.redirect("/error?error=Invalid Request");
      return;
    }

    jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
      async (err: VerifyErrors | null, decoded: JwtPayload | string | any) => {
        if (err) {
          res.redirect("/error?error=Invalid Token");
          return;
        }

        const user = await UserModel.findById((decoded as any).id);

        if (!user) {
          res.redirect("/error?error=Invalid Token");
          return;
        }

        const project = await ProjectModel.findById(id);

        if (!project) {
          res.redirect("/error?error=Project not found");
          return;
        }

        if (
          !project.users.includes(user._id) &&
          !project.modifiers.includes("dl-public")
        ) {
          res.redirect(
            "/error?error=You are not allowed to download this project"
          );
          return;
        }

        if (
          !fs.existsSync(
            path.join(process.env.GIT_DATA_HOME as string, id as string)
          )
        ) {
          res.redirect("/error?error=Project not found");
        }

        const a = archiver("zip", {
          zlib: { level: 9 },
        });

        const name = `${id}-${Math.random().toString(36).substring(7)}.zip`;

        const output = fs.createWriteStream(path.join(tmpdir(), name));

        a.pipe(output);

        a.directory(
          path.join(process.env.GIT_DATA_HOME as string, id as string),
          false
        );

        a.on("end", () => {
          res.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename=${id}.zip`,
          });

          const stream = fs.createReadStream(path.join(tmpdir(), name));

          stream.on("data", (data) => {
            res.write(data);
          });

          stream.on("end", () => {
            res.end();
            fs.unlinkSync(path.join(tmpdir(), name));
          });

          stream.on("error", () => {
            res.redirect(
              "/error?error=An error occurred while downloading the project"
            );
          });
        });

        a.finalize();
      }
    );
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
