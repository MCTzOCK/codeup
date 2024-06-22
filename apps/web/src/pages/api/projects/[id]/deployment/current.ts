/**
 * apps/web/src/pages/api/projects/[id]/deployment/current.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.06.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import { isLoggedIn } from "../../../../../global/server/isLoggedIn";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import Dockerode from "dockerode";
import { JobStatus } from "../../../../../global/server/jobs";

const docker = new Dockerode();

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
      docker.listContainers({ all: true }, async (err, containers) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: 500,
            error: err,
          });
          return;
        }

        for await (const c of containers as any[]) {
          if (c.Names.includes("/" + project._id.toString())) {
            if (req.query.logs) {
              const container = docker.getContainer(c.Id);
              const logs = await container.logs({
                stdout: true,
                stderr: true,
                follow: false,
              });

              res.status(200).json({
                status: 200,
                logs: logs.toString(),
              });
              return;
            }
            res.status(200).json({
              status: 200,
              state: c.State,
              createdAt: c.Created,
            });
            return;
          }
        }
      });
    } else {
      res.status(405).json({
        status: 405,
        error: "Method not allowed",
      });
      return;
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
