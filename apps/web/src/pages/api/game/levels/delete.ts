/**
 * apps/web/src/pages/api/game/levels/delete.ts
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

    if (req.method !== "DELETE") {
      res.status(405).json({
        status: 405,
        error: "Method not allowed",
      });
      return;
    }

    const { id } = req.query;

    if (!id) {
      res.status(400).json({
        status: 400,
        error: "ID is required",
      });
      return;
    }

    const level = await GameLevelModel.findById(id);

    if (!level) {
      res.status(404).json({
        status: 404,
        error: "Level not found",
      });
      return;
    }

    if (level.user.toString() !== user._id.toString()) {
      res.status(403).json({
        status: 403,
        error: "Not allowed",
      });
      return;
    }

    await level.deleteOne();

    res.status(200).json({
      status: 200,
      message: "Level deleted",
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
