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
import { Octokit } from "octokit";
import * as fs from "fs";
import * as path from "path";
import { tmpdir } from "os";

const oc = new Octokit({
  auth: process.env.GITHUB_PAT,
});
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

        await mongoConnect();

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

        const repo = await oc.request(
          "GET /repos/{owner}/{repo}/zipball/{ref}",
          {
            ref: "main",
            owner: "CodeUpProjects",
            repo: id as string,
          }
        );

        fs.writeFileSync(
          path.join(tmpdir(), `${id}.zip`),
          Buffer.from(repo.data as any)
        );

        res.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename=${id}.zip`,
        });

        const stream = fs.createReadStream(path.join(tmpdir(), `${id}.zip`));

        stream.on("data", (data) => {
          res.write(data);
        });

        stream.on("end", () => {
          res.end();
          fs.unlinkSync(path.join(tmpdir(), `${id}.zip`));
        });

        stream.on("error", () => {
          res.redirect(
            "/error?error=An error occurred while downloading the project"
          );
        });
      }
    );
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
