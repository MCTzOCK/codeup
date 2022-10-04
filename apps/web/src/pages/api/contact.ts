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
import sendMail from "@codeup/util/src/sendMail";

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
    // HIGH -> process.env.CONTACT_HIGH
    // MEDIUM -> process.env.CONTACT_MEDIUM
    // LOW -> process.env.CONTACT_LOW
    !req.body.priority
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

    const email = user.email;

    req.body.priority = req.body.priority.toUpperCase();

    const email_recipient =
      req.body.priority === "HIGH"
        ? process.env.CONTACT_HIGH
        : req.body.priority === "MEDIUM"
        ? process.env.CONTACT_MEDIUM
        : process.env.CONTACT_LOW;

    sendMail(
      email_recipient,
      "[CODEUP] Neue Nachricht von " + user.username,
      `Neue Kontaktanfrage von ${user.username} (${email}):<br /><br />${req.body.message}`,
      "Ben"
    );

    res.status(200).json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
    });
    return;
  }
}
