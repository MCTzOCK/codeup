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
import * as next from "next";
import mongoose from "mongoose";
import { createSocketServer } from "./socket";
import Docker from "dockerode";
import { handleError } from "./error";
import { init } from "./init";
import {
  handleOptionsRequest,
  sendDefaultCorsHeaders,
  sendWebContainerHeaders,
} from "./cors";
import { handleCDNRequest } from "./cdn";
import { handleShortURL } from "./shorts";
import {
  handleV1Projects,
  handleV2Preview,
  handleV2Projects,
  handleV2Static,
} from "./projects";
import { handleStats } from "./stats";
import { handleMediaRequest } from "./media";

const app = next.default({
  dev: process.env.NODE_ENV === "development",
});
const handle = app.getRequestHandler();

if (process.env.DISABLE_PAYMENTS === "true") {
  // @ts-ignore
  process.env.DISABLE_PAYMENTS = true;
}

// @ts-ignore
process.env.DISABLE_PAYMENTS = true;

app
  .prepare()
  .then(async () => {
    const port = parseInt(process.env.PORT || "3000", 10);

    const docker = new Docker();

    await init(docker);

    const mediaBucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      {
        bucketName: "media",
      }
    );

    process.on("uncaughtException", async (e) => {
      await handleError(e);
    });

    const httpServer = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url!, true);

        sendDefaultCorsHeaders(res);

        const { pathname } = parsedUrl;

        if (pathname?.startsWith("/projects")) {
          sendWebContainerHeaders(res);
        }

        if (req.method === "OPTIONS") {
          handleOptionsRequest(res);
          return;
        }

        const customDomain = req.headers.host!.includes(":")
          ? req.headers.host!.split(":")[0]
          : req.headers.host;

        if (
          customDomain === "cdn.codeup.space" ||
          customDomain === "cdn.codeup.local"
        ) {
          handleCDNRequest(res, pathname as string);
          return;
        }

        if (customDomain!.split(".").length > 2) {
          await handleV2Projects(
            req,
            res,
            customDomain as string,
            handle,
            pathname as string,
            docker,
            parsedUrl
          );
          return;
        } else {
          if (pathname === "/_internal/api/app/stats") {
            await handleStats(res);
            return;
          }

          if (await handleShortURL(pathname as string, res)) {
            return;
          }

          if (
            pathname?.startsWith("/project") &&
            !pathname?.startsWith("/projects")
          ) {
            await handleV1Projects(pathname, res, app, req, parsedUrl);
            return;
          }

          if (pathname?.startsWith("/media")) {
            await handleMediaRequest(
              pathname,
              req,
              res,
              parsedUrl,
              app,
              mediaBucket
            );
            return;
          }

          if (pathname?.startsWith("/editor-static")) {
            await handleV2Static(pathname, app, req, res);
            return;
          }

          if (pathname?.startsWith("/editor-preview")) {
            await handleV2Preview(pathname, app, req, res);
            return;
          }

          await handle(req, res, parsedUrl);
        }
      } catch (e) {
        await handleError(e);
        await app.renderError(e as any, req, res, req.url!);
      }
    });

    createSocketServer(httpServer);

    httpServer.listen(port, "0.0.0.0", 10, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(async (e) => {
    handleError(e);
    console.error(e);
    process.exit(1);
  });

import "./gitServer";
