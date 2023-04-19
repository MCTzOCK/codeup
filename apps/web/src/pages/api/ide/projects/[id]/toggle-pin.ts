/**
 * apps/web/src/pages/api/ide/projects/[id]/toggle-pin.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.08.2022
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

  if (!req.headers["x-jwt"] || !req.query.id) {
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
            error: "Invalid token",
          });
          return;
        }

        const IDEProject = await IDEProjectModel.findById(req.query.id);

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
              .permissions.includes("READ")
          ) &&
          user.role !== "admin"
        ) {
          res.status(400).json({
            error: "Project not found",
          });
          return;
        }

        if (IDEProject.pinned.includes(user._id)) {
          IDEProject.pinned = IDEProject.pinned.filter(
            (x: any) => !x.equals(user._id)
          );
        } else {
          IDEProject.pinned.push(user._id);
        }

        await IDEProject.save();

        res.status(200).json({
          success: true,
          project: IDEProject,
        });
      } catch (e: any) {
        res.status(500).json({
          error: e.message,
        });
      }
    }
  );
}
