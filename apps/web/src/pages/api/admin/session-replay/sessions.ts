/**
 * apps/web/src/pages/api/admin/session-replay/sessions.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.07.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../global/server/isLoggedIn";
import SessionReplayModel from "@codeup/util/dist/models/SessionReplayModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    if (user.role !== "admin") {
      return res.status(403).json({
        status: 403,
        error: "Not allowed",
      });
    }

    if (req.query.id) {
      const session = await SessionReplayModel.findById(req.query.id);

      if (!session) {
        return res.status(404).json({
          status: 404,
          error: "Session not found",
        });
      }

      if (session.user) {
        await session.populate("user");
      }

      res.status(200).json({
        status: 200,
        session,
      });
      return;
    }

    if (req.query.filter) {
      const sessions = await SessionReplayModel.find({
        user: req.query.filter,
      });

      for (const session of sessions) {
        await session.populate("user");
        session.events = [];
      }

      res.status(200).json({
        status: 200,
        sessions,
      });
      return;
    }

    const sessions = await SessionReplayModel.find({});

    for (const session of sessions) {
      await session.populate("user");
      session.events = [];
    }

    res.status(200).json({
      status: 200,
      sessions,
    });
    return;
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
