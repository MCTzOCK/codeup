/**
 * apps/web/src/pages/api/account/try.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.12.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import UserModel from "@codeup/util/src/models/UserModel";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";
import crypto from "crypto";
import generateJWT from "@codeup/util/dist/generateJWT";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await mongoConnect();

    const svg = createAvatar(style, {
      seed: req.body.username,
      colorful: true,
    });

    const userIdentifier = randomString(10);

    const user = await UserModel.create({
      username: `test.${userIdentifier}`,
      email: `test.${userIdentifier}@codeup.space`,
      password: crypto
        .createHash("sha256")
        .update(randomStringWithLetters(64))
        .digest("hex"),
      firstName: "Test",
      lastName: "Benutzer",
      createdAt: Date.now(),
      twoFactorEnabled: false,
      twoFactorCode: "",
      active: true,
      deletionToken: "",
      resetToken: "",
      emailChangeCode: "",
      newEmail: "",
      profilePicture: svg,
      role: "temp",
    });

    await user.save();

    const token = generateJWT(user);

    res.status(200).json({
      token,
    });
  } catch (e: any) {
    if (e.message) {
      res.status(500).json({ error: e.message });
    } else {
      res.status(500).json({ error: "An unknown error occured." });
    }
  }
}

function randomString(l: number): string {
  let s = "";
  while (s.length < l) {
    s += Math.random().toString(36).substr(2);
  }
  return s.substr(0, l);
}

function randomStringWithLetters(l: number): string {
  let x = "abcdefghijklmnopqrstuvwxyz0123456789";
  return randomString(l)
    .split("")
    .map((c) => {
      if (Math.random() > 0.5) {
        return c.toUpperCase();
      } else {
        return c;
      }
    })
    .join("");
}
