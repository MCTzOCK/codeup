/**
 * src/pages/api/course/progress.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.07.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import CourseProgressModel from "@codeup/util/src/models/CourseProgressModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method not allowed"
    });
    return;
  }

  if (!req.body || !req.body.token || !req.body.course) {
    res.status(400).json({
      error: "Missing required fields"
    });
    return;
  }

  jwt.verify(
    req.body.token,
    process.env.JWT_SECRET as string,
    async (
      err: VerifyErrors | any,
      decoded: JwtPayload | string | undefined
    ) => {
      if (err) {
        res.status(400).json({
          error: "Invalid Token"
        });
        return;
      }

      await mongoConnect();

      const user = await UserModel.findById((decoded as any).id);

      if (!user) {
        res.status(400).json({
          error: "Invalid Token"
        });
        return;
      }

      let progress = await CourseProgressModel.findOne({
        user: user._id
      });

      if (!progress) {
        progress = await CourseProgressModel.create({
          user: user._id,
          course: req.body.course
        });

        await progress.save();
      }

      res.status(200).json({
        success: true,
        progress
      });
    }
  );
}
