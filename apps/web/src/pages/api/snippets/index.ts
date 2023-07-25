/**
 * apps/web/src/pages/api/snippets/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.12.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import CodeSnippet from "@codeup/util/src/models/CodeSnippet";
import CodeUpKidsProjectModel from "@codeup/util/dist/models/CodeUpKidsProjectModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.headers["x-jwt"]) {
    res.status(400).json({
      error: "Missing Auth-Header (x-jwt)",
    });
    return;
  }

  jwt.verify(
    req.headers["x-jwt"] as string,
    process.env.JWT_SECRET as string,
    async (err: VerifyErrors | null, decoded: JwtPayload | string | any) => {
      if (err) {
        res.status(400).json({
          error: "Invalid token",
        });
        return;
      }

      await mongoConnect();

      const user = await UserModel.findById((decoded as any).id);

      if (!user) {
        res.status(400).json({
          error: "Invalid token",
        });
        return;
      }

      if (req.method === "GET") {
        if (req.query.id) {
          const snippet = await CodeSnippet.findById(req.query.id);

          if (!snippet) {
            res.status(404).json({
              error: "Snippet not found",
            });
            return;
          }

          if (snippet.username !== user.username) {
            res.status(403).json({
              error: "You are not allowed to access this snippet",
            });
            return;
          }

          res.status(200).json({ snippet });
        } else {
          const snippets = await CodeSnippet.find({
            username: user.username,
          });

          res.status(200).json({ snippets });
        }
      } else if (req.method === "POST") {
        const code = req.body.code;
        const language = req.body.language;
        const title = req.body.title;

        if (!code || !language || !title) {
          res.status(400).json({
            error: "Missing parameters",
          });
          return;
        }

        if (user.subscription !== "PRO" && user.role !== "admin") {
          let allowed = true;

          const snippets = await CodeSnippet.find({
            username: user.username,
          });

          if (snippets.length >= 3) {
            allowed = false;
          }

          if (process.env.DISABLE_PAYMENTS) {
            allowed = true;
          }

          if (!allowed) {
            res.status(403).json({
              error:
                "Du musst CodeUp PRO abonnieren, um mehr als 3 Code-Snippets zu erstellen.",
            });
            return;
          }
        }

        const snippet = await CodeSnippet.create({
          username: user.username,
          code,
          title,
          language,
          createdAt: new Date(),
        });

        res.status(200).json({ snippet });
      } else if (req.method === "DELETE") {
        if (req.query.id) {
          const snippet = await CodeSnippet.findById(req.query.id);

          if (!snippet) {
            res.status(404).json({
              error: "Snippet not found",
            });
            return;
          }

          if (snippet.username !== user.username && user.role !== "admin") {
            res.status(403).json({
              error: "You are not allowed to access this snippet",
            });
            return;
          }

          await snippet.remove();

          res.status(200).json({ success: true });
        } else {
          res.status(400).json({
            error: "Missing parameters",
          });
          return;
        }
      } else if (req.method === "PUT") {
        if (req.query.id) {
          const snippet = await CodeSnippet.findById(req.query.id);

          if (!snippet) {
            res.status(404).json({
              error: "Snippet not found",
            });
            return;
          }

          if (snippet.username !== user.username && user.role !== "admin") {
            res.status(403).json({
              error: "You are not allowed to access this snippet",
            });
            return;
          }

          const code = req.body.code;
          const language = req.body.language;
          const title = req.body.title;

          if (!code || !language || !title) {
            res.status(400).json({
              error: "Missing parameters",
            });
            return;
          }

          snippet.code = code;
          snippet.language = language;
          snippet.title = title;

          await snippet.save();

          res.status(200).json({ snippet });
        } else {
          res.status(400).json({
            error: "Missing parameters",
          });
          return;
        }
      }
    }
  );
}
