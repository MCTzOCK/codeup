/**
 * apps/web/src/pages/api/user/[name].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.03.23
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import UserModel from "@codeup/util/dist/models/UserModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await mongoConnect();

    const user = await UserModel.findOne({
      username: req.query.name,
    });

    if (!user) {
      res.status(400).json({
        error: "User not found",
        success: false,
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        profilePicture: "/api/account/" + user.username + "/picture",
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (e: any) {
    res.status(500).json({
      error: e,
      success: false,
    });
  }
}
