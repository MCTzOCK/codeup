/**
 * apps/observability/src/pages/api/analytics/script.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.10.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const appId = req.query.appId;

    if (!appId) {
      res.status(200);
      res.setHeader("Content-Type", "text/javascript");
      res.send(`console.error("No App ID provided")`);
      res.end();
      return;
    }

    const base = await (
      await fetch(
        `${
          (req.headers.host as string).includes("localhost")
            ? "http://"
            : "https://"
        }` +
          req.headers.host +
          "/script.base.js"
      )
    ).text();

    let script = base
      .replace(/\/\/WINDOW_APP_ID/g, "window.appId = '" + appId + "'")
      .replace(
        /\/\/WINDOW_CUP_URL/g,
        "window.cupURL = 'http://" + req.headers.host + "'"
      );

    res.status(200);
    res.setHeader("Content-Type", "text/javascript");
    res.send(script);
    res.end();
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
