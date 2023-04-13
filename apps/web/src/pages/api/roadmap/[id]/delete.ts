/**
 * apps/web/src/pages/api/roadmap/[id]/delete.ts
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
  if (req.method !== "DELETE") {
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

    const roadmap = await RoadmapModel.findById(req.query.id);

    if (!roadmap) {
      res.status(404).send({
        error: "Roadmap not found",
      });
      return;
    }

    if (
      roadmap.owner.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      res.status(403).send({
        error: "Not allowed",
      });
      return;
    }

    await roadmap.remove();

    res.status(200).send({
      success: true,
    });
  } catch (e: any) {
    res.status(500).send({
      error: e.message as string,
    });
    return;
  }
}
