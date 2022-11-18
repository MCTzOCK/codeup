/**
 * apps/web/src/pages/api/course/[course]/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.11.2022
 *
 */

import CourseModel from "@codeup/util/src/models/CourseModel";

import mongoConnect from "@codeup/util/src/mongo";

import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { course: courseQuery } = req.query;

  if (req.method !== "GET") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  try {
    await mongoConnect();

    let course = await CourseModel.findOne({
      friendlyName: courseQuery,
    });

    if (!course) {
      course = await CourseModel.findById(courseQuery);

      if (!course) {
        res.status(404).json({
          error: "Course not found",
        });
        return;
      }
    }

    if (!course.available) {
      res.status(404).json({
        error: "Course not found",
      });
      return;
    }

    res.status(200).json({
      course,
    });
  } catch (e) {
    res.status(500).json({
      // @ts-ignore
      error: e.message,
    });
  }
}
