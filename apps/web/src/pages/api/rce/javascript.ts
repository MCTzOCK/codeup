/**
 * apps/web/src/pages/api/rce/javascript.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { rce } from "../../../global/server/rce";
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.body;

  if (!code) {
    res.status(400).json({
      status: 400,
      error: "No code provided",
    });
    return;
  }
  await rce(req, res, {
    timeout: 2.5,
    cmd: ["node", "/usr/src/app/index.js"],
    env: ["NO_COLOR=true"],
    image: "node:latest",
    code,
    tmpfs: {
      "index.js": code,
    },
  });
}
