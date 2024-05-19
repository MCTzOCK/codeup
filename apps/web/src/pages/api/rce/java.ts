/**
 * apps/web/src/pages/api/rce/java.ts
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
  let extractedClassName = code.match(/public class (\w+)/)?.[1];

  const tmpfs: any = {
    "r.sh": `#!/bin/bash\njavac ${extractedClassName}.java && java ${extractedClassName}`,
  };

  tmpfs[`${extractedClassName}.java`] = code;

  await rce(req, res, {
    timeout: 5,
    code,
    entrypoint: ["/bin/sh"],
    cmd: ["/usr/src/app/r.sh"],
    env: [],
    image: "mctzock/codeup-java-rce:latest",
    tmpfs: tmpfs,
  });
}
