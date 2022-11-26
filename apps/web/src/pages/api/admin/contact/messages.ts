/**
 * apps/web/src/pages/api/admin/contact/messages.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.11.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import ContactModel from "@codeup/util/src/models/ContactModel";
import UserModel from "@codeup/util/src/models/UserModel";
import mongoConnect from "@codeup/util/src/mongo";
import { verify } from "jsonwebtoken";
import CourseModel from "@codeup/util/src/models/CourseModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!["GET", "DELETE"].includes(req.method)) {
    res.status(405).json({
      error: "Method not allowed",
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
      const messages = await ContactModel.find({});

      if (req.query.count) {
        res.status(200).json({
          count: messages.length,
        });
        return;
      }

      res.status(200).json({ messages });
    } else if (req.method === "DELETE") {
      const id = req.query.id as string;

      if (!id) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const message = await ContactModel.findById(id);

      if (!message) {
        res.status(404).json({
          error: "Not Found",
        });
        return;
      }

      await message.remove();

      res.status(200).json({
        success: true,
      });
    }
  } catch (e) {
    // @ts-ignore
    if (e.message) {
      res.status(500).json({
        // @ts-ignore
        error: "Internal Server Error:" + e.message,
        success: false,
      });
    } else {
      res.status(500).json({
        error: "Internal Server Error: Unknown Error",
        success: false,
      });
    }
  }
}
