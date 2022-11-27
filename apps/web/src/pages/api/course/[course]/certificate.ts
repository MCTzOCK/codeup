/**
 * apps/web/src/pages/api/course/[course]/certificate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.11.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import CourseModel from "@codeup/util/src/models/CourseModel";
import Certificate from "@codeup/util/src/models/Certificate";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { course } = req.query;

  try {
    await mongoConnect();

    let courseObject = await CourseModel.findById(course);

    if (!courseObject) {
      courseObject = await CourseModel.findOne({
        friendlyName: course,
      });
    }

    if (!courseObject) {
      res.status(404).json({
        error: "Course not found",
      });
    }

    let certificate = await Certificate.findOne({
      course: courseObject._id,
    });

    if (!certificate) {
      res.status(404).json({
        error: "Certificate not found",
      });
      return;
    }

    if (req.query.onlyLookup && req.query.onlyLookup === "true") {
      res.status(200).json({
        certificate: certificate._id,
      });
      return;
    }

    let certificateObject = certificate.toObject();

    for (const step of certificateObject.steps) {
      if (step.step_type === "MULTIPLE_CHOICE") {
        for (const answer of step.multiple_choice.answers) {
          delete answer.correct;
        }
      } else if (step.step_type === "TEXT") {
        for (const a of step.text_parts) {
          if (a.type === "INPUT") {
            delete a.value;
          }
        }
      }
    }

    res.status(200).json({ certificateObject });
  } catch (e) {
    // @ts-ignore
    if (e.message) {
      // @ts-ignore
      res.status(500).json({ error: "Internal Server Error: " + e.message });
    } else {
      res.status(500).json({ error: "Unknown internal server error" });
    }
  }
}
