/**
 * apps/web/src/pages/api/admin/account/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.22
 *
 */
import mongoConnect from "@codeup/util/src/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import { createHash } from "crypto";

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

  try {
    await mongoConnect();

    if (!req.headers["x-jwt"]) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const { username, update } = req.body;

    if (!username || !update) {
      res.status(400).json({
        error: "Bad request",
      });
      return;
    }

    if (
      !verify(req.headers["x-jwt"] as string, process.env.JWT_SECRET as string)
    ) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = verify(
      req.headers["x-jwt"] as string,
      process.env.JWT_SECRET as string
    ) as any;

    const adminuser = await UserModel.findOne({ username: decoded.username });

    if (adminuser.role !== "admin") {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
      return;
    }

    const allowedKeys = [
      "username",
      "email",
      "password",
      "firstName",
      "lastName",
      "twoFactorEnabled",
      "active",
      "role",
    ];

    for (const key in update) {
      if (allowedKeys.includes(key)) {
        let v = update[key];

        if (key === "password") {
          v = createHash("sha256").update(v).digest("hex");
        }
        user[key] = v;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
