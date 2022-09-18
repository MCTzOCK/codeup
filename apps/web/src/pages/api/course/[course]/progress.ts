/**
 * apps/web/src/pages/api/course/progress.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.08.2022
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import CourseProgressModel from "@codeup/util/src/models/CourseProgressModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.headers["x-jwt"]) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  const query = req.query as { course: string };

  try {
    jwt.verify(
      req.headers["x-jwt"] as string,
      process.env.JWT_SECRET as string,
      async (err: VerifyErrors | null, decoded: JwtPayload | string | any) => {
        const user = await UserModel.findById((decoded as any).id);

        if (!user) {
          res.status(400).json({
            error: "User not found",
          });
          return;
        }

        if (req.method === "GET") {
          const progress = await CourseProgressModel.find({
            user: user._id,
          }).findOne({
            course: query.course,
          });

          let ret: any = {};

          if (progress) {
            ret = progress;
          } else {
            const p = await CourseProgressModel.create({
              user: user._id,
              course: query.course,
              finishedCourse: false,
              finishedModules: [],
            });

            await p.save();
            ret = p;
          }

          res.status(200).json({
            success: true,
            progress: ret,
          });
          return;
        } else {
          if (!req.body.updateValue) {
            res.status(400).json({
              error: "Missing updateValue",
            });
            return;
          }

          if (
            !["finishedCourse", "finishedModules"].includes(
              req.body.updateValue
            )
          ) {
            res.status(400).json({
              error:
                "Invalid updateValue, must be finishedCourse or finishedModules",
            });
            return;
          }

          const progress = await CourseProgressModel.find({
            user: user._id,
          }).findOne({
            course: query.course,
          });

          if (!progress) {
            res.status(400).json({
              error: "Course Progress not found",
            });
            return;
          }

          progress[req.body.updateValue] = req.body.value;

          await progress.save();

          res.status(200).json({
            success: true,
            progress: progress,
          });
          return;
        }
      }
    );
  } catch (e) {
    res.status(500).json({
      error: "Internal Error",
      errorMessage: e,
      errorStack: (e as any).stack,
    });
    return;
  }
}
