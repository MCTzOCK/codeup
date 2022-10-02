/**
 * apps/web/src/pages/api/sso/discord.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.10.2022
 *
 */

import generateJWT from '@codeup/util/src/generateJWT';
import UserModel from '@codeup/util/src/models/UserModel';
import { NextApiRequest, NextApiResponse } from 'next';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';
import { createHash } from 'crypto';
import { default as mongoConnect } from '@codeup/util/src/mongo';

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({
      error: 'Method not allowed',
    });
    return;
  }

  if (!req.query.code) {
    res.status(400).json({
      error: 'Missing required fields',
    });
    return;
  }

  const code = req.query.code;
  var details: { [key: string]: any } = {
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    scope: 'identify',
  };

  var formBody: any = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');

  const tokenRequest = await fetch('https://discord.com/api/v10/oauth2/token', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body: formBody,
  });

  const token = await tokenRequest.json();

  if (token.error) {
    res.status(400).json({
      error: token.error,
    });
    return;
  }

  const accessToken = token.access_token;

  const userRequest = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const user = await userRequest.json();

  let username = user.username;
  const userId = user.id;
  const primaryEmail = user.email;
  const name = "CodeUp Benutzer";

  await mongoConnect();


  const existingUser = await UserModel.findOne({
    sso: "discord:" + userId,
  });

  if (existingUser) {
    res.redirect("/sso/callback?token=" + generateJWT(existingUser));
  } else {
    const existingUsername = await UserModel.findOne({
      username: username,
    });
  
    if (existingUsername) {
      username = "discord:" + userId;
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
      sso: "discord:" + userId,
    });
  
    await newUser.save();
  
    const token0 = generateJWT(newUser);
  
    res.redirect("/sso/callback?token=" + token0);
  
  
  }

  
}

function randomString0(size: number) {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!$%&{([)]}?+*~#-_.:,;<|>/';
  let result = '';
  for (let i = size; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
