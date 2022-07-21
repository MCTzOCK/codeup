/**
 * src/pages/api/community/post/delete.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import CommunityPostModel from "@codeup/util/src/models/CommunityPostModel";

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
      error: "Missing token",
    });
    return;
  }

  const { id } = req.query;

  jwt.verify(
    req.headers["x-jwt"] as string,
    // @ts-ignore
    process.env.JWT_SECRET,
    async (err, decoded) => {
      await mongoConnect();

      const user = await UserModel.findById((decoded as any).id);

      if (!user) {
        res.status(400).json({
          error: "Invalid token",
        });
        return;
      }

      try {
        const post = await CommunityPostModel.findById(id);

        if (!post) {
          res.status(404).json({
            error: "Not Found",
          });
          return;
        }

        if (post.username !== user.username) {
          res.status(403).json({
            error: "Forbidden",
          });
          return;
        }

        if (post.parent) {
          const parent = await CommunityPostModel.findById(post.parent);
          parent.comments.splice(parent.comments.indexOf(post._id), 1);
          await parent.save();
        } else {
          const comments = await CommunityPostModel.find({
            parent: id,
          });
          for (const comment of comments) {
            await comment.remove();
          }
        }

        await post.remove();

        res.status(200).json({
          success: true,
        });
      } catch (e) {
        res.status(500).json({
          // @ts-ignore
          error: e.message,
        });
      }
    }
  );
}
