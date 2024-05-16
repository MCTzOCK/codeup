/**
 * apps/web/src/pages/api/course/[course]/progress.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import CourseModel from "@codeup/util/dist/models/CourseModel";
import OrgModel from "@codeup/util/dist/models/OrgModel";
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/dist/models/UserModel";
import CourseSectionProgressModel from "@codeup/util/dist/models/CourseSectionProgressModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { course: courseQuery } = req.query;
    await mongoConnect();

    if (!["POST", "GET"].includes(req.method as string)) {
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

          if (!(await hasAccessToCourse(course, user))) {
            res.status(403).json({
              error: "Forbidden",
            });
            return;
          }

          const progress = await CourseSectionProgressModel.find({
            user: user._id,
            course: course._id,
          });

          res.status(200).json({
            status: 200,
            progress: [
              ...progress.map((p) => {
                return p.section;
              }),
            ],
          });
          return;
        }

        if (req.method === "POST") {
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
            res.status(403).json({
              error: "Forbidden",
            });
            return;
          }

          const { section } = req.body;

          const progress = await CourseSectionProgressModel.findOne({
            user: user._id,
            course: course._id,
            section,
          });

          if (!progress) {
            await CourseSectionProgressModel.create({
              user: user._id,
              course: course._id,
              section,
            });
          }

          res.status(200).json({
            status: 200,
            message: "Progress saved",
          });
          return;
        }
      }
    );
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
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
