/**
 * apps/web/src/pages/api/forum/post/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2022
 *
 */
import mongoConnect from "@codeup/util/src/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { decode, verify } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import ForumPostModel from "@codeup/util/src/models/ForumPostModel";

export default async function handler(
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
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  if (!req.body || !req.body.content) {
    res.status(400).json({
      error: "Bad request",
    });
    return;
  }

  try {
    await mongoConnect();

    if (
      !verify(req.headers["x-jwt"] as string, process.env.JWT_SECRET as string)
    ) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = decode(req.headers["x-jwt"] as string);

    const user = await UserModel.findOne({
      username: decoded.username,
    });

    if (!user) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const post = await ForumPostModel.create({
      user: user._id,
      username: user.username,
      content: req.body.content,
    });

    await post.save();

    res.status(200).json({
      post,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}
