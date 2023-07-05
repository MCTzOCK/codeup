/**
 * apps/web/src/pages/api/todo/lists/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.07.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import IDEProjectModel from "@codeup/util/src/models/IDEProjectModel";
import TodoListModel from "@codeup/util/src/models/TodoListModel";
import ToDoProjectModel from "@codeup/util/dist/models/ToDoProjectModel";

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

  if (!req.body || !req.headers["x-jwt"] || !req.body.name) {
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

      if (user.subscription !== "PRO" && user.role !== "admin") {
        let allowed = true;

        const lists = await TodoListModel.find({
          owner: user._id,
        });

        if (lists.length >= 3) {
          allowed = false;
        }

        if (process.env.DISABLE_PAYMENTS) {
          allowed = true;
        }

        if (!allowed) {
          res.status(403).json({
            error:
              "Du musst CodeUp PRO abonnieren, um mehr als 3 ToDo-Listen zu erstellen.",
          });
          return;
        }
      }

      const list = await TodoListModel.create({
        owner: user._id,
        name: req.body.name,
      });

      await list.save();

      res.status(200).json({
        list: list._id,
        success: true,
      });
    }
  );
}
