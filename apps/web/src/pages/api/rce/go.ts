/**
 * apps/web/src/pages/api/rce/go.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
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
    timeout: 7.5,
    code,
    tmpfs: {
      "main.go": code,
    },
    cmd: ["go", "run", "/usr/src/app/main.go"],
    env: ["NO_COLOR=true"],
    image: "rce-golang:codeup",
  });
}
