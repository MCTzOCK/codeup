/**
 * apps/web/src/pages/api/ide/projects/[id]/preview/[[...path]].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.07.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import IDEProjectModel from "@codeup/util/src/models/IDEProjectModel";
import * as ts from "typescript";
import * as sass from "sass";
import { lookup as mimeLookup } from "mime-types";
import { compile } from "@codeup/incode-compiler";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let path = (req.query.path as string[])?.join("/") || "/index.html";

  if (!path.startsWith("/")) {
    path = "/" + path;
  }
  if (req.method !== "GET") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.query.id || !req.cookies.jwt) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  jwt.verify(
    req.cookies.jwt as string,
    process.env.JWT_SECRET as string,
    async (err: VerifyErrors | null, decoded: JwtPayload | string | any) => {
      await mongoConnect();

      try {
        const user = await UserModel.findById((decoded as any).id);

        if (!user) {
          res.status(400).json({
            error: "Invalid token",
          });
          return;
        }

        const IDEProject = await IDEProjectModel.findById(req.query.id);

        if (!IDEProject) {
          res.status(400).json({
            error: "Project not found",
          });
          return;
        }

        if (
          !IDEProject.owner.equals(user._id) &&
          !(
            IDEProject.contributors.find((c: any) => c.user.equals(user._id)) &&
            IDEProject.contributors
              .find((c: any) => c.user.equals(user._id))
              .permissions.includes("READ")
          )
        ) {
          res.status(400).json({
            error: "Project not found",
          });
          return;
        }

        const file = IDEProject.files.find(
          (f: any) => f.path.toLowerCase() === path.toLowerCase()
        );

        if (!file) {
          res.status(404).write("Not Found");
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

        if (
          ret.match(
            /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i
          )
        ) {
          res.redirect(ret);
          return;
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
        };
        const replaceTypes: { [key: string]: string } = {
          "text/x-scss": "text/css",
          "text/x-sass": "text/css",
          "text/x-typescript": "application/javascript",
        };

        let mimeType = mimeLookup(file.path);

        if (!mimeType || !Object.values(mimeTypes).includes(mimeType)) {
          if (mimeType && Object.keys(replaceTypes).includes(mimeType)) {
            mimeType = replaceTypes[mimeType];
          } else {
            mimeType = "text/plain";
          }
        }

        res.setHeader("Content-Type", mimeType);

        res.status(200).write(ret);

        res.end();
      } catch (e: any) {
        res.status(500).json({
          error: e.message,
        });
      }
    }
  );
}
