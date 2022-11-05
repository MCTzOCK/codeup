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
import VideoModel from "@codeup/util/src/models/VideoModel";
import TextContentModel from "@codeup/util/src/models/TextContentModel";
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

    const course = await CourseModel.findOne({
      friendlyName: courseQuery,
    });

    if (!course) {
      res.status(404).json({
        error: "Course not found",
      });
      return;
    }

    if (!course.available) {
      res.status(404).json({
        error: "Course not found",
      });
      return;
    }

    const sectionVideo = await VideoModel.findOne({
      friendlyName: section,
    });

    if (sectionVideo) {
      res.status(200).json({
        video: sectionVideo,
        type: "video",
        success: true,
      });

      return;
    }

    const sectionText = await TextContentModel.findOne({
      friendlyName: section,
    });

    if (sectionText) {
      res.status(200).json({
        text: sectionText,
        type: "text",
        success: true,
      });

      return;
    }

    res.status(404).json({
      error: "Section not found",
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
