/**
 * apps/web/src/pages/api/admin/cdn/files.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.07.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../global/server/isLoggedIn";
import { getS3 } from "../../../../global/getS3";
import { BucketItem } from "minio";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    if (user.role !== "admin") {
      res.status(403).json({
        status: 403,
        error: "You are not allowed to access this endpoint.",
      });
      return;
    }

    const client = getS3();

    const stream = client.listObjectsV2("codeup-cdn", "", true);

    let objects: BucketItem[] = [];

    stream.on("data", (obj) => {
      objects.push(obj);
    });

    stream.on("end", () => {
      res.status(200).json({
        status: 200,
        data: objects,
      });
    });

    stream.on("error", (e) => {
      res.status(500).json({
        status: 500,
        error: e.message,
      });
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
