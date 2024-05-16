/**
 * apps/web/src/pages/api/course/enrollments.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/dist/models/UserModel";
import CourseEnrollment from "@codeup/util/src/models/CourseEnrollment";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await mongoConnect();
    if (req.method !== "GET") {
      res.status(405).json({
        error: "Method not allowed",
      });
      return;
    }

    if (!req.headers["x-jwt"]) {
      res.status(404).json({
        error: "Unauthorized",
      });
      return;
    }

    jwt.verify(
      req.headers["x-jwt"] as string,
      // @ts-ignore
      process.env.JWT_SECRET as string,
      async (err, decoded) => {
        const user = await UserModel.findOne({ _id: (decoded as any).id });

        if (!user) {
          res.status(401).json({
            error: "Unauthorized",
          });
          return;
        }

        const enrollments = await CourseEnrollment.find({
          user: user._id,
        });

        for (const e of enrollments) {
          await e.populate("course");
        }

        res.status(200).json({
          enrollments,
        });
      }
    );
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
