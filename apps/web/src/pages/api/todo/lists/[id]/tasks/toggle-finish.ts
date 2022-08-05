/**
 * apps/web/src/pages/api/todo/lists/[id]/tasks/toggle-finish.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.08.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload, verify, VerifyErrors } from "jsonwebtoken";
import mongoConnect from "@codeup/util/src/mongo";
import UserModel from "@codeup/util/src/models/UserModel";
import TodoListModel from "@codeup/util/src/models/TodoListModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.body || !req.headers["x-jwt"] || !req.query.id || !req.body.taskId) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  verify(
    req.headers["x-jwt"] as string,
    process.env.JWT_SECRET as string,
    async (err: VerifyErrors | null, decoded: JwtPayload | string | any) => {
      if (err) {
        res.status(400).json({
          error: "Invalid token",
        });
        return;
      }

      await mongoConnect();

      const user = await UserModel.findById((decoded as any).id);

      if (!user) {
        res.status(400).json({
          error: "Invalid token",
        });
        return;
      }

      const list = await TodoListModel.findById(req.query.id);

      if (!list) {
        res.status(400).json({
          error: "Invalid list",
        });
        return;
      }

      if (!list.owner.equals(user._id)) {
        res.status(400).json({
          error: "Invalid list",
        });
        return;
      }

      if (
        ![null, undefined].includes(
          list.tasks.find((t) => t.uuid === req.body.taskId)
        )
      ) {
        list.tasks.find((t) => t.uuid === req.body.taskId).finished =
          !list.tasks.find((t) => t.uuid === req.body.taskId).finished;
        await list.save();
      } else {
        res.status(400).json({
          error: "Invalid Item",
        });
        return;
      }

      await list.save();

      res.status(200).json({
        success: true,
        finished: list.tasks.find((t) => t.uuid === req.body.taskId).finished,
      });
    }
  );
}
