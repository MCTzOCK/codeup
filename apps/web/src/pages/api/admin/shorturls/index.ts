/**
 * apps/web/src/pages/api/admin/shorturls/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.04.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import ShortURLModel from "@codeup/util/src/models/ShortURLModel";
import UserModel from "@codeup/util/src/models/UserModel";
import mongoConnect from "@codeup/util/dist/mongo";

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
    const decoded = jwt.verify(
      req.headers["x-jwt"] as string,
      process.env.JWT_SECRET as string
    );

    if (!decoded) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    await mongoConnect();

    const user = await UserModel.findOne({
      _id: (decoded as any).id,
    });

    if (!user || user.role !== "admin") {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    if (req.method === "GET") {
      const shortUrls = await ShortURLModel.find({});
      res.status(200).json(shortUrls);
    } else if (req.method === "POST") {
      if (!req.body || !req.body.short || !req.body.destination) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const existing = await ShortURLModel.findOne({
        short: req.body.short,
      });

      if (existing) {
        res.status(400).json({
          error: "Short already exists",
        });
        return;
      }

      const shortUrl = await ShortURLModel.create({
        short: req.body.short,
        destination: req.body.destination,
      });

      res.status(200).json(shortUrl);
    } else if (req.method === "DELETE") {
      if (!req.query.short) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const existing = await ShortURLModel.findById(req.query.short);

      if (!existing) {
        res.status(400).json({
          error: "Short doesn't exists",
        });
        return;
      }

      await existing.remove();

      res.status(200).json({
        success: true,
      });
    } else {
      res.status(405).json({
        error: "Method not allowed",
      });
    }
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
}
