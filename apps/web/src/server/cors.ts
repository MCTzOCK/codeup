/**
 * apps/web/src/server/cors.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.11.2024
 *
 */
import { ServerResponse } from "node:http";

export const sendDefaultCorsHeaders = (res: ServerResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Served-By", "CodeUp");
};

export const sendWebContainerHeaders = (res: ServerResponse) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
};

export const handleOptionsRequest = (res: ServerResponse) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD, CONNECT, TRACE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.statusCode = 200;
  res.end();
};
