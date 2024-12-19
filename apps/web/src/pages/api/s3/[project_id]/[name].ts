/**
 * apps/web/src/pages/api/s3/[project_id]/[name].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import { getS3 } from "../../../../global/getS3";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await mongoConnect();

    const { project_id, name } = req.query;

    if (!project_id || !name) {
      res.status(400).json({
        status: 400,
        error: "Invalid Request",
      });
      return;
    }

    const client = getS3();

    const url = await client.presignedGetObject(
      "codeup-project-" + project_id,
      name as string,
      60 * 60 * 24,
      {
        "response-content-type": "application/octet-stream",
      }
    );

    res.redirect(url);
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
