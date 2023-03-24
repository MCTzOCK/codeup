/**
 * apps/web/src/pages/api/course/list-courses.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.11.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";

import mongoConnect from "@codeup/util/src/mongo";

import CourseModel from "@codeup/util/src/models/CourseModel";
import * as jwt from "jsonwebtoken";
import UserModel from "@codeup/util/dist/models/UserModel";
import OrgModel from "@codeup/util/dist/models/OrgModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await mongoConnect();

    if (!req.headers["x-jwt"]) {
      const courses = await CourseModel.find({ available: "public" });

      res.status(200).json({
        courses,
      });
      return;
    }

    jwt.verify(
      req.headers["x-jwt"] as string,
      // @ts-ignore
      process.env.JWT_SECRET as string,
      async (err, decoded) => {
        if (err) throw err;

        const user = await UserModel.findOne({ _id: (decoded as any).id });

        if (!user) {
          res.status(401).json({
            error: "Unauthorized",
          });
          return;
        }

        if (user.role === "admin") {
          const courses = await CourseModel.find({});
          res.status(200).json({
            courses,
          });
          return;
        }

        const orgs: any[] = [];

        orgs.push(...(await OrgModel.find({ owner: user._id })));

        orgs.push(
          ...(await OrgModel.find({
            members: {
              $in: [user._id.toString()],
            },
          }))
        );

        const courses: any[] = [];

        for (const o of orgs) {
          courses.push(
            await CourseModel.find({
              available: "org:" + o._id.toString(),
            })
          );
        }

        courses.push(
          ...(await CourseModel.find({
            available: "public",
          }))
        );

        res.status(200).json({
          courses: courses.flat(),
        });
      }
    );
  } catch (e) {
    res.status(500).json({ error: e });
  }
}
