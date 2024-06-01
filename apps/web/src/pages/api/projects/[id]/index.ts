/**
 * apps/web/src/pages/api/projects/[id]/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.05.2024
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
import { isLoggedIn } from "../../../../global/server/isLoggedIn";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await mongoConnect();
    const { id } = req.query;

    const { auth, user } = await isLoggedIn(req, res);
    if (!auth) return;

    if (!id) {
      res.status(400).json({
        status: 400,
        error: "Invalid Request",
      });
      return;
    }

    const project = await ProjectModel.findById(id);

    if (!project) {
      res.status(404).json({
        status: 404,
        error: "Project not found",
      });
      return;
    }

    if (!project.users.includes(user._id)) {
      res.status(403).json({
        status: 400,
        error: "You are not allowed to view this project",
      });
      return;
    }

    res.status(200).json({
      status: 200,
      project,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
