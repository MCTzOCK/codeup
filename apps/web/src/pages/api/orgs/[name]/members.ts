/**
 * apps/web/src/pages/api/orgs/[name]/members.ts
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

  /*
   * Body Structure:
   * {
   *  action: "ADD" | "REMOVE",
   *  userId: string
   * }
   */

  if (!req.headers["x-jwt"] || !req.body || !req.body.action || !req.body.userId) {
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
              owner: user._id,
              name: name,
            });

            if (req.body.action === "ADD") {
              if(org.members.find(
                  (m: any) => m.toString() === req.body.userId
              )
                || org.owner.toString() === req.body.userId
              ) {
                res.status(400).json({
                  success: false,
                  error: "User already in organisation",
                });
                return;
              }

              const existingUser = await UserModel.findOne({
                _id: req.body.userId,
              });

              if(!existingUser) {
                res.status(400).json({
                  success: false,
                  error: "User not found",
                });
                return;
              }

              org.members.push(req.body.userId);
            } else if (req.body.action === "REMOVE") {
              const index = org.members.findIndex(
                (m: any) => m.toString() === req.body.userId
              );
              if (index === -1
                || org.owner.toString() === req.body.userId) {
                res.status(400).json({
                  success: false,
                  error: "User not in organisation",
                });
                return;
              }
              org.members.splice(index, 1);
            }

            await org.save();

            res.status(200).json({
              success: true,
            })

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

 