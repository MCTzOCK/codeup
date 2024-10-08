/**
 * apps/web/src/pages/api/admin/paginated-data.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.10.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import mongoose from "mongoose";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    const PAGE_SIZE = 2;

    if (!auth) {
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({
        status: 403,
        error: "You are not allowed to do this.",
      });
      return;
    }

    const model = req.query.model as string;

    const page = parseInt(req.query.page as string) || 1;
    const query = req.query.query as string;
    const queryKey = req.query.queryKey as string;

    const records = await mongoose.models[model]
      .find({
        [queryKey]: { $regex: query, $options: "i" },
      })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    const totalRecords = await mongoose.models[model].countDocuments({
      [queryKey]: { $regex: query, $options: "i" },
    });

    res.status(200).json({
      status: 200,
      records,
      pages: Math.ceil(totalRecords / PAGE_SIZE),
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
