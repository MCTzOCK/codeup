/**
 * apps/web/src/pages/api/editor/projects.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.03.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";
import UserModel from "@codeup/util/dist/models/UserModel";
import jwt from "jsonwebtoken";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.headers["x-jwt"]) {
    res.status(401).json({ error: "Not authorized", success: false });
    return;
  }

  try {
    const decoded = jwt.verify(
      req.headers["x-jwt"] as string,
      process.env.JWT_SECRET as string
    );

    if (!decoded) {
      res.status(401).json({ error: "Not authorized", success: false });
      return;
    }

    await mongoConnect();

    const user = await UserModel.findOne({ _id: (decoded as any).id });

    if (!user) {
      res.status(401).json({ error: "Not authorized", success: false });
      return;
    }

    const projects = await EditorProjectModel.find({ owner: user._id });

    res.status(200).json({ success: true, projects });
  } catch (e: any) {
    res.status(500).json({ error: e.message, success: false });
  }
}
