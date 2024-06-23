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
import { NProxyMGR } from "../../../../../global/server/nproxymgr";

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
      const { job_id, latest } = req.query;
      if (job_id) {
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
        return;
      } else if (latest) {
        const jobs = Jobs.getJobsByNames(project._id.toString());

        if (!jobs) {
          res.status(404).json({
            status: 404,
            error: "Job not found",
          });
          return;
        }

        const latest = jobs.sort(
          (a, b) => a.startedAt.getTime() - b.startedAt.getTime()
        );

        res.status(200).json({
          status: 200,
          job: latest[0] === undefined ? null : latest[0],
        });
        return;
      }
      res.status(200).json({
        status: 200,
        jobs: Jobs.getJobsByNames(project._id.toString()),
      });
      return;
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

              console.log(
                "Building image for project " + project._id.toString() + "..."
              );

              const stream = await docker.buildImage(
                path.join(
                  process.env.GIT_DATA_HOME as string,
                  project._id.toString() + ".tar"
                ),
                {
                  t: project._id.toString(),
                }
              );

              docker.modem.followProgress(stream, async (err, res) => {
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

                console.log(
                  "Deploying project " +
                    project._id.toString() +
                    " to port " +
                    hostPort.toString() +
                    "..."
                );

                job.setStatus(JobStatus.DEPLOYING);

                const c = await docker.createContainer({
                  Image: project._id.toString(),
                  Env: [],
                  name: project._id.toString(),
                  HostConfig: {
                    PortBindings: pb,
                  },
                });

                await c.start();

                console.log(
                  "Started project " +
                    project._id.toString() +
                    " on port " +
                    hostPort.toString() +
                    "..."
                );

                const nproxy = new NProxyMGR();
                await nproxy.getToken();

                const eId = await nproxy.existsProxy(
                  `${project._id.toString()}.codeup.space`
                );

                if (eId > -1) {
                  await nproxy.deleteProxy(eId);
                }

                await nproxy.createProxy({
                  domain_names: [`${project._id.toString()}.codeup.space`],
                  forward_scheme: "http",
                  forward_host: process.env
                    .NPROXYMGR_REAL_SRV_ENDPOINT as string,
                  forward_port: hostPort,
                  allow_websocket_upgrade: true,
                  access_list_id: "0",
                  certificate_id: parseInt(
                    process.env.NPROXYMGR_WD_CERT_ID as string
                  ),
                  ssl_forced: true,
                  meta: { letsencrypt_agree: false, dns_challenge: false },
                  advanced_config: "",
                  locations: [],
                  block_exploits: false,
                  caching_enabled: false,
                  http2_support: false,
                  hsts_enabled: false,
                  hsts_subdomains: false,
                });
                console.log(
                  "Deployed project " +
                    project._id.toString() +
                    " to port " +
                    hostPort.toString() +
                    "..."
                );
                job.setStatus(JobStatus.FINISHED);
              });
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
