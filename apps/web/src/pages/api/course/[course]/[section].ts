/**
 * apps/web/src/pages/api/course/[course]/[section].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.11.2022
 *
 */

import CourseModel from "@codeup/util/src/models/CourseModel";
import ContentModel from "@codeup/util/src/models/ContentModel";
import mongoConnect from "@codeup/util/src/mongo";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { course: courseQuery, section } = req.query;

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

    let content = await ContentModel.findOne({
      course: course._id,
      url: section,
    });

    if (!content) {
      content = await ContentModel.findById(section);

      if (!content) {
        res.status(404).json({
          error: "Section not found",
        });
        return;
      }
    }

    if (req.query.raw) {
      res.status(200).end(content.textContent);
      return;
    }

    res.status(200).json({
      content: content,
      success: true,
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
