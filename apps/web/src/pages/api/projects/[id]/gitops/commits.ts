/**
 * apps/web/src/pages/api/projects/[id]/gitops/commits.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import { isLoggedIn } from "../../../../../global/server/isLoggedIn";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import * as fs from "fs";
import * as path from "path";
import simpleGit from "simple-git";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await mongoConnect();

    if (req.method !== "GET") {
      return res.status(405).json({
        status: 405,
        error: "Method not allowed",
      });
    }

    if (!req.query.id) {
      return res.status(400).json({
        status: 400,
        error: "Missing data",
      });
    }

    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const project = await ProjectModel.findById(req.query.id as string);

    if (!project) {
      return res.status(404).json({
        status: 404,
        error: "Project not found",
      });
    }

    if (!project.users.includes(user._id)) {
      return res.status(403).json({
        status: 403,
        error: "You are not allowed to access this project",
      });
    }

    if (
      !fs.existsSync(
        path.join(process.env.GIT_DATA_HOME as string, project._id.toString())
      )
    ) {
      return res.status(404).json({
        status: 404,
        error: "Project not found",
      });
    }

    const GIT_HOME = process.env.GIT_DATA_HOME as string;

    const git = simpleGit({
      baseDir: path.join(GIT_HOME, project._id.toString()),
    });

    const x = await git.log();
    const all_commits = x.all;
    const total_commits = x.total;

    res.status(200).json({
      status: 200,
      data: {
        all: all_commits,
        total: total_commits,
      },
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
