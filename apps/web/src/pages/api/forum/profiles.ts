/**
 * apps/web/src/pages/api/forum/profiles.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2022
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import ForumProfileModel from "@codeup/util/src/models/ForumProfileModel";
import UserModel from "@codeup/util/src/models/UserModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await mongoConnect();

    const profiles = await ForumProfileModel.find();

    let sortedProfiles = profiles.sort((a, b) => {
      if (a.verified && !b.verified) {
        return -1;
      } else if (!a.verified && b.verified) {
        return 1;
      } else {
        return a.username.localeCompare(b.username);
      }
    });

    let pfps = [];

    for (const profile of sortedProfiles) {
      const user = await UserModel.findOne({
        _id: profile.user,
      });

      pfps.push({
        ...profile.toJSON(),
        username: user.username,
      });
    }

    res.status(200).json({
      profiles: pfps,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}
