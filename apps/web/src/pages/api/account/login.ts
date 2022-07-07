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
import mongoConnect from "@codeup/util/src/mongo";
import UserModel from "@codeup/util/src/models/UserModel";
import * as crypto from "crypto";
import generateJWT from "@codeup/util/src/generateJWT";
import { default as sm } from "@codeup/util/src/sendMail";

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
          success: true,
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
        `Dein 2FA Code lautet: ${user.twoFactorCode}\n\nWenn du nicht versucht hast dich anzumelden, kontaktiere umgehend den Support unter ben@codeup.space!`,
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
    `Du hast dich erfolgreich angemeldet.
Wenn du das nicht warst, kontaktiere umgehend den Support unter ben@codeup.space`,
    firstName
  );
};
