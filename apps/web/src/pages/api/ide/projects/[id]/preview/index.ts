/**
 * apps/web/src/pages/api/ide/projects/[id]/preview/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.07.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { NextApiRequest, NextApiResponse } from "next";

export default function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).end(JSON.stringify({ name: "John Doe" }));
}
