/**
 * apps/web/src/pages/api/v2/certificates/[username].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.11.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import ObtainedCertificateModel from "@codeup/util/dist/models/ObtainedCertificateModel";
import CourseModel from "@codeup/util/dist/models/CourseModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username } = req.query;

    const result: {
      course: any;
      obtained: any;
    }[] = [];

    const certs = await ObtainedCertificateModel.find({
      username,
    });

    for (const cert of certs) {
      const course = await CourseModel.findById(cert.course);
      result.push({
        course,
        obtained: cert,
      });
    }

    res.status(200).json({
      status: 200,
      data: result,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
