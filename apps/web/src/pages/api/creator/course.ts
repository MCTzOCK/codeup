/**
 * apps/web/src/pages/api/creator/course.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.11.2022
 *
 */

import UserModel from "@codeup/util/src/models/UserModel";
import CourseModel from "@codeup/util/src/models/CourseModel";
import mongoConnect from "@codeup/util/src/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!["GET", "POST", "DELETE"].includes(req.method as string)) {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const token = req.headers["x-jwt"];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    if (!verify(token as string, process.env.JWT_SECRET as string)) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as any;

    await mongoConnect();

    const editorUser = await UserModel.findOne({ username: decoded.username });

    if (!editorUser) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    if (!["editor", "admin"].includes(editorUser.role)) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    if (req.method === "GET") {
      const courses = await CourseModel.find({
        creator: editorUser.username,
      });

      res.status(200).json({ courses });
      return;
    } else if (req.method === "POST") {
      const { name, friendlyName, description, splashImage } = req.body;

      if (!name || !friendlyName || !description || !splashImage) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const existingCourse = await CourseModel.findOne({
        friendlyName: friendlyName,
      });

      if (existingCourse) {
        res.status(400).json({
          error: "URL freundlicher Name bereits vergeben",
        });
        return;
      }

      const course = await CourseModel.create({
        name: name,
        friendlyName: friendlyName,
        description: description,
        splashImage: splashImage,
        available: false,
        creator: editorUser.username,
      });

      res.status(200).json({
        course: course,
      });
    }
  } catch (e) {
    // @ts-ignore
    if (e.message) {
      // @ts-ignore
      res.status(500).json({ error: e.message });
    } else {
      res
        .status(500)
        .json({ error: "Internal Server Error with no specific message" });
    }
  }
}
