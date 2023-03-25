/**
 * apps/web/src/pages/api/todo/lists/[id]/tasks/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.03.2023
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import IDEProjectModel from "@codeup/util/src/models/IDEProjectModel";
import TodoListModel from "@codeup/util/src/models/TodoListModel";
import { uuid } from "uuidv4";

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

  if (
    !req.body ||
    !req.headers["x-jwt"] ||
    !req.query.id ||
    !req.body.task ||
    !req.body.update
  ) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  jwt.verify(
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

      const task = list.tasks.find((t: any) => t.uuid === req.body.task);

      if (!task) {
        res.status(400).json({
          error: "Invalid Task",
        });
        return;
      }

      const updatable = ["name", "description", "finished"];

      for (const key in req.body.update) {
        if (updatable.includes(key)) {
          task[key] = req.body.update[key];
        }
      }

      await list.save();

      res.status(200).json({
        success: true,
      });
    }
  );
}
