/**
 * apps/observability/src/pages/api/analytics/get-session-id.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.10.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import SessionReplayModel from "@/models/SessionReplayModel";
import ApplicationModel from "@/models/ApplicationModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { appId } = req.query;

    if (!appId) {
      res.status(400).json({
        status: 400,
        error: "No App ID provided",
      });
      return;
    }

    const app = await ApplicationModel.findById(appId);

    if (!app) {
      res.status(404).json({
        status: 404,
        error: "App not found",
      });
      return;
    }

    const replayModel = await SessionReplayModel.create({
      application: app._id,
      events: [],
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      status: 200,
      sessionId: replayModel._id,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
