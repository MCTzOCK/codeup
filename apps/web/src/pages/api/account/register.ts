/**
 * src/pages/api/account/register.ts
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
import { uuid } from "uuidv4";
import sendMail from "@codeup/util/src/sendMail";

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

  if (
    !req.body ||
    !req.body.email ||
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.password ||
    !req.body.username
  ) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  if (
    !req.body.email.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) ||
    !(req.body.firstName.length > 0) ||
    !(req.body.lastName.length > 0) ||
    !req.body.password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    ) ||
    !/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(
      req.body.username
    )
  ) {
    if (
      !/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(
        req.body.username
      )
    ) {
      res.status(400).json({
        error:
          "Username must be between 4 and 20 characters long and can only contain letters, numbers, and the underscore",
      });
      return;
    }
    res.status(400).json({
      error: "Invalid fields",
    });
    return;
  }

  await mongoConnect();

  try {
    const acToken = uuid();

    const user = await UserModel.create({
      username: req.body.username,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: crypto
        .createHash("sha256")
        .update(req.body.password)
        .digest("hex"),
      activationToken: acToken,
    });

    await user.save();

    await sendMail(
      req.body.email,
      "Account activation",
      `Please click the following link to activate your account:\nhttp://${req.headers.host}/api/account/action?operation=activate&token=${acToken}&redirect=http://${req.headers.host}/account/login\n\nIf you did not request this email, please ignore it.`,
      req.body.firstName
    );

    res.status(200).json({
      error: null,
      message: "User created - Please check your email for an activation link",
    });
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
    return;
  }
}
