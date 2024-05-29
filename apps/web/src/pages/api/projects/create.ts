/**
 * apps/web/src/pages/api/projects/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import simpleGit from "simple-git";
import * as fs from "fs";
import * as path from "path";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);
    if (!auth) return;

    const { name, projectType, modifiers } = req.body;
    if (!name || !projectType || !modifiers) {
      return res.status(400).json({
        status: 400,
        error: "Missing data",
      });
    }

    const project = await ProjectModel.create({
      name,
      projectType,
      modifiers,
      users: [user._id],
    });

    const GIT_HOME = process.env.GIT_DATA_HOME as string;

    fs.mkdirSync(path.join(GIT_HOME, project._id.toString()), {
      recursive: true,
    });

    const git = simpleGit({
      baseDir: path.join(GIT_HOME, project._id.toString()),
    });

    await git.clone(
      "https://github.com/CodeUpProjects/template-" + projectType + ".git",
      "."
    );

    res.status(200).json({
      status: 200,
      data: project,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
