/**
 * apps/web/src/pages/api/admin/errors.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.04.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import mongoConnect from "@codeup/util/dist/mongo";
import UserModel from "@codeup/util/dist/models/UserModel";
import ErrorModel from "@codeup/util/dist/models/ErrorModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.headers["x-jwt"]) {
    res.status(401).send({
      error: "Unauthorized",
    });
    return;
  }

  const token = req.headers["x-jwt"] as string;

  try {
    await mongoConnect();

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    const user = await UserModel.findById(decoded.id);

    if (!user || user.role !== "admin") {
      res.status(401).send({
        error: "Unauthorized",
      });
      return;
    }

    res.status(200).send(await ErrorModel.find({}).sort({ createdAt: -1 }));
  } catch (e: any) {
    res.status(500).send({
      error: e.message,
    });
  }
}
