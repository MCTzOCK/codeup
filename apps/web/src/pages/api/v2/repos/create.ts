/**
 * apps/web/src/pages/api/v2/repos/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.11.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../global/server/isLoggedIn";
import fs from "fs";
import path from "path";
import * as child_process from "child_process";
import RepositoryModel from "@codeup/util/src/models/RepositoryModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const {
      name,
      description,
      isPublic,
      deploymentType,
      deploymentName,
      templateURL,
    } = req.body;

    if (!name || !deploymentType || !deploymentName || !templateURL) {
      res.status(400).json({
        status: 400,
        error: "Missing required fields",
      });
      return;
    }

    const existingRepo = await RepositoryModel.findOne({
      username: user.username,
      name,
    });

    if (
      existingRepo ||
      fs.existsSync(
        path.join(process.env.GIT_SERVER_HOME as string, user.username, name)
      )
    ) {
      res.status(400).json({
        status: 400,
        error: "Repository already exists",
      });
      return;
    }

    const repo = await RepositoryModel.create({
      user: user._id,
      username: user.username,
      name,
      description,
      public: isPublic,
      deploymentType,
      deploymentName,
    });

    fs.mkdirSync(
      path.join(process.env.GIT_SERVER_HOME as string, user.username, name),
      {
        recursive: true,
      }
    );

    child_process.execSync(`git clone --bare ${templateURL} .`, {
      cwd: path.join(
        process.env.GIT_SERVER_HOME as string,
        user.username,
        name
      ),
    });

    res.status(200).json({
      status: 200,
      data: repo,
      gitUrl: "https://git.codeup.space/@" + user.username + "/" + name,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
