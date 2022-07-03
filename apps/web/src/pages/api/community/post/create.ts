/**
 * src/pages/api/community/post/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "../../../../util/mongo";
import jwt from "jsonwebtoken";
import UserModel from "../../../../util/models/UserModel";
import CommunityProfileModel from "../../../../util/models/CommunityProfileModel";
import CommunityPostModel from "../../../../util/models/CommunityPostModel";

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

  if (!req.body || !req.body.token || !req.body.content) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  // @ts-ignore
  jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      res.status(400).json({
        error: "Invalid token",
      });
      return;
    } else {
      await mongoConnect();
      const user = await UserModel.findOne({
        _id: (decoded as any).id as string,
      });

      if (!user) {
        res.status(400).json({
          error: "User not found",
        });
        return;
      }

      const profile = await CommunityProfileModel.findOne({
        username: user.username,
      });

      if (!profile) {
        res.status(400).json({
          error: "Profile not found",
        });
      }

      let content = req.body.content;

      let SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
      while (SCRIPT_REGEX.test(content)) {
        content = content.replace(SCRIPT_REGEX, "");
      }

      if (req.body.parent) {
        const parent = await CommunityPostModel.findOne({
          _id: req.body.parent,
        });

        if (!parent) {
          res.status(400).json({
            error: "Parent post not found",
          });
          return;
        }

        if (parent.parent !== null) {
          res.status(400).json({
            error: "Parent post is not a root post",
          });
          return;
        }

        const post = await CommunityPostModel.create({
          user: user._id,
          username: user.username,
          content: content,
          likes: [],
          comments: [],
          createdAt: Date.now(),
          parent: parent._id,
        });

        await post.save();

        parent.comments.push(post._id);

        await parent.save();

        res.status(200).json({
          post: post._id,
          success: true,
        });
      } else {
        const post = await CommunityPostModel.create({
          user: user._id,
          username: user.username,
          content: content,
          likes: [],
          comments: [],
          createdAt: Date.now(),
        });

        await post.save();

        res.status(200).json({
          post: post._id,
          success: true,
        });
      }
    }
  });
}
