/**
 * apps/web/src/pages/api/kids/projects.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.04.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import CodeUpKidsProjectModel from "@codeup/util/src/models/CodeUpKidsProjectModel";
import UserModel from "@codeup/util/dist/models/UserModel";
import jwt from "jsonwebtoken";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.headers["x-jwt"]) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  try {
    await mongoConnect();

    const decoded = jwt.verify(
      req.headers["x-jwt"] as string,
      process.env.JWT_SECRET as string
    );

    const user = await UserModel.findById((decoded as any).id);

    if (!user) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    if (req.method === "GET") {
      if (!req.query.id) {
        const projects = await CodeUpKidsProjectModel.find({
          owner: user._id,
        });

        res.status(200).json({
          projects,
        });
        return;
      }

      const project = await CodeUpKidsProjectModel.findById(req.query.id);

      if (!project) {
        res.status(404).json({
          error: "Not Found",
        });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        user.role !== "admin"
      ) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      res.status(200).json({
        project,
      });
      return;
    }

    if (req.method === "POST") {
      if (!req.body || !req.body.name) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const project = await CodeUpKidsProjectModel.create({
        owner: user._id,
        name: req.body.name,
        code:
          req.body.code ||
          '<xml><block type="start" id="|(^9%DCME)E4UEoWv~G]" x="134" y="70"></block></xml>',
      });

      res.status(200).json({
        project,
        success: true,
      });
      return;
    }

    if (req.method === "PUT") {
      if (!req.body || !req.body.id || !req.body.update) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const project = await CodeUpKidsProjectModel.findById(req.body.id);

      if (!project) {
        res.status(404).json({
          error: "Not Found",
        });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        user.role !== "admin"
      ) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      if (req.body.update.name) {
        project.name = req.body.update.name;
      }

      if (req.body.update.code) {
        project.code = req.body.update.code;
      }

      await project.save();

      res.status(200).json({
        project,
        success: true,
      });
      return;
    }

    if (req.method === "DELETE") {
      if (!req.body || !req.body.id) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const project = await CodeUpKidsProjectModel.findById(req.body.id);

      if (!project) {
        res.status(404).json({
          error: "Not Found",
        });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        user.role !== "admin"
      ) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      await project.delete();

      res.status(200).json({
        success: true,
      });
      return;
    }

    res.status(405).json({
      error: "Method Not Allowed",
    });
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
}
