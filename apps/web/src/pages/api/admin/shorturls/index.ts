/**
 * apps/web/src/pages/api/admin/shorturls/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.04.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import ShortURLModel from "@codeup/util/src/models/ShortURLModel";
import UserModel from "@codeup/util/src/models/UserModel";
import mongoConnect from "@codeup/util/dist/mongo";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
}
