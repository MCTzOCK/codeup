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

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await mongoConnect();

    const courses = await CourseModel.find({ available: true });

    res.status(200).json(courses);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}
