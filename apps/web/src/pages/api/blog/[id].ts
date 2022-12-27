/**
 * apps/web/src/pages/api/blog/[id].ts
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
    const id = req.query.id as string;

    await mongoConnect();

    const blog = await BlogModel.findById(id);

    res.status(200).json({ blog });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}
