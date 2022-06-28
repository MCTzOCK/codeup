/**
 * src/pages/api/course/update-progress.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.06.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import mongoConnect from "../../../util/mongo";
import UserModel from "../../../util/models/UserModel";
import CourseStatsModel from "../../../util/models/CourseStatsModel";
import CourseDB from "../../../util/courses/CourseDB";

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

  if (!req.body || !req.body.token || !req.body.course) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  if (
    !CourseDB.courses.find((course) => {
      return course.name === req.body.course;
    })
  ) {
    res.status(400).json({
      error: "This Course is not valid",
      validCourses: CourseDB.courses,
    });
  }

  // @ts-ignore
  jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      res.status(400).json({
        error: "Invalid Token",
      });
      return;
    }

    await mongoConnect();

    const user = await UserModel.findById((decoded as any).id as string);

    if (!user) {
      res.status(400).json({
        error: "Invalid token",
      });
      return;
    }

    const current = await CourseStatsModel.findOne({
      user: user._id,
      course: req.body.course.toLowerCase(),
    });

    if (current) {
      res.status(400).json({
        error: "You've already started this course.",
      });
      return;
    }

    const course = await CourseStatsModel.create({
      course: req.body.course.toLowerCase(),
      user: user._id,
      started: true,
      currentSection: 0,
      finished: false,
    });

    res.status(200).json({
      success: true,
      courseStats: course,
    });
  });
}
