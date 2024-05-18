/**
 * apps/web/src/pages/api/challenges/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import CodeChallengeModel from "@codeup/util/dist/models/CodeChallengeModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    if (req.method !== "GET") {
      res.status(405).json({
        status: 405,
        error: "Method not allowed.",
      });
      return;
    }

    const { id } = req.query;

    if (id) {
      const challenge = await CodeChallengeModel.findById(id);

      if (!challenge) {
        res.status(404).json({
          status: 404,
          error: "Challenge not found.",
        });
        return;
      }

      res.status(200).json({
        status: 200,
        challenge,
      });
      return;
    }

    const challenges = await CodeChallengeModel.find({});

    res.status(200).json({
      status: 200,
      challenges,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
