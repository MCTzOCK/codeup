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
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/dist/models/UserModel";
import OrgModel from "@codeup/util/dist/models/OrgModel";

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

    if (!req.headers["x-jwt"]) {
      if (course.available !== "public") {
        res.status(404).json({
          error: "Course not found",
        });
        return;
      }

      res.status(200).json({
        course,
      });
      return;
    }

    jwt.verify(
      req.headers["x-jwt"] as string,
      // @ts-ignore
      process.env.JWT_SECRET as string,
      async (err, decoded) => {
        const user = await UserModel.findOne({ _id: (decoded as any).id });

        if (user.role === "admin" || course.available === "public") {
          res.status(200).json({
            course,
          });
          return;
        }

        if (course.available === "private") {
          if (course.creator === user.username) {
            res.status(200).json({
              course,
            });
          } else {
            res.status(404).json({
              error: "Course not found",
            });
          }
          return;
        }

        if (course.available.startsWith("org:")) {
          const org = await OrgModel.findOne({
            _id: course.available.split(":")[1],
          });

          if (org.owner.toString() === user._id.toString()) {
            res.status(200).json({
              course,
            });
            return;
          }

          if (org.members.includes(user._id)) {
            res.status(200).json({
              course,
            });
            return;
          }

          res.status(404).json({
            error: "Course not found",
          });
          return;
        }

        res.status(404).json({
          error: "Course not found",
        });
        return;
      }
    );
  } catch (e) {
    res.status(500).json({
      // @ts-ignore
      error: e.message,
    });
  }
}
