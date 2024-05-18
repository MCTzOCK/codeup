/**
 * apps/web/src/pages/api/challenges/check.ts
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
import CompletedUserChallenges from "@codeup/util/dist/models/CompletedUserChallenges";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    if (req.method !== "POST") {
      res.status(405).json({
        status: 405,
        error: "Method Not Allowed",
      });
      return;
    }

    const { challengeId, code, language } = req.body;

    if (!challengeId || !code || !language) {
      res.status(400).json({
        status: 400,
        error: "Bad Request",
      });
      return;
    }

    const challenge = await CodeChallengeModel.findById(challengeId);

    if (!challenge) {
      res.status(404).json({
        status: 404,
        error: "Not Found",
      });
      return;
    }

    const rx = await fetch(process.env.URL + "/api/rce/" + language, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-JWT": req.headers["x-jwt"] as string,
      },
      body: JSON.stringify({
        code,
      }),
    });

    let data = await rx.text();

    data = data.trim();
    data = data.replace(/\r/g, "");
    let o = challenge.expectedOutput.trim().replace(/\r/g, "");

    if (data === o) {
      res.status(200).json({
        status: 200,
        message: "Correct",
      });

      const mod = await CompletedUserChallenges.findOne({
        user: user._id,
      });

      if (mod) {
        mod.challenges.push(challengeId);
        await mod.markModified("challenges");
        await mod.save();
      } else {
        await CompletedUserChallenges.create({
          user: user._id,
          challenges: [challengeId],
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        message: "Incorrect",
      });
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
