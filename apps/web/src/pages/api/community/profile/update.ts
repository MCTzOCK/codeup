/**
 * src/pages/api/community/profile/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.06.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import CommunityProfileModel from "@codeup/util/src/models/CommunityProfileModel";

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

  if (!req.body || !req.body.token || !req.body.update) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  // @ts-ignore
  jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      res.status(400).json({
        error: "Invalid token",
      });
      return;
    } else {
      await mongoConnect();
      const user = await UserModel.findOne({
        _id: (decoded as any).id as string,
      });

      if (!user) {
        res.status(400).json({
          error: "User not found",
        });
        return;
      }

      const profile = await CommunityProfileModel.findOne({
        user: user._id,
      });

      if (profile) {
        const allowedUpdates = [
          "profilePicture",
          "profileBanner",
          "displayName",
          "bio",
          "website",
          "location",
          "birthday",
        ];

        Object.keys(req.body.update).forEach((key) => {
          if (allowedUpdates.includes(key)) {
            profile[key] = req.body.update[key];
          }
        });

        await profile.save();

        res.status(200).json({
          success: true,
        });
      } else {
        res.status(400).json({
          error: "Profile not found",
        });
        return;
      }
    }
  });
}
