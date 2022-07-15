/**
 * apps/web/src/pages/api/account/delete.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.07.2022
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import sendMail from "@codeup/util/src/sendMail";
import generateMail from "@codeup/util/src/generateMail";
import UserModel from "@codeup/util/src/models/UserModel";
import * as crypto from "crypto";
import checkPassword from "@codeup/util/src/checkPassword";
import jwt from "jsonwebtoken";

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

  if (!req.body || !req.body.token) {
    res.status(400).json({
      error: "Token is missing",
    });
    return;
  }

  // @ts-ignore
  jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      res.status(400).json({
        error: "Invalid token",
        details: err,
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

    await sendMail(
      user.email,
      "Konto gelöscht",
      "Dein Konto wurde erfolgreich gelöscht!",
      user.firstName
    );

    await user.remove();

    // DELETE: CommunityProfile, CommunityPosts, TodoLists with no contributors, IDEProjects with no contributors
    // DELETE: CourseProgress

    res.status(200).json({
      success: true,
      message: "Deleted.",
    });
  });
}
