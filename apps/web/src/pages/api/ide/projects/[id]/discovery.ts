/**
 * apps/web/src/pages/api/ide/projects/[id]/discovery.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.12.2022
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
          if (!req.body) {
            res.status(400).json({
              error: "Missing required fields",
            });
            return;
          }

          if (!IDEProject.published) {
            res.status(400).json({
              error:
                "The project has to be published to be eligible for discovery",
            });
            return;
          }

          if (req.body.enableDiscovery) {
            if (req.body.discoveryDescription) {
              IDEProject.discovery = true;
              IDEProject.discoveryDescription = req.body.discoveryDescription;
            } else {
              res.status(400).json({
                error: "Missing required fields",
              });
              return;
            }
          } else if (req.body.disableDiscovery) {
            IDEProject.discovery = false;
            IDEProject.discoveryDescription = "";
          }

          await IDEProject.save();

          res.status(200).json({
            success: true,
            discovery: IDEProject.discovery,
          });
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
