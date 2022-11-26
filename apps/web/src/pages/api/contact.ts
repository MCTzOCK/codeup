/**
 * apps/web/src/pages/api/contact.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.22
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import mongoConnect from "@codeup/util/src/mongo";
import UserModel from "@codeup/util/src/models/UserModel";
import ContactModel from "@codeup/util/src/models/ContactModel";

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

  if (
    !req.headers["x-jwt"] ||
    !req.body ||
    !req.body.message ||
    !req.body.title ||
    !req.body.category
  ) {
    res.status(400).json({
      error: "Bad Request",
    });
    return;
  }

  const token = req.headers["x-jwt"];

  try {
    await mongoConnect();

    if (!verify(token as string, process.env.JWT_SECRET as string)) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as any;

    const user = await UserModel.findOne({ _id: decoded.id });

    if (!user) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const contact = await ContactModel.create({
      username: user.username,
      message: req.body.message,
      title: req.body.title,
      category: req.body.category,
    });

    res.status(200).json({
      success: true,
      message_id: contact._id,
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
    });
    return;
  }
}
