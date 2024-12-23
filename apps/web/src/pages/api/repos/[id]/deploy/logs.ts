/**
 * apps/web/src/pages/api/repos/[id]/deploy/logs.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.12.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../../global/server/isLoggedIn";
import RepositoryModel from "@codeup/util/dist/models/RepositoryModel";
import Dockerode from "dockerode";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
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
        error: "Project not found",
      });
      return;
    }

    if (repo.user.toString() !== user._id.toString()) {
      res.status(403).json({
        status: 400,
        error: "You are not allowed to view this repo",
      });
      return;
    }

    const docker = new Dockerode();

    docker.listContainers({ all: true }, async (err, containers) => {
      if (err) {
        res.status(500).json({
          status: 500,
          error: err,
        });
        return;
      }

      for (const c of containers as any[]) {
        if (c.Names.includes(`/${repo.username}_${repo._id.toString()}`)) {
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
      }

      res.status(404).json({
        status: 404,
        error: "Container not found",
      });
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
