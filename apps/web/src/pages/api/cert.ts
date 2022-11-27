/**
 * apps/web/src/pages/api/cert.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.11.2022
 *
 */

import ObtainedCertificateModel from "@codeup/util/src/models/ObtainedCertificateModel";
import CourseModel from "@codeup/util/src/models/CourseModel";
import mongoConnect from "@codeup/util/src/mongo";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.query.id) {
    res.status(400).json({
      error: "Missing id",
    });
    return;
  }

  try {
    await mongoConnect();

    const obtainedCertificate = await ObtainedCertificateModel.findOne({
      _id: req.query.id,
    });

    if (!obtainedCertificate) {
      res.status(404).json({
        error: "Certificate not found",
      });
      return;
    }

    const course = await CourseModel.findOne({
      _id: obtainedCertificate.course,
    });

    if (!course) {
      res.status(404).json({
        error: "Course not found",
      });
      return;
    }

    res.status(200).json({
      obtainedCertificate,
      course,
    });
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
