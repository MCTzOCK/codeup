/**
 * apps/web/src/pages/api/sso/github.ts
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

  const code = req.query.code;

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
      redirection_uri: process.env.GITHUB_REDIRECT_URI,
    }),
  });

  if (response.status !== 200) {
    res.redirect("/500");
    return;
  }

  const j = await response.json();

  const accessToken = j.access_token;

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (userResponse.status !== 200) {
    res.redirect("/sso-error?error=Benutzer konnte nicht abgerufen werden.");
    return;
  }

  const user = await userResponse.json();

  const userId = user.id;

  const existingUser = await UserModel.findOne({
    username: "github:" + userId,
  });

  if (existingUser) {
    res.redirect("/sso-callback?token=" + generateJWT(existingUser));
  } else {
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (emailResponse.status !== 200) {
      res.redirect("/sso-error?error=E-Mails konnten nicht abgerufen werden.");
      return;
    }

    const emails = await emailResponse.json();

    let username = user.login;
    const name = user.name;
    const primaryEmail = emails.find((e: any) => e.primary).email;

    const existingUsername = await UserModel.findOne({
      username: username,
    });

    if (existingUsername) {
      username = "github:" + userId;
    }

    const existingEmail = await UserModel.findOne({
      email: primaryEmail,
    });

    if (existingEmail) {
      res.redirect("/sso-error?error=E-Mail wird bereits verwendet.");
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
      password: createHash("sha256").update(randomString(128)).digest("hex"),
      twoFactorEnabled: false,
      active: true,
      profilePicture: svg,
      sso: "GitHub",
    });

    await newUser.save();

    const token = generateJWT(newUser);

    res.redirect("/sso-callback?token=" + token);
  }
}
function randomString(size: number) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!$%&{([)]}?+*~#-_.:,;<|>/";
  let result = "";
  for (let i = size; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
