/**
 * src/pages/api/account/operation.ts
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
import generateJWT from "@codeup/util/src/generateJWT";

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

  if (!req.query.operation) {
    res.status(400).json({
      error: "Missing operation",
    });
    return;
  }

  if (!req.query.redirect) {
    res.status(400).json({
      error: "Missing redirect",
    });
    return;
  }

  if (req.query.operation === "activate") {
    if (!req.query.token) {
      res.status(400).json({
        error: "Missing token",
      });
      return;
    }

    await mongoConnect();

    const user = await UserModel.findOne({
      activationToken: req.query.token,
    });

    if (!user) {
      res.status(400).json({
        error: "Invalid token",
      });
      return;
    }

    user.activationToken = null;
    user.active = true;

    await user.save();

    res.redirect(req.query.redirect as string);
  }

  if (req.query.operation === "changeEmail") {
    if (!req.query.token) {
      res.status(400).json({
        error: "Missing token",
      });
      return;
    }

    await mongoConnect();

    const user = await UserModel.findOne({
      emailChangeCode: req.query.token,
    });

    if (!user) {
      res.status(400).json({
        error: "Invalid token",
      });
      return;
    }

    if (!user.newEmail) {
      res.status(400).json({
        error: "Invalid token",
      });
      return;
    }

    user.emailChangeCode = null;
    user.email = user.newEmail;
    user.newEmail = null;

    await user.save();

    res.redirect(
      (req.query.redirect as string) + "?newToken=" + generateJWT(user)
    );
  }
}
