/**
 * apps/web/src/pages/api/stats.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.03.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import UserModel from "@codeup/util/dist/models/UserModel";
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";
import ContentModel from "@codeup/util/dist/models/ContentModel";
import OrgModel from "@codeup/util/dist/models/OrgModel";
import CodeUpKidsProjectModel from "@codeup/util/dist/models/CodeUpKidsProjectModel";
import IDEProjectModel from "@codeup/util/dist/models/IDEProjectModel";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await mongoConnect();

    const users = await UserModel.countDocuments();
    const projects =
      (await EditorProjectModel.countDocuments()) +
      (await CodeUpKidsProjectModel.countDocuments()) +
      (await IDEProjectModel.countDocuments());
    const lessons = await ContentModel.countDocuments();
    const orgs = await OrgModel.countDocuments();

    res.status(200).json({
      users,
      projects,
      lessons,
      orgs,
    });
  } catch (e) {
    res.status(500).json({
      users: 0,
      projects: 0,
      lessons: 0,
      orgs: 0,
    });
  }
};
