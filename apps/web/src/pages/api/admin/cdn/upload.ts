/**
 * apps/web/src/pages/api/admin/cdn/upload.ts
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
import fs from "fs";
import path from "path";
import { tmpdir } from "node:os";

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

    const { file, name } = req.body;

    if (!file || !name) {
      res.status(400).json({
        status: 400,
        error: "Invalid Request",
      });
      return;
    }

    const fsName = path.join(
      tmpdir(),
      "codeup-cdn-" + name.replaceAll("/", "_")
    );

    fs.writeFileSync(fsName, file, "base64");

    const stream = fs.createReadStream(fsName);

    await client.fPutObject("codeup-cdn", name, fsName, {});

    res.status(200).json({
      status: 200,
      message: "File uploaded",
      url: "https://cdn.codeup.space/" + name,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};
