/**
 * apps/web/src/pages/api/todo/lists/[id].ts
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

  if (!req.body || !req.body.token || !req.query.id) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  jwt.verify(
    req.body.token,
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

      res.status(200).json({
        success: true,
        list: list,
      });
    }
  );
}
