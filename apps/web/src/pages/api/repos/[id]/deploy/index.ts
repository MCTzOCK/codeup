/**
 * apps/web/src/pages/api/repos/[id]/deploy/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.12.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../../global/server/isLoggedIn";
import RepositoryModel from "@codeup/util/dist/models/RepositoryModel";
import fs from "fs";
import { exec, execSync } from "child_process";

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

    const pathName = `/tmp/${repo._id}_${new Date().getTime()}`;

    fs.mkdirSync(pathName, {
      recursive: true,
    });

    const cloneProcess = exec(
      `git clone ${process.env.GIT_SERVER_URL}/${repo.username}/${repo.name} --depth 1 .`,
      {
        cwd: pathName,
      }
    );

    cloneProcess.on("exit", async (code) => {
      if (code !== 0) {
        res.status(500).json({
          status: 500,
          error: "Error while cloning",
        });
        return;
      }

      if (repo.deploymentType === "static") {
        const dockerfile = `FROM nginx:alpine
        COPY . /usr/share/nginx/html
        EXPOSE 80
        CMD ["nginx", "-g", "daemon off;"]`;

        const dockerfilePath = `${pathName}/Dockerfile.${new Date().getTime()}`;

        fs.writeFileSync(dockerfilePath, dockerfile);

        const imageName = `${repo.username}/${
          repo.name
        }:${new Date().getTime()}`;

        const buildProcess = exec(
          `docker build -t ${imageName} -f ${dockerfilePath} .`,
          {
            cwd: pathName,
          }
        );

        buildProcess.on("exit", async (code) => {
          if (code !== 0) {
            res.status(500).json({
              status: 500,
              error: "Error while building",
            });
            return;
          }

          const rmPrevious = exec(
            `docker container rm -f ${repo.username}_${repo._id}`
          );

          rmPrevious.on("exit", async () => {
            const runProcess = exec(
              // TODO: Find valid port
              `docker run -d -p 80:80 --name ${repo.username}_${repo._id} ${imageName}`
            );

            runProcess.on("exit", async (code) => {
              if (code !== 0) {
                res.status(500).json({
                  status: 500,
                  error: "Error while running",
                });
                return;
              }

              res.status(200).json({
                status: 200,
                message: "Deployed",
              });
            });
          });
        });
      }
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
