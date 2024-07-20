/**
 * apps/web/src/pages/api/session-replay/post-session.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.07.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import SessionReplayModel from "@codeup/util/dist/models/SessionReplayModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res, true);

    if (!req.body.events) {
      return res.status(400).json({
        status: 400,
        error: "No events provided",
      });
    }

    if (!req.body.session) {
      return res.status(400).json({
        status: 400,
        error: "No session provided",
      });
    }

    const session = await SessionReplayModel.findById(req.body.session);

    if (session.user && session.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        status: 403,
        error: "Session not found",
      });
    }

    session.events = req.body.events;

    await session.markModified("events");

    await session.save();

    res.status(200).json({
      status: 200,
      session: session._id,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};
