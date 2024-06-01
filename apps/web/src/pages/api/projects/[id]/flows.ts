/**
 * apps/web/src/pages/api/projects/[id]/flows.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.06.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import { isLoggedIn } from "../../../../global/server/isLoggedIn";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import ProjectFlowModel from "@codeup/util/dist/models/ProjectFlowModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await mongoConnect();

    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const project = await ProjectModel.findById(req.query.id);

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

    if (req.method === "GET") {
      if (req.query.flowId) {
        const flow = await ProjectFlowModel.findById(
          req.query.flowId as string
        );

        if (flow.project.toString() !== project._id.toString()) {
          res.status(403).json({
            status: 403,
            error: "You are not allowed to view this flow",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          flow,
        });
        return;
      }

      const flows = await ProjectFlowModel.find({
        project: project._id,
      });

      res.status(200).json({
        status: 200,
        flows,
      });
      return;
    } else if (req.method === "POST") {
      const flow = await ProjectFlowModel.create({
        project: project._id,
        saved: "",
        name: req.body.name,
      });

      res.status(200).json({
        status: 200,
        flow,
      });
      return;
    } else if (req.method === "PUT") {
      const flow = await ProjectFlowModel.findById(req.query.flowId as string);

      if (flow.project.toString() !== project._id.toString()) {
        res.status(403).json({
          status: 403,
          error: "You are not allowed to edit this flow",
        });
        return;
      }

      flow.saved = req.body.saved;
      flow.name = req.body.name;

      await flow.save();

      res.status(200).json({
        status: 200,
        flow,
      });
    } else if (req.method === "DELETE") {
      const flow = await ProjectFlowModel.findById(req.query.flowId as string);

      if (flow.project.toString() !== project._id.toString()) {
        res.status(403).json({
          status: 403,
          error: "You are not allowed to delete this flow",
        });
        return;
      }

      await flow.delete();

      res.status(200).json({
        status: 200,
        flow,
      });
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
