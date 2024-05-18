/**
 * apps/web/src/pages/api/challenges/completed.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import CompletedUserChallenges from "@codeup/util/dist/models/CompletedUserChallenges";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const completedChallenges = await CompletedUserChallenges.findOne({
      user: user._id,
    });

    res.status(200).json({
      status: 200,
      data: completedChallenges,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
