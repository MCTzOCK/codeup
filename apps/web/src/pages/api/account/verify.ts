/**
 * src/pages/api/account/verify.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import { decode, verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers = req.headers;

  if (headers["x-jwt"]) {
    const token = headers["x-jwt"];

    try {
      if (verify(token as string, process.env.JWT_SECRET as string)) {
        const decoded = decode(token as string);

        res.status(200).json({
          verified: true,
          data: decoded,
        });
      } else {
        res.status(401).json({
          verified: false,
        });
      }
    } catch (e) {
      res.status(401).json({
        verified: false,
      });
    }
  } else {
    res.status(403).json({
      loggedIn: false,
    });
  }
}
