/**
 * src/pages/api/account/login.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "../../../util/mongo";
import UserModel from "../../../util/models/UserModel";
import * as crypto from "crypto";
import generateJWT from "../../../util/generateJWT";
import { default as sm } from "../../../util/sendMail";

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

  if (!req.body || !req.body.email || !req.body.password) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  await mongoConnect();

  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    res.status(400).json({
      error: "User not found",
    });
    return;
  }

  if (
    crypto.createHash("sha256").update(req.body.password).digest("hex") !==
    user.password
  ) {
    res.status(400).json({
      error: "Wrong password",
    });
    return;
  }

  if (!user.twoFactorEnabled) {
    await sendMail(user.email, user.firstName);
    res.status(200).json({
      error: null,
      token: generateJWT(user),
    });
    return;
  } else {
    if (req.body.code) {
      if (req.body.code === user.twoFactorCode) {
        user.twoFactorCode = null;
        await user.save();

        await sendMail(user.email, user.firstName);

        res.status(200).json({
          error: null,
          token: generateJWT(user),
        });
        return;
      } else {
        res.status(400).json({
          error: "Wrong code",
        });
        return;
      }
    } else {
      user.twoFactorCode = (Math.floor(Math.random() * 9000) + 1000).toString();
      await user.save();

      await sm(
        req.body.email,
        "Two Factor Code",
        `Your two factor code is: ${user.twoFactorCode}\n\nIf you didn't request this, please contact support immediately at codeup@ben-siebert.de!`,
        user.firstName
      );

      res.status(200).json({
        error: null,
        _2fa: true,
      });
      return;
    }
  }
}

const sendMail = async (email: string, firstName: string) => {
  await sm(
    email,
    "Logged In",
    `You have successfully logged in to your account.
If this wasn't you, please contact support immediately at codeup@ben-siebert.de`,
    firstName
  );
};
