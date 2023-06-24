/**
 * apps/web/src/pages/api/ask/posts/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.06.23
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import { decode, verify } from "jsonwebtoken";
import UserModel from "@codeup/util/dist/models/UserModel";
import AskPostModel from "@codeup/util/dist/models/AskPostModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!["GET", "DELETE", "POST"].includes(req.method as string)) {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  try {
    await mongoConnect();

    let user: any;

    if (req.method !== "GET") {
      const jwt = req.headers["x-jwt"];

      if (!jwt) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      const decoded = verify(
        jwt as string,
        process.env.JWT_SECRET as string
      ) as {
        id: string;
      };

      if (!decoded) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      user = await UserModel.findById(decoded.id);

      if (!user || !user.active) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }
    }

    if (req.method === "GET") {
      let posts: any[] = [];

      if (req.query.id) {
        const post = await AskPostModel.findById(req.query.id);

        if (!post) {
          res.status(404).json({
            error: "Not Found",
          });
          return;
        }

        posts.push(post);
      } else {
        if (req.query.parent) {
          const post = await AskPostModel.find({
            parent: req.query.parent,
          });

          posts.push(...post);
        } else if (req.query.user) {
          const post = await AskPostModel.find({
            username: req.query.user,
          });

          posts.push(...post);
        } else if (req.query.query) {
          const post = await AskPostModel.find({
            content: { $regex: req.query.query as string, $options: "i" },
          });

          posts.push(...post);
        } else {
          const post = await AskPostModel.find({
            parent: null,
          });

          posts.push(...post);
        }
      }

      posts = posts.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        } else if (a.createdAt < b.createdAt) {
          return 1;
        } else {
          return 0;
        }
      });

      const PAGE_SIZE = 10;

      let page = 1;

      if (req.query.page) {
        page = parseInt(req.query.page as string);
      }

      let pages = Math.ceil(posts.length / PAGE_SIZE);

      if (posts.length > PAGE_SIZE) {
        posts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
      }

      res.status(200).json({
        pages,
        posts,
      });
    } else if (req.method === "DELETE") {
      if (!req.query.id) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const post = await AskPostModel.findById(req.query.id);

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

      const children = await AskPostModel.find({
        parent: post._id,
      });

      for (const child of children) {
        await child.remove();
      }

      await post.remove();

      res.status(200).json({
        success: true,
      });
    } else if (req.method === "POST") {
      const { content, parent } = req.body;

      if (!content) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      let parentId: string | null = null;

      if (parent) {
        const parentPost = await AskPostModel.findById(parent);

        if (!parentPost || parentPost.parent !== null) {
          res.status(400).json({
            error: "Bad Request",
          });
          return;
        }

        parentId = parentPost._id;
      }

      const post = await AskPostModel.create({
        user: user._id,
        username: user.username,
        content: content,
        parent: parentId,
      });

      res.status(200).json({
        success: true,
        post: post,
      });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
