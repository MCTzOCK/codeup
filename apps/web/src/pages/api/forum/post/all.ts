/**
 * apps/web/src/pages/api/forum/post/all.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2022
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import ForumPostModel from "@codeup/util/src/models/ForumPostModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    await mongoConnect();

    const posts = await ForumPostModel.find();

    res.status(200).json({
      posts,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}
