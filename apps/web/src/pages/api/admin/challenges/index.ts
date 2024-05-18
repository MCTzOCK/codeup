/**
 * apps/web/src/pages/api/admin/challenges/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../global/server/isLoggedIn";
import CodeChallengeModel from "@codeup/util/dist/models/CodeChallengeModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    if (user.role !== "admin") {
      res.status(403).json({
        status: 403,
        error: "You are not allowed to access this route.",
      });
      return;
    }

    if (req.method === "POST") {
      const { title, task, difficulty, expectedOutput } = req.body;

      if (!title || !task || !difficulty || !expectedOutput) {
        res.status(400).json({
          status: 400,
          error: "Please provide all required fields.",
        });
        return;
      }

      const challenge = await CodeChallengeModel.create({
        title,
        task,
        difficulty,
        expectedOutput,
      });

      res.status(200).json({
        status: 200,
        data: challenge,
      });
    } else if (req.method === "DELETE") {
      if (!req.query.id) {
        res.status(400).json({
          status: 400,
          error: "Please provide a challenge id.",
        });
        return;
      }

      const challenge = await CodeChallengeModel.findById(req.query.id);

      if (!challenge) {
        res.status(404).json({
          status: 404,
          error: "Challenge not found.",
        });
        return;
      }

      await challenge.deleteOne();

      res.status(200).json({
        status: 200,
      });
    } else if (req.method === "PUT") {
      const { title, task, difficulty, expectedOutput, id } = req.body;

      if (!title || !task || !difficulty || !expectedOutput || !id) {
        res.status(400).json({
          status: 400,
          error: "Please provide all required fields.",
        });
        return;
      }

      const challenge = await CodeChallengeModel.findById(id);

      if (!challenge) {
        res.status(404).json({
          status: 404,
          error: "Challenge not found.",
        });
        return;
      }

      challenge.title = title;
      challenge.task = task;
      challenge.difficulty = difficulty;
      challenge.expectedOutput = expectedOutput;

      await challenge.save();

      res.status(200).json({
        status: 200,
        data: challenge,
      });
    } else {
      res.status(405).json({
        status: 405,
        error: "Method not allowed",
      });
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
