/**
 * src/pages/api/account/verify.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import UserModel from "@codeup/util/src/models/UserModel";
import mongoConnect from "@codeup/util/src/mongo";
import generateJWT from "@codeup/util/src/generateJWT";
import { decode, verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers = req.headers;

  if (headers["x-jwt"]) {
    const token = headers["x-jwt"];

    try {
      if (verify(token as string, process.env.JWT_SECRET as string)) {
        const decoded = decode(token as string);

        await mongoConnect();

        const user = await UserModel.findOne({
          username: decoded.username as string,
        });

        if (!user || !user.active) {
          res.status(401).json({
            error: "Unauthorized",
          });
          return;
        }

        // detect diff between user and decoded

        const diffKeys = [
          "username",
          "email",
          "admin",
          "firstName",
          "lastName",
          "twoFactorEnabled",
        ];

        let dU = decoded as any;

        dU.twoFactorEnabled = dU._2fa;
        delete dU._2fa;

        const diff = diffKeys.filter((key) => {
          return user[key] !== dU[key];
        });

        if (diff.length > 0) {
          const newToken = generateJWT(user);
          res.status(200).json({
            token: newToken,
            verified: true,
          });
          return;
        }

        res.status(200).json({
          verified: true,
          data: decoded,
        });
      } else {
        res.status(401).json({
          verified: false,
        });
      }
    } catch (e) {
      res.status(401).json({
        verified: false,
      });
    }
  } else {
    res.status(403).json({
      loggedIn: false,
    });
  }
}
