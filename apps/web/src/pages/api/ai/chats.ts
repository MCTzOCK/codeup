/**
 * apps/web/src/pages/api/ai/chats.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.07.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import UserAIChatModel from "@codeup/util/dist/models/UserAIChatModel";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    if (req.method === "GET") {
      const chats = await UserAIChatModel.find({ user: user._id });
      res.status(200).json({
        status: 200,
        data: chats,
      });
      return;
    } else if (req.method === "DELETE") {
      const { id } = req.body;
      const chat = await UserAIChatModel.findOne({ _id: id, user: user._id });

      if (!chat) {
        res.status(404).json({
          status: 404,
          error: "Chat not found",
        });
        return;
      }

      await chat.remove();

      res.status(200).json({
        status: 200,
      });
      return;
    } else if (req.method === "POST") {
      const { id, message } = req.body;

      if (!message) {
        res.status(400).json({
          status: 400,
          error: "Message is required",
        });
        return;
      }

      if (id) {
        const chat = await UserAIChatModel.findOne({ _id: id, user: user._id });

        if (!chat) {
          res.status(404).json({
            status: 404,
            error: "Chat not found",
          });
          return;
        }

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            ...defaultMessages,
            ...chat.messages,
            {
              role: "user",
              content: message,
            },
          ],
        });

        const completion = response.choices[0].message.content;

        let msgs: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
          ...chat.messages,
        ];

        msgs.push({
          role: "user",
          content: message,
        });
        msgs.push({
          role: "assistant",
          content: completion,
        });

        chat.messages = msgs;

        await chat.markModified("messages");
        await chat.save();

        res.status(200).json({
          status: 200,
          data: chat,
        });

        return;
      }

      const chat = await UserAIChatModel.create({
        user: user._id,
        messages: [],
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          ...defaultMessages,
          ...chat.messages,
          {
            role: "user",
            content: message,
          },
        ],
      });

      const completion = response.choices[0].message.content;

      let msgs: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

      msgs.push({
        role: "user",
        content: message,
      });
      msgs.push({
        role: "assistant",
        content: completion,
      });

      chat.messages = msgs;

      await chat.markModified("messages");
      await chat.save();

      res.status(200).json({
        status: 200,
        data: chat,
      });
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}

const defaultMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content:
      "Dein Name ist 'CodeUp-Assistent' und du bist dafür da, mir bei Fragen rund um die Softwareentwicklung zu helfen. Versuche möglichst einfach zu antworten!",
  },
];
