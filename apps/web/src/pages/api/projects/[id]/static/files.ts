/**
 * apps/web/src/pages/api/projects/[id]/static/files.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import { isLoggedIn } from "../../../../../global/server/isLoggedIn";
import { getS3 } from "../../../../../global/getS3";

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

    const client = getS3();

    if (req.method === "GET") {
      const files = client.listObjectsV2(
        "codeup-project-" + project._id,
        "",
        true
      );

      let filesArray = [];

      for await (const file of files) {
        filesArray.push(file);
      }

      res.status(200).json({
        status: 200,
        filesArray,
      });
    } else if (req.method === "DELETE") {
      const { file } = req.body;

      if (!file) {
        res.status(400).json({
          status: 400,
          error: "Invalid Request",
        });
        return;
      }

      await client.removeObjects("codeup-project-" + project._id, [file]);

      res.status(200).json({
        status: 200,
        message: "File deleted",
      });
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
