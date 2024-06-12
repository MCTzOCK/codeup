/**
 * apps/web/src/pages/api/projects/[id]/files/[[...path]].ts
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
import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await mongoConnect();

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

    const file = req.query.path as string[];

    const baseDir = path.resolve(
      process.env.GIT_DATA_HOME as string,
      project._id.toString()
    );

    const relativePath = path.join(baseDir, file.join("/"));

    if (!path.resolve(relativePath).startsWith(baseDir)) {
      res.status(403).json({
        status: 403,
        error: "You are not allowed to access this file",
      });
      return;
    }
    if (req.method === "GET") {
      const filePath = path.resolve(baseDir, relativePath);

      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          status: 404,
          error: "File not found",
        });
        return;
      }

      const content = fs.readFileSync(filePath, "utf-8");

      res.status(200).json({
        status: 200,
        data: content,
      });
    } else if (req.method === "POST") {
      const filePath = path.resolve(baseDir, relativePath);

      if (req.body.folder) {
        fs.mkdirSync(filePath, { recursive: true });
        res.status(200).json({
          status: 200,
          data: "Folder created",
        });

        return;
      }

      const content = req.body.content;

      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      fs.writeFileSync(filePath, content);

      res.status(200).json({
        status: 200,
        data: "File saved",
      });
    } else if (req.method === "DELETE") {
      const filePath = path.resolve(baseDir, relativePath);

      if (!filePath.startsWith(baseDir)) {
        res.status(403).json({
          status: 403,
          error: "You are not allowed to access this file",
        });
        return;
      }

      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          status: 404,
          error: "File not found",
        });
        return;
      }

      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmdirSync(filePath, { recursive: true });
      } else {
        fs.unlinkSync(filePath);
      }

      res.status(200).json({
        status: 200,
        data: "File deleted",
      });
    } else if (req.method === "PUT") {
      const filePath = path.resolve(baseDir, relativePath);
      const newFilePath = path.resolve(
        baseDir,
        path.join(path.dirname(relativePath), req.body.newName)
      );

      if (!fs.existsSync(filePath))
        return res.status(404).json({
          status: 404,
          error: "File not found",
        });

      if (fs.existsSync(newFilePath))
        return res.status(409).json({
          status: 409,
          error: "File already exists",
        });

      if (!newFilePath.startsWith(baseDir))
        return res.status(403).json({
          status: 403,
          error: "You are not allowed to access this file",
        });

      fs.renameSync(filePath, newFilePath);

      res.status(200).json({
        status: 200,
        data: "File renamed",
      });
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
