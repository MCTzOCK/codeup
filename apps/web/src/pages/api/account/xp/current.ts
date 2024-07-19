/**
 * apps/web/src/pages/api/account/xp/current.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.07.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../global/server/isLoggedIn";
import * as xp from "@codeup/util/dist/userworkflow/xp";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user, auth } = await isLoggedIn(req, res);

    if (!auth) return;

    const current = await xp.getLevelProgress(user._id);

    res.status(200).json({
      status: 200,
      data: current,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
