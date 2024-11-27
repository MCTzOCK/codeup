/**
 * apps/web/src/pages/api/v2/repos/u/[username].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.11.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../../global/server/isLoggedIn";
import RepositoryModel from "@codeup/util/src/models/RepositoryModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const { username } = req.query;

    if (!username) {
      res.status(400).json({
        status: 400,
        error: "Missing required fields",
      });
      return;
    }

    const onlyPublic = user.username !== username;
    const ft: any = {
      username,
    };

    if (onlyPublic) {
      ft.public = true;
    }

    const repos = await RepositoryModel.find(ft);

    res.status(200).json({
      status: 200,
      data: repos,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
