/**
 * apps/web/src/pages/api/forum/chats/index.ts
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

  const token = req.headers["x-jwt"];

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
      const chats = await ForumChatModel.find({
        users: {
          $in: [username],
        },
      });
      const filteredChats: any[] = [];

      for (const chat of chats) {
        let users = [];
        for (const username0 of chat.users) {
          const profile = await ForumProfileModel.findOne({
            username: username0,
          });

          users.push({
            username: username0,
            displayName: profile.displayName,
            verified: profile.verified,
          });
        }
        filteredChats.push({
          id: chat._id,
          users,
        });
      }

      res.status(200).json({
        chats: filteredChats,
      });

      return;
    } else if (req.method === "POST") {
      if (!req.body || !req.body.user) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      if (req.body.user === username) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const user = await UserModel.findOne({
        username: req.body.user,
      });

      if (!user) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const chat = await ForumChatModel.findOne({
        users: {
          $all: [username, req.body.user],
        },
      });

      if (chat) {
        res.status(200).json({
          chat,
        });
        return;
      }

      const newChat = await ForumChatModel.create({
        users: [username, req.body.user],
      });

      await newChat.save();

      res.status(200).json({
        chat: newChat,
      });
    } else if (req.method === "DELETE") {
      if (!req.body || !req.body.chat) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const chat = await ForumChatModel.findOne({
        _id: req.body.chat,
      });

      if (!chat) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      if (!chat.users.includes(username)) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      await ForumChatModel.deleteOne({
        _id: req.body.chat,
      });

      res.status(200).json({
        success: true,
      });
    }
  } catch (e) {
    res.status(500).json({
      // @ts-ignore
      error: e.message,
    });
  }
}
