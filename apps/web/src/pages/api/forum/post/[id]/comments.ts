/**
 * apps/web/src/pages/api/forum/post/[id]/comments.ts
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

    const comments = await ForumPostModel.find({
      parent: post._id,
    });

    const sortedComments = comments.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.status(200).json({
      post,
      comments: sortedComments,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}
