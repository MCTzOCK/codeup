/**
 * apps/web/src/pages/api/projects/[id]/delete.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.06.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import { isLoggedIn } from "../../../../global/server/isLoggedIn";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import ProjectFlowModel from "@codeup/util/dist/models/ProjectFlowModel";
import ProjectI18nModel from "@codeup/util/dist/models/ProjectI18nModel";
import ProjectIssueModel from "@codeup/util/dist/models/ProjectIssueModel";
import ProjectUMLModel from "@codeup/util/dist/models/ProjectUMLModel";
import ProjectWikiPageModel from "@codeup/util/dist/models/ProjectWikiPageModel";
import { getS3 } from "../../../../global/getS3";
import { JobStatus } from "../../../../global/server/jobs";
import Dockerode from "dockerode";

const docker = new Dockerode();

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

    const s3 = getS3();

    await s3.removeBucket("codeup-project-" + project._id.toString());

    docker.listContainers({ all: true }, async (err, containers) => {
      if (err) {
        console.log(err);
        return;
      }

      for await (const c of containers as any[]) {
        if (c.Names.includes("/" + project._id.toString())) {
          await docker.getContainer(c.Id).remove({
            force: true,
          });
        }
      }

      await ProjectFlowModel.deleteMany({ project: project._id });
      await ProjectI18nModel.deleteMany({ project: project._id });
      await ProjectIssueModel.deleteMany({ project: project._id });
      await ProjectUMLModel.deleteMany({ project: project._id });
      await ProjectWikiPageModel.deleteMany({ project: project._id });
      await ProjectModel.deleteOne({ _id: project._id });

      res.status(200).json({
        status: 200,
        message: "Project deleted",
      });
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
