/**
 * apps/web/src/pages/api/discovery/star.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.03.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import IDEProjectModel from "@codeup/util/src/models/IDEProjectModel";
import UserModel from "@codeup/util/dist/models/UserModel";
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";
import mongoConnect from "@codeup/util/dist/mongo";
import jwt from "jsonwebtoken";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.headers["x-jwt"]) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  if (!req.body || !req.body.projectId) {
    res.status(400).json({
      error: "Bad Request",
    });
    return;
  }

  try {
    await mongoConnect();

    jwt.verify(
      req.headers["x-jwt"] as string,
      // @ts-ignore
      process.env.JWT_SECRET,
      async (err: any, decoded: any) => {
        if (err) throw err;

        const user = await UserModel.findById((decoded as any).id);

        if (!user) {
          res.status(401).json({
            error: "Unauthorized",
          });
          return;
        }

        const project = await EditorProjectModel.findOne({
          _id: req.body.projectId,
        });

        if (!project) {
          res.status(404).json({
            error: "Not Found",
          });
          return;
        }

        if (project.discoveryLikes.includes(user._id.toString())) {
          project.discoveryLikes = project.discoveryLikes.filter(
            (id: any) => id.toString() !== user._id.toString()
          );
        } else {
          project.discoveryLikes.push(user._id);
        }

        await project.save();

        res.status(200).json({
          success: true,
          stars: project.discoveryLikes,
        });
      }
    );
  } catch (e: any) {
    res.status(500).json({ error: e.message, success: false });
  }
};
