/**
 * apps/web/src/pages/api/ide/projects/contributors/add.ts
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

  if (
    !req.body ||
    !req.body.token ||
    !req.body.project ||
    !req.body.contributor
  ) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  jwt.verify(
    req.body.token,
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
          !(
            IDEProject.contributors.find((c: any) => c.user.equals(user._id)) &&
            IDEProject.contributors
              .find((c: any) => c.user.equals(user._id))
              .permissions.includes("MANAGE-CONTRIBUTORS")
          )
        ) {
          res.status(403).json({
            error: "You do not have permissions to add contributors",
          });
          return;
        }

        const contributor = await UserModel.findOne({
          email: req.body.contributor,
        });

        if (!contributor) {
          res.status(400).json({
            error: "Contributor not found",
          });
          return;
        }

        if (
          IDEProject.contributors.filter((c: any) =>
            c.user.equals(contributor._id)
          ).length > 0 ||
          IDEProject.owner.equals(contributor._id)
        ) {
          res.status(400).json({
            error: "Contributor already added",
          });
          return;
        }

        IDEProject.contributors.push({
          user: contributor._id,
          permissions: ["READ", "WRITE", "DUPLICATE"],
        });

        await IDEProject.save();

        res.status(200).json({
          success: true,
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
