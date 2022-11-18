/**
 * apps/web/src/pages/api/admin/course/youtube/[vid].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.11.2022
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import mongoConnect from "@codeup/util/src/mongo";
import UserModel from "@codeup/util/src/models/UserModel";
import VideoModel from "@codeup/util/src/models/VideoModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    req.method !== "GET" &&
    req.method !== "POST" &&
    req.method !== "DELETE"
  ) {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.headers["x-jwt"]) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  const { vid } = req.query;

  if (!vid) {
    res.status(400).json({
      error: "Bad Request",
    });
    return;
  }

  try {
    const jwt = req.headers["x-jwt"];
    if (!verify(jwt as string, process.env.JWT_SECRET as string)) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = verify(
      jwt as string,
      process.env.JWT_SECRET as string
    ) as any;

    const adminuser = await UserModel.findOne({ username: decoded.username });

    if (adminuser.role !== "admin") {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    await mongoConnect();

    const video = await VideoModel.findOne({
      youtube: "https://www.youtube.com/watch?v=" + vid,
    });

    if (!video) {
      res.status(404).json({
        error: "Not Found",
      });
      return;
    }

    if (req.method === "GET") {
      res.status(200).json({
        video,
      });
      return;
    }

    if (req.method === "POST") {
      if (!req.body.update) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      for (const key of Object.keys(req.body.update)) {
        video[key] = req.body.update[key];
      }

      await video.save();

      res.status(200).json({
        video,
      });
      return;
    }

    if (req.method === "DELETE") {
      await video.delete();

      res.status(200).json({
        deleted: true,
        success: true,
      });
      return;
    }
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
