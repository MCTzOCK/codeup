/**
 * apps/web/src/pages/api/admin/cdn/delete.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.07.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../global/server/isLoggedIn";
import { getS3 } from "../../../../global/getS3";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    if (user.role !== "admin") {
      res.status(403).json({
        status: 403,
        error: "You are not allowed to access this endpoint.",
      });
      return;
    }

    const client = getS3();

    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        status: 400,
        error: "Invalid Request",
      });
      return;
    }

    await client.removeObjects("codeup-cdn", [name]);

    res.status(200).json({
      status: 200,
      message: "File deleted",
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
