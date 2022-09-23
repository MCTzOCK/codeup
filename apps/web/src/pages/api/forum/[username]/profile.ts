/**
 * apps/web/src/pages/api/forum/[username]/profile.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2022
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import ForumProfileModel from "@codeup/util/src/models/ForumProfileModel";
import UserModel from "@codeup/util/src/models/UserModel";
import mongoConnect from "@codeup/util/src/mongo";
import { decode, verify } from "jsonwebtoken";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const username = req.query.username as string;

  try {
    await mongoConnect();

    if (req.method === "GET") {
      const user = await UserModel.findOne({ username: username });

      if (!user) {
        res.status(404).json({
          error: "User not found",
        });
        return;
      }

      const profile = await ForumProfileModel.findOne({ user: user._id });

      if (!profile) {
        res.status(404).json({
          error: "Profile not found",
        });
        return;
      }

      res.status(200).json({
        profile: {
          ...(profile.toJSON() as any),
          username: user.username,
          profilePicture: user.profilePicture,
        },
      });
    } else if (req.method === "POST") {
      if (!req.headers["x-jwt"]) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      const token = req.headers["x-jwt"] as string;

      if (!verify(token, process.env.JWT_SECRET as string)) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      const decoded = decode(token) as any;

      const user = await UserModel.findOne({ username: username });

      if (!user) {
        res.status(404).json({
          error: "User not found",
        });
        return;
      }

      const profile = await ForumProfileModel.findOne({ user: user._id });

      if (profile) {
        if (decoded.id !== user._id.toString()) {
          res.status(401).json({
            error: "Unauthorized",
          });
          return;
        }

        const updatableKeys = ["displayName", "bio", "website", "location"];

        for (const key of updatableKeys) {
          if (req.body[key]) {
            profile[key] = req.body[key];
          }
        }

        await profile.save();

        res.status(200).json({
          profile: {
            ...(profile.toJSON() as any),
            username: user.username,
            profilePicture: user.profilePicture,
          },
        });
      } else {
        const newProfile = await ForumProfileModel.create({
          user: user._id,
          displayName: user.firstName + " " + user.lastName,
          verified: false,
          bio: "CodeUp Benutzer",
          website: "",
          location: "",
          birthday: "2007-03-20",
          createdAt: Date.now(),
        });

        res.status(200).json({
          profile: newProfile,
        });
      }
    } else if (req.method === "DELETE") {
      if (!req.headers["x-jwt"]) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      const token = req.headers["x-jwt"] as string;

      if (!verify(token, process.env.JWT_SECRET as string)) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      const decoded = decode(token) as any;

      const user = await UserModel.findOne({ username: username });

      if (!user) {
        res.status(404).json({
          error: "User not found",
        });
        return;
      }

      const profile = await ForumProfileModel.findOne({ user: user._id });

      if (!profile) {
        res.status(404).json({
          error: "Profile not found",
        });
        return;
      }

      if (decoded.id !== user._id.toString()) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      await profile.remove();

      res.status(200).json({
        deleted: true,
      });
    } else {
      res.status(405).json({
        error: "Method not allowed",
      });
    }
  } catch (e) {
    res.status(500).json({
      error: e,
    });
    return;
  }
}
