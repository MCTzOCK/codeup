/**
 * apps/web/src/pages/api/session-replay/get-session-id.ts
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

    const session = await SessionReplayModel.create({
      user: user ? user._id : null,
      userAgent: req.headers["user-agent"],
    });

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
