/**
 * apps/web/src/pages/api/projects/[id]/gitops/tree.ts
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

    type entry = {
      name: string;
      type: string;
      children: entry[];
    };

    let tree: entry[] = [];

    const walk = (dir: string, parent: entry) => {
      const files = fs.readdirSync(dir);
      const children: entry[] = [];
      for (const file of files) {
        if (file === ".git") continue;
        const stat = fs.statSync(path.join(dir, file));
        if (stat.isDirectory()) {
          const entry: entry = {
            name: file,
            type: "directory",
            children: [],
          };
          walk(path.join(dir, file), entry);
          children.push(entry);
        } else {
          children.push({
            name: file,
            type: "file",
            children: [],
          });
        }
      }

      parent.children = children;
    };

    const parent: entry = {
      name: project.name,
      type: "directory",
      children: tree,
    };
    walk(
      path.join(process.env.GIT_DATA_HOME as string, project._id.toString()),
      parent
    );

    for (const c of parent.children) {
      tree.push(c);
    }
    res.status(200).json({
      status: 200,
      data: tree,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
