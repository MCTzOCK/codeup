/**
 * src/pages/api/community/profile/[id].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.06.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import CommunityProfileModel from "@codeup/util/src/models/CommunityProfileModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  const { name, small } = req.query;

  if (!name) {
    res.status(400).json({
      error: "Missing Name",
    });
    return;
  }

  await mongoConnect();

  try {
    const profile = await CommunityProfileModel.findOne({
      username: name,
    });

    if (!profile) {
      res.status(404).json({
        error: "Not Found",
      });
      return;
    }

    if (!small) {
      res.status(200).json({
        profile,
        success: true,
      });
      return;
    }

    res.status(200).json({
      profile: {
        displayName: profile.displayName,
        bio: profile.bio,
        avatar: profile.avatar,
        username: profile.username,
      },
      success: true,
    });
    return;
  } catch (e) {
    res.status(404).json({
      error: "Not Found",
    });
    return;
  }
}
