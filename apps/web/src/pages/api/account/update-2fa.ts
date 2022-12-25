/**
 * apps/web/src/pages/api/account/update-2fa.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.12.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import mongoConnect from "@codeup/util/src/mongo";
import { authenticator } from "otplib";
import generateJWT from "@codeup/util/src/generateJWT";

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

  if (!req.body || !req.headers["x-jwt"]) {
    res.status(400).json({
      error: "Missing parameters",
    });
    return;
  }

  const token = req.headers["x-jwt"] as string;

  if (jwt.verify(token, process.env.JWT_SECRET as string)) {
    const decoded = jwt.decode(token) as any;

    await mongoConnect();

    const user = await UserModel.findOne({
      _id: decoded.id,
    });

    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
      return;
    }

    if (req.body.enable) {
      if (user.twoFactorEnabled) {
        res.status(400).json({
          error: "2FA already enabled",
        });
        return;
      }

      const secret = authenticator.generateSecret();
      const url = authenticator.keyuri(user.username, "CodeUp", secret);

      user.twoFactorEnabled = true;

      user.twoFactorSecret = secret;

      await user.save();

      res.status(200).json({
        url,
        newToken: generateJWT(user),
      });
    } else if (req.body.disable) {
      if (!user.twoFactorEnabled) {
        res.status(400).json({
          error: "2FA already disabled",
        });
        return;
      }

      if (!req.body.code) {
        res.status(400).json({
          error: "Cannot change 2FA without code",
        });
        return;
      }

      const code = req.body.code as string;

      if (!authenticator.check(code, user.twoFactorSecret)) {
        res.status(400).json({
          error: "Invalid code",
        });
        return;
      }

      user.twoFactorEnabled = false;
      user.twoFactorSecret = null;

      await user.save();

      res.status(200).json({
        newToken: generateJWT(user),
      });
      return;
    }

    res.status(400).json({
      error: "Invalid request",
    });
  } else {
    res.status(401).json({
      error: "Invalid token",
    });
  }
}
