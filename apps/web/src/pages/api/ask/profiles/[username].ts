/**
 * apps/web/src/pages/api/ask/profiles/[username].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.06.23
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import UserModel from "@codeup/util/dist/models/UserModel";
import AskProfileModel from "@codeup/util/dist/models/AskProfileModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!["GET", "POST"].includes(req.method as string)) {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  try {
    await mongoConnect();

    if (req.method === "GET") {
      const username = req.query.username;

      const user = await UserModel.findOne({
        username,
      });

      if (!user) {
        res.status(404).json({
          error: "User not found",
        });
        return;
      }

      let profile = await AskProfileModel.findOne({
        user: user._id,
      });

      if (!profile) {
        profile = await AskProfileModel.create({
          user: user._id,
          username: username,
          banner: "/_static/images/software-developer-6521720_1920.jpgw",
          badges: [],
          website: "",
          bio: "",
          certificates: [],
          projects: [],
        });
      }

      res.status(200).json({
        profile,
      });
    }
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
}
