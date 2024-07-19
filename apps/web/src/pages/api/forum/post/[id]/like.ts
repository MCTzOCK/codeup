/**
 * apps/web/src/pages/api/forum/post/[id]/like.ts
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
import { addXP } from "@codeup/util/dist/userworkflow/xp";
import { actionMap } from "../../../../../global/levels";

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
      // @ts-ignore
      username: decoded.username,
    });

    if (!user) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const post = await ForumPostModel.findOne({
      _id: req.query.id,
    });

    if (!post) {
      res.status(400).json({
        error: "Post not found!",
      });
      return;
    }

    let i = -1;

    if (post.likes.includes(user._id)) {
      post.likes.splice(post.likes.indexOf(user._id), 1);
    } else {
      post.likes.push(user._id);
      i = 1;
    }

    await post.save();

    res.status(200).json({
      post,
    });

    if (i === 1) {
      addXP(user._id, actionMap["Forum-Post liken"], "Forum-Post liken");
    }
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}
