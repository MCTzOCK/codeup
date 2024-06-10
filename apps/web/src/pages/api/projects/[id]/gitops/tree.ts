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
      content?: any;
    };

    let tree: entry[] = [];

    const walk = (dir: string, parent: entry) => {
      const files = fs.readdirSync(dir);
      const children: entry[] = [];
      for (const file of files) {
        //if (file === ".git") continue;
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
          let content = "";
          if (req.query.withContent) {
            content = fs.readFileSync(path.join(dir, file), "utf-8");
          }
          children.push({
            name: file,
            type: "file",
            children: [],
            content,
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

    let x: {
      [key: string]: any;
    } = {};

    const createWCStructure = (
      e: entry
    ): {
      [key: string]: any;
    } => {
      let result: any = {};

      for (const c of e.children) {
        if (c.type === "directory") {
          result[c.name] = {
            directory: createWCStructure(c),
          };
        } else {
          result[c.name] = {
            file: {
              contents: c.content,
            },
          };
        }
      }

      return result;
    };
    if (req.query.withContent && req.query.withContent === "webcontainer") {
      x = createWCStructure(parent);
    }

    res.status(200).json({
      status: 200,
      tree,
      data: x,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
