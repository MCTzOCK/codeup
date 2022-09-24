/**
 * apps/web/src/pages/api/forum/chats/[id]/messages.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import ForumProfileModel from "@codeup/util/src/models/ForumProfileModel";
import ForumChatModel from "@codeup/util/src/models/ForumChatModel";
import UserModel from "@codeup/util/src/models/UserModel";
import mongoConnect from "@codeup/util/src/mongo";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET" && req.method !== "POST") {
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

  const token = req.headers["x-jwt"];

  const id = req.query.id as string;

  if (!verify(token as string, process.env.JWT_SECRET as string)) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  const username = (
    verify(token as string, process.env.JWT_SECRET as string) as any
  ).username;

  try {
    await mongoConnect();

    if (req.method === "GET") {
      const chat = await ForumChatModel.findOne({
        _id: id,
      });

      if (!chat) {
        res.status(404).json({
          error: "Not found",
        });
        return;
      }

      if (!chat.users.includes(username)) {
        res.status(403).json({
          error: "Forbidden",
        });
        return;
      }

      res.status(200).json({
        messages: chat.messages.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }),
      });

      return;
    } else if (req.method === "POST") {
      if (!req.body || !req.body.content) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const chat = await ForumChatModel.findOne({
        _id: id,
      });

      if (!chat) {
        res.status(404).json({
          error: "Not found",
        });
        return;
      }

      if (!chat.users.includes(username)) {
        res.status(403).json({
          error: "Forbidden",
        });
        return;
      }

      chat.messages.push({
        content: req.body.content,
        createdAt: new Date(),
        username: username,
      });

      await chat.save();

      res.status(200).json({
        messages: chat.messages.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }),
      });
    }
  } catch (e) {
    res.status(500).json({
      // @ts-ignore
      error: e.message,
    });
  }
}
