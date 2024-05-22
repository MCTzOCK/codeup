/**
 * apps/web/src/pages/api/projects/my.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user, auth } = await isLoggedIn(req, res);

    if (!auth) return;

    const projects = await ProjectModel.find({
      users: {
        $in: [user._id],
      },
    });

    res.status(200).json({
      status: 200,
      data: projects,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
