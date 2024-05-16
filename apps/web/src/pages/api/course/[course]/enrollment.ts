/**
 * apps/web/src/pages/api/course/[course]/enrollment.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.05.2024
 *
 */

import CourseModel from "@codeup/util/src/models/CourseModel";
import CourseEnrollmentModel from "@codeup/util/src/models/CourseEnrollment";
import mongoConnect from "@codeup/util/src/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/dist/models/UserModel";
import OrgModel from "@codeup/util/dist/models/OrgModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { course: courseQuery } = req.query;

  try {
    await mongoConnect();

    if (req.method === "GET") {
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
      }

      jwt.verify(
        req.headers["x-jwt"] as string,
        // @ts-ignore
        process.env.JWT_SECRET as string,
        async (err, decoded) => {
          const user = await UserModel.findOne({ _id: (decoded as any).id });
          if (!user) {
            res.status(401).json({
              error: "Course not found",
            });
            return;
          }

          if (!(await hasAccessToCourse(course, user))) {
            res.status(401).json({
              error: "Course not found",
            });
            return;
          }

          const enrollment = await CourseEnrollmentModel.findOne({
            course: course._id,
            user: user._id,
          });

          if (!enrollment) {
            res.status(404).json({
              error: "Not enrolled",
            });
            return;
          }

          res.status(200).json({
            success: true,
            enrolled: true,
          });
        }
      );
    } else if (req.method === "POST") {
      jwt.verify(
        req.headers["x-jwt"] as string,
        // @ts-ignore
        process.env.JWT_SECRET as string,
        async (err, decoded) => {
          const user = await UserModel.findOne({ _id: (decoded as any).id });
          if (!user) {
            res.status(401).json({
              error: "Course not found",
            });
            return;
          }

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

          if (!(await hasAccessToCourse(course, user))) {
            res.status(401).json({
              error: "Course not found",
            });
            return;
          }

          const enrollment = await CourseEnrollmentModel.findOne({
            course: course._id,
            user: user._id,
          });

          if (enrollment) {
            await enrollment.deleteOne();

            res.status(200).json({
              success: true,
              enrolled: false,
            });
            return;
          }

          const enrollmentMod = await CourseEnrollmentModel.create({
            user: user._id,
            course: course._id,
          });

          res.status(200).json({
            success: true,
            enrolled: true,
          });
        }
      );
    } else {
      res.status(405).json({
        error: "Method not allowed",
      });
      return;
    }
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

async function hasAccessToCourse(course: any, user: any): Promise<boolean> {
  if (course.available === "public" || user.role === "admin") {
    return true;
  }

  if (course.available === "private") {
    return course.creator === user.username;
  }

  if (course.available.startsWith("org:")) {
    const org = await OrgModel.findOne({
      _id: course.available.split(":")[1],
    });

    if (org.owner.toString() === user._id.toString()) {
      return true;
    }

    if (org.members.includes(user._id)) {
      return true;
    }
  }

  return false;
}
