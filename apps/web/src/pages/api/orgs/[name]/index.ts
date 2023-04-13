/**
 * apps/web/src/pages/api/orgs/[name]/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.03.23
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
  if (req.method !== "GET") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.headers["x-jwt"]) {
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

            if (!org) {
              org = await OrgModel.findOne({
                name: name,
                members: {
                  $in: [user._id.toString()],
                },
              });
              if (!org) {
                if (user.role !== "admin") {
                  res.status(404).json({
                    success: false,
                    error: "Organisation not found",
                  });
                  return;
                }
                org = await OrgModel.findOne({
                  name: name,
                });

                if (!org) {
                  res.status(404).json({
                    success: false,
                    error: "Organisation not found",
                  });
                  return;
                }
              }
            }

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
