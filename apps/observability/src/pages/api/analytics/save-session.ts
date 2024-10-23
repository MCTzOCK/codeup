/**
 * apps/observability/src/pages/api/analytics/save-session.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.10.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import SessionReplayModel from "@/models/SessionReplayModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sessionId, events } = req.body;

    if (!sessionId) {
      res.status(400).json({
        status: 400,
        error: "No session ID provided",
      });
      return;
    }

    if (!events || events.length === 0) {
      res.status(400).json({
        status: 400,
        error: "No events provided",
      });
      return;
    }

    const session = await SessionReplayModel.findById(sessionId);

    if (!session) {
      res.status(404).json({
        status: 404,
        error: "Session not found",
      });
      return;
    }

    session.events = events;

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
