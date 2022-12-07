/**
 * apps/web/src/pages/api/ide/projects/[id]/publish.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.12.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import IDEProjectModel from "@codeup/util/src/models/IDEProjectModel";
import IDETemplateModel from "@codeup/util/src/models/IDETemplateModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  if (!req.body || !req.headers["x-jwt"]) {
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
            error: "User not found",
          });
          return;
        }

        const IDEProject = await IDEProjectModel.findById(id);

        if (!IDEProject) {
          res.status(400).json({
            error: "Project not found",
          });
          return;
        }

        if (
          !IDEProject.owner.equals(user._id) &&
          !IDEProject.contributors.find(
            (c: any) => c.user.toString() === user._id.toString()
          )
        ) {
          res.status(403).json({
            error: "You do not have permissions to delete this project",
          });
          return;
        }

        if (req.method === "POST") {
          if (!req.body || !req.body.publishState) {
            res.status(400).json({
              error: "Missing required fields2",
            });
            return;
          }

          const publishState = req.body.publishState;

          if (publishState === "public" && !req.body.customName) {
            res.status(400).json({
              error: "Missing required fields1",
            });
            return;
          }

          if (publishState === "public") {
            const customName = req.body.customName;

            const existingProject = await IDEProjectModel.findOne({
              publishedCustomName: customName,
            });

            if (existingProject) {
              res.status(700).json({
                error: "This custom name is already taken",
              });
              return;
            }

            IDEProject.published = true;
            IDEProject.publishedCustomName = customName;

            await IDEProject.save();

            res.status(200).json({
              message: "Project published",
            });
            return;
          } else {
            IDEProject.published = false;
            IDEProject.publishedCustomName = "";
            await IDEProject.save();

            res.status(200).json({
              message: "Project unpublished",
              project: IDEProject,
            });

            return;
          }
        } else {
          res.status(405).json({
            error: "Method not allowed",
          });
          return;
        }
      } catch (e: any) {
        res.status(500).json({
          error: e.message,
        });
      }
    }
  );
}
