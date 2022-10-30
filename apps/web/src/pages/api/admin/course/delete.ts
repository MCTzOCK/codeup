/**
 * apps/web/src/pages/api/admin/course/delete.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.10.2022
 *
 */
import mongoConnect from "@codeup/util/src/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import CourseModel from "@codeup/util/src/models/CourseModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  try {
    await mongoConnect();

    if (!req.headers["x-jwt"]) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const { friendlyName } = req.body;

    if (!friendlyName) {
      res.status(400).json({
        error: "Bad request",
      });
      return;
    }

    if (
      !verify(req.headers["x-jwt"] as string, process.env.JWT_SECRET as string)
    ) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = verify(
      req.headers["x-jwt"] as string,
      process.env.JWT_SECRET as string
    ) as any;

    const adminuser = await UserModel.findOne({ username: decoded.username });

    if (!adminuser.admin) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const course = await CourseModel.findOne({ friendlyName: friendlyName });

    if (!course) {
      res.status(404).json({
        error: "Course not found",
      });
      return;
    }

    await course.remove();

    res.status(200).json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
