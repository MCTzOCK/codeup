/**
 * apps/web/src/pages/api/users/[id].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.03.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import UserModel from "@codeup/util/dist/models/UserModel";


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

  await mongoConnect();

  const id = req.query.id;

  if (!id) {
    res.status(400).json({
      error: "Missing id",
    });
    return;
  }

  const user = await UserModel.findOne({
    _id: id,
  });

  if (!user) {
    res.status(400).json({
      error: "User not found",
    });
    return;
  }

  res.status(200).json({
    user: {
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: "/api/account/" + user.username + "/picture"
    }
  });

}