/**
 * apps/web/src/pages/api/admin/account/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.10.22
 *
 */

import mongoConnect from "@codeup/util/src/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import { createHash } from "crypto";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";

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

    const { username, email, firstName, lastName, active, password } = req.body;

    if (
      !username ||
      !email ||
      !firstName ||
      !lastName ||
      !active ||
      !password
    ) {
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

    if (user) {
      res.status(400).json({
        error: "User already exists",
      });
      return;
    }

    const svg = createAvatar(style, {
      seed: username,
      colorful: true,
    });

    const newUser = new UserModel({
      username,
      email,
      firstName,
      lastName,
      active,
      admin: req.body.admin || false,
      password: createHash("sha256").update(password).digest("hex"),
      profilePicture: svg,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      user: newUser,
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      // @ts-ignore
      message: e.message,
    });
  }
}
