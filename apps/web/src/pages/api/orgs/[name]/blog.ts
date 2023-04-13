/**
 * apps/web/src/pages/api/orgs/[name]/blog.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.03.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import UserModel from "@codeup/util/dist/models/UserModel";
import OrgModel from "@codeup/util/dist/models/OrgModel";
import OrgBlogModel from "@codeup/util/src/models/OrgBlogModel";
import jwt from "jsonwebtoken";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.headers["x-jwt"]) {
    res.status(400).json({
      error: "Missing token",
    });
    return;
  }

  try {
    jwt.verify(
      req.headers["x-jwt"] as string,
      // @ts-ignore
      process.env.JWT_SECRET as string,
      async (err, decoded) => {
        if (err) throw new Error("Invalid token");

        await mongoConnect();

        const user = await UserModel.findOne({
          _id: (decoded as any).id as string,
        });

        if (!user) throw new Error("User not found");

        const name = req.query.name;

        const org = await OrgModel.findOne({
          name: name,
        });

        if (!org) throw new Error("Org not found");

        let permissionLevel = 0;

        if (org.owner.toString() === user._id.toString()) {
          permissionLevel = 2;
        } else if (org.members.includes(user._id.toString())) {
          permissionLevel = 1;
        } else if (user.role === "admin") {
          permissionLevel = 2;
        }

        if (permissionLevel < 1) throw new Error("Permission denied");

        if (req.method === "POST") {
          if (permissionLevel < 2) throw new Error("Permission denied");

          if (!req.body.title || !req.body.content) {
            res.status(400).json({
              error: "Missing data",
              success: false,
            });
            return;
          }

          const blog = await OrgBlogModel.create({
            title: req.body.title,
            content: req.body.content,
            org: org._id,
            createdAt: Date.now(),
          });

          res.status(200).json({
            blog: blog,
            success: true,
          });
        } else if (req.method === "GET") {
          const blogs = await OrgBlogModel.find({
            org: org._id,
          });

          res.status(200).json({
            blogs: blogs,
            success: true,
          });
        }
      }
    );
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
      success: false,
    });
  }
}
