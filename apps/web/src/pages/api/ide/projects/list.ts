/**
 * apps/web/src/pages/api/ide/projects/list.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.07.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import IDEProjectModel from "@codeup/util/src/models/IDEProjectModel";

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

  if (!req.body || !req.headers["x-jwt"] || !req.body.type) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  if (!["OWNER", "CONTRIBUTOR", "ALL"].includes(req.body.type.toUpperCase())) {
    res.status(400).json({
      error: "Field type does not match Type ['OWNER' | 'CONTRIBUTOR' | 'ALL']",
    });
    return;
  }

  jwt.verify(
    req.headers["x-jwt"] as string,
    process.env.JWT_SECRET as string,
    async (err: VerifyErrors | null, decoded: JwtPayload | string | any) => {
      await mongoConnect();

      try {
        const user = await UserModel.findById((decoded as any).id);

        if (!user) {
          res.status(400).json({
            error: "User not found",
          });
          return;
        }

        let projects: any[] = [];

        switch (req.body.type.toUpperCase()) {
          case "OWNER":
            projects = await IDEProjectModel.find({
              owner: (decoded as any).id,
            });
            break;
          case "CONTRIBUTOR":
            projects = await IDEProjectModel.find({
              contributors: (decoded as any).id,
            });
            break;
          case "ALL":
            projects = [
              ...(await IDEProjectModel.find({
                contributors: {
                  $elemMatch: {
                    user: (decoded as any).id,
                  },
                },
              })),
              ...(await IDEProjectModel.find({
                owner: (decoded as any).id,
              })),
            ];
            break;
        }

        if (req.body.minimal) {
          let t: any[] = [];
          projects.map((project) => {
            t.push({
              name: project.name,
              id: project._id,
              updated_at: project.updated_at,
              pinned: project.pinned,
            });
          });
          res.status(200).json({
            success: true,
            projects: t,
          });
          return;
        }

        res.status(200).json({
          success: true,
          projects,
        });
      } catch (e: any) {
        res.status(500).json({
          error: e.message,
        });
      }
    }
  );
}
