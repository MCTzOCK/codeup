/**
 * apps/web/src/server/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.12.2022
 *
 */

import { createServer } from "http";
import { parse } from "url";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("X-Served-By", "CodeUp");

    handle(req, res, parsedUrl);
  }).listen(port, "0.0.0.0");

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://0.0.0.0:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});
