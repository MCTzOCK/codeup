/**
 * apps/web/src/pages/api/cloud-computing/attach.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.11.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import { randomBytes } from "crypto";
import { createCws, getId, hasCws, startCws } from "../../../global/cwswrapper";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    if (!(await hasCws(user.username))) {
      await createCws(user.username);
    }

    const id = await getId(user.username);

    if (!id) {
      res.status(500).json({
        status: 500,
        error: "Internal Server Error",
      });
      return;
    }

    await startCws(id);

    res.status(200).json({
      status: 200,
      url: `https://${id}.cws.codeup.space`,
    });
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
