/**
 * apps/web/src/pages/api/admin/blog/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.12.2022
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import mongoConnect from "@codeup/util/src/mongo";
import UserModel from "@codeup/util/src/models/UserModel";
import BlogModel from "@codeup/util/src/models/BlogModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.headers["x-jwt"]) {
    res.status(401).json({
      error: "Unauthorized",
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

    if (req.method === "GET") {
      const blogs = await BlogModel.find({});

      res.status(200).json({
        blogs,
      });
    } else if (req.method === "POST") {
      const { title, content, tags } = req.body;

      if (!title || !content || !tags) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const blog = await BlogModel.create({
        title,
        content,
        tags,
        authorUsername: adminUser.username,
        published_at: new Date(),
        comments: [],
      });

      res.status(200).json({
        blog,
      });
    }
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
