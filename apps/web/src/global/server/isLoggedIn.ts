/**
 * apps/web/src/global/server/isLoggedIn.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.05.2024
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import UserModel from "@codeup/util/dist/models/UserModel";
import jwt from "jsonwebtoken";

export async function isLoggedIn(
  req: NextApiRequest,
  res: NextApiResponse,
  ignoreAnon = false
): Promise<{
  auth: boolean;
  user?: any;
}> {
  if (!req.headers["x-jwt"]) {
    if (!ignoreAnon) {
      res.status(401).send({
        error: "Not authenticated",
      });
    }
    return {
      auth: false,
    };
  }

  const token = req.headers["x-jwt"] as string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded) {
      if (!ignoreAnon) {
        res.status(401).send({
          error: "Not authenticated",
        });
      }
      return {
        auth: false,
      };
    }

    const user = await UserModel.findById((decoded as any).id);

    if (!user || !user.active) {
      if (!ignoreAnon) {
        res.status(401).send({
          error: "Not authenticated",
        });
      }
      return {
        auth: false,
      };
    }

    return {
      auth: true,
      user,
    };
  } catch (e: any) {
    console.log(e);
    if (!ignoreAnon) {
      res.status(401).send({
        error: "Not authenticated",
      });
    }
    return {
      auth: false,
    };
  }
}
