/**
 * apps/web/src/pages/api/forum/post/[id]/index.ts
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

    const post = await ForumPostModel.findOne({
      _id: id,
    });

    if (!post) {
      res.status(404).json({
        error: "Not found",
      });
      return;
    }

    res.status(200).json({
      post,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}
