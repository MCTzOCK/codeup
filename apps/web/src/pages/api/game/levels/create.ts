/**
 * apps/web/src/pages/api/game/levels/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.08.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../global/server/isLoggedIn";
import GameLevelModel from "@codeup/util/dist/models/GameLevelModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    if (req.method !== "POST") {
      res.status(405).json({
        status: 405,
        error: "Method not allowed",
      });
      return;
    }

    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        status: 400,
        error: "Name is required",
      });
      return;
    }

    const level = await GameLevelModel.create({
      user: user._id,
      name,
    });

    res.status(200).json({
      status: 200,
      level,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
