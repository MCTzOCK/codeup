/**
 * apps/web/src/pages/api/admin/text/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.11.2022
 *
 */
import mongoConnect from "@codeup/util/src/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import TextContentModel from "@codeup/util/src/models/TextContentModel";

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

  try {
    await mongoConnect();

    if (!req.headers["x-jwt"]) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const { title, friendlyName, course, content, quiz } = req.body;

    if (!title || !friendlyName || !course || !content || !quiz) {
      res.status(400).json({
        error: "Bad Request",
      });
      return;
    }

    if (
      !verify(req.headers["x-jwt"] as string, process.env.JWT_SECRET as string)
    ) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = verify(
      req.headers["x-jwt"] as string,
      process.env.JWT_SECRET as string
    ) as any;

    const adminuser = await UserModel.findOne({ username: decoded.username });

    if (!adminuser.admin) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const existingText = await TextContentModel.findOne({
      friendlyName: friendlyName,
    });

    if (existingText) {
      res.status(400).json({
        error: "Course already exists",
      });
      return;
    }

    const text = await TextContentModel.create({
      name: title,
      friendlyName,
      course,
      content,
      quiz,
    });

    res.status(200).json({
      success: true,
      text,
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      // @ts-ignore
      message: e.message,
    });
  }
}
