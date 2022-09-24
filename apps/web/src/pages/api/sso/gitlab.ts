/**
 * apps/web/src/pages/api/sso/gitlab.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.09.2022
 *
 */

import generateJWT from "@codeup/util/src/generateJWT";
import UserModel from "@codeup/util/src/models/UserModel";
import { NextApiRequest, NextApiResponse } from "next";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";
import { createHash } from "crypto";
import mongoConnect from "@codeup/util/src/mongo";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.query.code) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  const res0 = await fetch(`https://gitlab.com/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITLAB_CLIENT_ID,
      code: req.query.code,
      grant_type: "authorization_code",
      redirect_uri: process.env.GITLAB_REDIRECT_URI,
      code_verifier: req.cookies["code_verifier"],
    }),
  });

  if (res0.status !== 200) {
    res.redirect("/sso/error?error=Zugriff verweigert.");
    return;
  }

  const j0 = await res0.json();

  const accessToken = j0.access_token;

  const res1 = await fetch(`https://gitlab.com/api/v4/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res1.status !== 200) {
    res.redirect("/sso/error?error=Zugriff verweigert.");
    return;
  }

  const user = await res1.json();

  const userId = user.id;

  await mongoConnect();

  const existingUser = await UserModel.findOne({
    sso: "gitlab:" + userId,
  });

  if (existingUser) {
    res.redirect("/sso/login?token=" + generateJWT(existingUser));
    return;
  } else {
    let username = user.username;
    const name = user.name;
    const primaryEmail = user.email;

    const existingUsername = await UserModel.findOne({
      username: username,
    });

    if (existingUsername) {
      username = "gitlab:" + userId;
    }

    const existingEmail = await UserModel.findOne({
      email: primaryEmail,
    });

    if (existingEmail) {
      res.redirect("/sso/error?error=E-Mail wird bereits verwendet.");
      return;
    }

    const svg = createAvatar(style, {
      seed: userId,
      colorful: true,
    });

    const newUser = await UserModel.create({
      username,
      email: primaryEmail,
      firstName: name.split(" ")[0],
      lastName: name.split(" ")[name.split(" ").length - 1],
      password: createHash("sha256").update(randomString0(128)).digest("hex"),
      twoFactorEnabled: false,
      active: true,
      profilePicture: svg,
      sso: "gitlab:" + userId,
    });

    await newUser.save();

    const token = generateJWT(newUser);

    res.redirect("/sso/callback?token=" + token);
  }
}

function randomString0(size: number) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!$%&{([)]}?+*~#-_.:,;<|>/";
  let result = "";
  for (let i = size; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
