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
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/dist/models/UserModel";
import OrgModel from "@codeup/util/dist/models/OrgModel";

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

    let content = await ContentModel.findOne({
      course: course._id,
      url: section,
    });

    if (!content) {
      content = await ContentModel.findById(section);

      if (!content) {
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

      sendResponse(req, res, content);
      return;
    }

    jwt.verify(
      req.headers["x-jwt"] as string,
      // @ts-ignore
      process.env.JWT_SECRET as string,
      async (err, decoded) => {
        const user = await UserModel.findOne({ _id: (decoded as any).id });

        if (user.role === "admin" || course.available === "public") {
          sendResponse(req, res, content);
          return;
        }

        if (course.available === "private") {
          if (course.creator === user.username) {
            sendResponse(req, res, content);
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
            sendResponse(req, res, content);
            return;
          }

          if (org.members.includes(user._id)) {
            sendResponse(req, res, content);
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
      error: "Internal Server Error",
    });
  }
}

function sendResponse(req: any, res: any, content: any) {
  if (req.query.raw) {
    res.status(200).end(content.textContent);
    return;
  }
  res.status(200).json({
    content: content,
    success: true,
  });
}
