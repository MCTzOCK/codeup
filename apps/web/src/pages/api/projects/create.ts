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
import { Octokit } from "octokit";

const oc = new Octokit({
  auth: process.env.GITHUB_PAT,
});
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

    await oc.request("POST /repos/{template_owner}/{template_repo}/generate", {
      template_owner: "CodeUpProjects",
      template_repo: "template-" + projectType,
      owner: "CodeUpProjects",
      name: project._id,
      include_all_branches: false,
      private: true,
    });

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
