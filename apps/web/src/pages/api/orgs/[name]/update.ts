/**
 * apps/web/src/pages/api/orgs/[name]/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.03.2023
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

  if (!req.headers["x-jwt"] || !req.body || !req.body.update) {
    res.status(400).json({
      error: "Missing token",
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

          const name = req.query.name;

          try {
            let org = await OrgModel.findOne({
              name: name,
            });

            if (
              org.owner.toString() !== user._id.toString() &&
              user.role !== "admin"
            ) {
              res.status(400).json({
                success: false,
                error: "You are not allowed to do this",
              });
              return;
            }

            const allowedKeys = ["name", "icon"];

            for (const key in req.body.update) {
              if (allowedKeys.includes(key)) {
                if (key === "name") {
                  const exists = await OrgModel.findOne({
                    name: req.body.update[key],
                  });

                  if (exists) {
                    res.status(400).json({
                      success: false,
                      error: "Name already exists",
                    });
                    return;
                  }

                  org.name = req.body.update[key];
                } else {
                  org[key] = req.body.update[key];
                }
              }
            }

            await org.save();

            res.status(200).json({
              success: true,
              org,
            });
          } catch (e) {
            res.status(400).json({
              success: false,
              error: e,
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
