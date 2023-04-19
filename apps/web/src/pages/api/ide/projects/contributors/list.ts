/**
 * apps/web/src/pages/api/ide/projects/contributors/list.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.07.2022
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

  if (!req.body || !req.headers["x-jwt"] || !req.body.project) {
    res.status(400).json({
      error: "Missing required fields",
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
            error: "Invalid Token",
          });
          return;
        }

        const IDEProject = await IDEProjectModel.findById(req.body.project);

        if (!IDEProject) {
          res.status(400).json({
            error: "Project not found",
          });
          return;
        }

        if (
          !IDEProject.owner.equals(user._id) &&
          !IDEProject.contributors.find((c: any) => c.user.equals(user._id)) &&
          user.role !== "admin"
        ) {
          res.status(400).json({
            error:
              "You do not have permissions to list the contributors of project " +
              IDEProject._id,
          });
          return;
        }

        let c: {
          email: string;
          id: string;
          permissions: string[];
          username: string;
          firstName: string;
          lastName: string;
        }[] = [];
        let owner: {
          email: string;
          id: string;
          permissions: string[];
          username: string;
          firstName: string;
          lastName: string;
        };

        for (const contributor of IDEProject.contributors) {
          const contributor0 = await UserModel.findById(contributor.user);
          c = [
            ...c,
            {
              email: contributor0.email,
              id: contributor.user,
              permissions: contributor.permissions,
              username: contributor0.username,
              firstName: contributor0.firstName,
              lastName: contributor0.lastName,
            },
          ];
        }

        const owner0 = await UserModel.findById(IDEProject.owner);
        owner = {
          email: owner0.email,
          id: owner0._id,
          permissions: ["OWNER"],
          username: owner0.username,
          firstName: owner0.firstName,
          lastName: owner0.lastName,
        };

        res.status(200).json({
          success: true,
          owner: owner,
          contributors: c,
        });
      } catch (e: any) {
        res.status(500).json({
          error: e.message,
        });
        return;
      }
    }
  );
}
