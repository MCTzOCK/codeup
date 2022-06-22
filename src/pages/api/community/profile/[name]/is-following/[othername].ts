/**
 * src/pages/api/community/profile/[name]/is-following/[othername].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.06.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "../../../../../../util/mongo";
import CommunityProfileModel from "../../../../../../util/models/CommunityProfileModel";
import UserModel from "../../../../../../util/models/UserModel";

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

  const { name, othername } = req.query;

  await mongoConnect();

  const profile = await CommunityProfileModel.findOne({ username: name });

  if (!profile) {
    res.status(404).json({
      error: "Invalid Profile",
    });
    return;
  }

  const user = await UserModel.findOne({ username: othername });

  if (!user) {
    res.status(404).json({
      error: "Invalid User",
    });
    return;
  }

  const isFollowing = profile.followers.includes(user.username.toString());

  res.status(200).json({
    isFollowing,
    success: true,
  });
}
