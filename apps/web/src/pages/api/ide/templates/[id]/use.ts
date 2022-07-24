/**
 * apps/web/src/pages/api/ide/templates/[id]/useTemplate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import mongoConnect from "@codeup/util/src/mongo";
import UserModel from "@codeup/util/src/models/UserModel";
import IDETemplateModel from "@codeup/util/src/models/IDETemplateModel";
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

  if (!req.headers["x-jwt"]) {
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

        const tpl = await IDETemplateModel.findById(req.query.id);

        if (!tpl) {
          res.status(404).json({
            error: "Template not found",
          });
          return;
        }

        const IDEProject = await IDEProjectModel.findById(tpl.project);

        tpl.uses++;

        await tpl.save();

        res.status(200).json({
          success: true,
          files: IDEProject.files,
        });
      } catch (e: any) {
        res.status(500).json({
          error: e.message,
        });
      }
    }
  );
}
