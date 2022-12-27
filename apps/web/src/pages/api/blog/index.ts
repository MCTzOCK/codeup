/**
 * apps/web/src/pages/api/blog/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.12.2022
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import BlogModel from "@codeup/util/src/models/BlogModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await mongoConnect();

    const blogs = await BlogModel.find({});

    res.status(200).json({ blogs });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}
