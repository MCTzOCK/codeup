/**
 * apps/web/src/pages/api/roadmap/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.04.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import jwt from "jsonwebtoken";
import RoadmapModel from "@codeup/util/dist/models/RoadmapModel";
import UserModel from "@codeup/util/dist/models/UserModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.headers["x-jwt"]) {
    res.status(401).send({
      error: "Not authenticated",
    });
    return;
  }

  if (!req.body || !req.body.name) {
    res.status(400).send({
      error: "Bad request",
    });
    return;
  }

  const token = req.headers["x-jwt"] as string;

  try {
    await mongoConnect();

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded) {
      res.status(401).send({
        error: "Not authenticated",
      });
      return;
    }

    const user = await UserModel.findById((decoded as any).id);

    if (!user) {
      res.status(401).send({
        error: "Not authenticated",
      });
      return;
    }

    const roadmap = await RoadmapModel.create({
      owner: user._id,
      name: req.body.name,
    });

    res.status(200).send({
      roadmap: roadmap,
      success: true,
    });
  } catch (e: any) {
    res.status(500).send({
      error: e.message as string,
    });
    return;
  }
}
