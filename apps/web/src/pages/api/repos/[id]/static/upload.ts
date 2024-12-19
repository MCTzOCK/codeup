/**
 * apps/web/src/pages/api/repos/[id]/static/upload.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.12.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import { isLoggedIn } from "../../../../../global/server/isLoggedIn";
import fs from "fs";
import { randomBytes } from "crypto";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import { tmpdir } from "node:os";
import { getS3 } from "../../../../../global/getS3";
import RepositoryModel from "@codeup/util/dist/models/RepositoryModel";

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

    const repo = await RepositoryModel.findById(id);

    if (!repo) {
      res.status(404).json({
        status: 404,
        error: "Repository not found",
      });
      return;
    }

    if (repo.user.toString() !== user._id.toString()) {
      res.status(403).json({
        status: 400,
        error: "You are not allowed to view this repository",
      });
      return;
    }

    const { content, name } = req.body;

    const nameX = tmpdir() + "/" + randomBytes(16).toString("hex");

    fs.writeFileSync(nameX, content, "base64");

    const client = getS3();

    await client.fPutObject(
      `codeup-project-${repo._id.toString()}`,
      name,
      nameX
    );

    res.status(200).json({
      status: 200,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
