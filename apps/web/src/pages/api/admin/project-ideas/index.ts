/**
 * apps/web/src/pages/api/admin/project-ideas/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.12.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import ProjectIdeaModel from "@codeup/util/src/models/ProjectIdeaModel";
import UserModel from "@codeup/util/src/models/UserModel";
import mongoConnect from "@codeup/util/src/mongo";
import { verify } from "jsonwebtoken";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!["POST", "GET", "DELETE"].includes(req.method)) {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.body.username || !req.body.message) {
    res.status(400).json({
      error: "Bad Request",
    });
    return;
  }

  try {
    const jwt = req.headers["x-jwt"];
    if (!verify(jwt as string, process.env.JWT_SECRET as string)) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = verify(
      jwt as string,
      process.env.JWT_SECRET as string
    ) as any;

    const adminuser = await UserModel.findOne({ username: decoded.username });

    if (adminuser.role !== "admin") {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    await mongoConnect();

    if (req.method === "GET") {
      const ideas = await ProjectIdeaModel.find({});
      res.status(200).json({ ideas });
      return;
    } else if (req.method == "DELETE") {
      const idea = await ProjectIdeaModel.findById(req.query.id);

      if (!idea) {
        res.status(404).json({
          error: "Not Found",
        });

        return;
      }

      await idea.remove();

      res.status(200).json({
        message: "Idea deleted",
      });
    } else if (req.method == "POST") {
      if (!req.body || !req.body.title || !req.body.description) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const idea = await ProjectIdeaModel.create({
        title: req.body.title,
        description: req.body.description,
        exampleDeployedURL: req.body.exampleDeployedURL || "",
        exampleSourceURL: req.body.exampleSourceURL || "",
      });

      res.status(200).json({
        idea,
      });
    }
  } catch (e) {
    // @ts-ignore
    if (e.message) {
      res.status(500).json({
        // @ts-ignore
        error: "Internal Server Error:" + e.message,
        success: false,
      });
    } else {
      res.status(500).json({
        error: "Internal Server Error: Unknown Error",
        success: false,
      });
    }
  }
}
