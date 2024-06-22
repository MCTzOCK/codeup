/**
 * apps/web/src/pages/api/projects/[id]/deployment/build.ts
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
import { Job, Jobs, JobStatus } from "../../../../../global/server/jobs";
import Dockerode from "dockerode";
import path from "path";
import fs from "fs";
import * as tar from "tar";
import { tmpdir } from "node:os";

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
      const { job_id } = req.query;
      if (!job_id) {
        res.status(200).json({
          status: 200,
          jobs: Jobs.getJobsByNames(project._id.toString()).map((j) => j.id),
        });
        return;
      }

      const job = Jobs.getJobByID(job_id as string);

      if (!job) {
        res.status(404).json({
          status: 404,
          error: "Job not found",
        });
        return;
      }

      res.status(200).json({
        status: 200,
        job,
      });
    } else if (req.method === "POST") {
      const job = new Job(project._id.toString());

      res.status(200).json({
        status: 200,
        job_id: job.id,
      });

      job.setStatus(JobStatus.BUILDING);

      try {
        tar
          .create(
            {
              cwd: path.join(
                process.env.GIT_DATA_HOME as string,
                project._id.toString()
              ),
              file: path.join(
                process.env.GIT_DATA_HOME as string,
                project._id.toString() + ".tar"
              ),
            },
            [
              ...fs.readdirSync(
                path.join(
                  process.env.GIT_DATA_HOME as string,
                  project._id.toString()
                )
              ),
            ]
          )
          .then(() => {
            // remove existing container
            docker.listContainers({ all: true }, async (err, containers) => {
              if (err) {
                console.log(err);
                job.setStatus(JobStatus.FAILED);
                return;
              }

              for await (const c of containers as any[]) {
                if (c.Names.includes("/" + project._id.toString())) {
                  await docker.getContainer(c.Id).remove({
                    force: true,
                  });
                }
              }

              docker.buildImage(
                path.join(
                  process.env.GIT_DATA_HOME as string,
                  project._id.toString() + ".tar"
                ),
                {
                  t: project._id.toString(),
                },
                async (err, res) => {
                  if (err) {
                    console.log(err);
                    job.setStatus(JobStatus.FAILED);
                    return;
                  }

                  const port =
                    JSON.parse(
                      fs
                        .readFileSync(
                          path.join(
                            process.env.GIT_DATA_HOME as string,
                            project._id.toString(),
                            "project.codeup.json"
                          )
                        )
                        .toString()
                    ).port || 80;

                  const pb: any = {};
                  let hostPort = Math.floor(Math.random() * 32000) + 1;

                  pb[port + "/tcp"] = [{ HostPort: hostPort.toString() }];

                  const c = await docker.createContainer({
                    Image: project._id.toString(),
                    Env: [],
                    name: project._id.toString(),
                    HostConfig: {
                      PortBindings: pb,
                    },
                  });

                  await c.start();

                  job.setStatus(JobStatus.FINISHED);
                }
              );
            });
          })
          .catch((err) => {
            console.log(err);
            job.setStatus(JobStatus.FAILED);
          });
      } catch (e: any) {
        console.log(e);
        job.setStatus(JobStatus.FAILED);
      }
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
