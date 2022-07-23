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

  if (!req.query.id) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  try {
    const IDEProject = await IDEProjectModel.findById(req.query.id);

    if (!IDEProject) {
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

    res.status(200).write(file.content);

    res.end();
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
}
