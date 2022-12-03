/**
 * apps/web/src/pages/api/certificates/my.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.12.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import ObtainedCertificateModel from "@codeup/util/src/models/ObtainedCertificateModel";
import CourseModel from "@codeup/util/src/models/CourseModel";
import mongoConnect from "@codeup/util/src/mongo";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  const token = req.headers["x-jwt"] as string;

  if (jwt.verify(token, process.env.JWT_SECRET as string)) {
    const decoded = jwt.decode(token) as any;

    await mongoConnect();

    const user = await UserModel.findOne({
      _id: decoded.id,
    });

    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
      return;
    }

    const certs = await ObtainedCertificateModel.find({
      username: user.username,
    });

    const c = certs.map((c) => c.toObject());

    for (const cert of c) {
      const course = await CourseModel.findOne({ _id: cert.course });
      cert.course = course.name;
      delete cert.screenshot;
    }

    res.status(200).json({
      certs: c,
    });
  } else {
    res.status(401).json({
      error: "Invalid token",
    });
  }
}
