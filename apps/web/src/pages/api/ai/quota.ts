/**
 * apps/web/src/pages/api/ai/quota.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.07.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import UserAIQuotaModel from "@codeup/util/dist/models/UserAIQuotaModel";
import moment from "moment";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const quota = await UserAIQuotaModel.findOne({ user: user._id });

    if (quota) {
      res.status(200).json({
        status: 200,
        data: quota,
      });
    } else {
      const resetsAt = moment().add(1, "day").startOf("day").toDate();

      const q = await UserAIQuotaModel.create({
        user: user._id,
        resetsAt: resetsAt,
      });

      res.status(200).json({
        status: 200,
        data: q,
      });
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
