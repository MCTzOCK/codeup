/**
 * apps/web/src/pages/api/account/authorize.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.10.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import OAuthApp from "@codeup/util/src/models/OAuthApp";
import generateJWT from "@codeup/util/dist/generateJWT";
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/dist/models/UserModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, redirect, token } = req.query;
    if (!id) {
      res.status(400).json({
        status: 400,
        error: "No ID provided",
      });
      return;
    }

    if (!token) {
      res.status(400).json({
        status: 400,
        error: "No token provided",
      });
      return;
    }

    try {
      const decoded = jwt.verify(
        token as string,
        process.env.JWT_SECRET as string
      );

      if (!decoded) {
        res.redirect(302, "/error?error=Invalid Token");
      }

      const user = await UserModel.findById((decoded as any).id);

      if (!user || !user.active) {
        res.redirect(302, "/error?error=Invalid Token");
      }

      const app = await OAuthApp.findOne({
        _id: id,
        user: user._id,
      });

      if (!app) {
        res.status(404).json({
          status: 404,
          error: "App not found",
        });
        return;
      }

      if (!app.redirectUris.includes(redirect)) {
        res.status(400).json({
          status: 400,
          error: "Redirect URI not allowed",
        });
        return;
      }

      const rToken = generateJWT(user, "1d");

      res.redirect(302, `${redirect}?token=${rToken}`);
    } catch (e: any) {
      res.redirect(302, "/error?error=Invalid Token");
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
