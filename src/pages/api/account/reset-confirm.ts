/**
 * src/pages/api/account/reset-confirm.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "../../../util/mongo";
import UserModel from "../../../util/models/UserModel";
import * as crypto from "crypto";

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

  if (!req.body || !req.body.token || !req.body.password) {
    res.status(400).json({
      error: "Missing required fields",
    });
    return;
  }

  const token = req.body.token;

  await mongoConnect();

  const user = await UserModel.findOne({
    resetToken: token,
  });

  if (!user) {
    res.status(400).json({
      error: "Invalid token",
    });
    return;
  }

  if (
    !req.body.password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
  ) {
    res.status(400).json({
      error:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
    });
    return;
  }

  user.password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");

  user.resetToken = null;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
}
