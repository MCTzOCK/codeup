/**
 * apps/web/src/pages/api/usercontent/upload.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.08.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { getS3 } from "../../../global/getS3";
import fs from "fs";
import path from "path";
import { tmpdir } from "node:os";
import { createHash } from "crypto";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = getS3();
    const { filename, content } = req.body;
    const fNameb64 = Buffer.from(filename).toString("base64");

    const x = `${filename};${content}`;
    const sha = createHash("sha256").update(x).digest("hex");

    fs.writeFileSync(
      path.join(tmpdir(), fNameb64 + filename.split(".").pop()),
      content,
      "base64"
    );

    const fName = sha + "." + filename.split(".").pop();

    client.fPutObject(
      "codeup-cdn",
      "usercontent/" + fName,
      path.join(tmpdir(), fNameb64 + filename.split(".").pop())
    );

    res.status(200).json({
      status: 200,
      message: "success",
      url: "https://cdn.codeup.space/usercontent/" + fName,
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
      sizeLimit: "10mb",
    },
  },
};
