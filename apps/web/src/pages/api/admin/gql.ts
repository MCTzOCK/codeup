/**
 * apps/web/src/pages/api/admin/gql.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);
    if (!auth) {
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({
        status: 403,
        error: "You are not allowed to do this.",
      });
      return;
    }

    res.status(200).json({
      status: 200,
      gql: {
        endpoint: "https://gql.codeup.space",
        token: process.env.GRAPHQL_SECRET,
      },
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
