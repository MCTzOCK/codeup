/**
 * apps/web/src/pages/api/orgs/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.03.23
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import OrgModel from "@codeup/util/src/models/OrgModel";

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

  if (!req.body || !req.headers["x-jwt"] || !req.body.name) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  try {
    jwt.verify(
      req.headers["x-jwt"] as string,
      // @ts-ignore
      process.env.JWT_SECRET as string,
      async (err, decoded) => {
        if (err) {
          res.status(400).json({
            error: "Invalid token",
          });
          return;
        } else {
          await mongoConnect();
          const user = await UserModel.findOne({
            _id: (decoded as any).id as string,
          });

          if (!user) {
            res.status(400).json({
              error: "User not found",
            });
            return;
          }

          try {
            const org = await OrgModel.create({
              owner: user._id,
              name: req.body.name,
              members: [],
              icon: req.body.icon || "https://codeup.space/codeup.png",
              subscription: "FREE"
            });

            res.status(200).json({
              success: true,
              org,
            });
          } catch (e: any) {
            res.status(400).json({
              success: false,
              error: e.toString(),
            });
          }
        }
      }
    );
  } catch (e) {
    res.status(500).json({
      error: "Invalid token",
    });
  }
}
