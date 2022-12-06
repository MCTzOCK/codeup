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
import fs from "fs";
import path from "path";
import IDEProjectModel from "@codeup/util/src/models/IDEProjectModel";
import mongoose from "mongoose";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("X-Served-By", "CodeUp");

    const { pathname, query } = parsedUrl;

    if (pathname === "/_internal/api/app/stats") {
      if (process.env.NODE_ENV === "production") {
        if (
          fs.existsSync(path.join(__dirname, "..", ".codeup_app_stats.json"))
        ) {
          res.setHeader("Content-Type", "application/json");
          res.end(
            fs
              .readFileSync(
                path.join(__dirname, "..", ".codeup_app_stats.json")
              )
              .toString()
          );
        } else {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              status: "failed",
              message: "This endpoint is currently not available.",
            })
          );
        }
      } else {
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            status: "failed",
            message: "This endpoint is only available in production mode.",
          })
        );
      }

      return;
    }

    if (pathname?.startsWith("/project")) {
      // URL Structure : /project/:customName/:path

      const customName = pathname.split("/")[2];
      const path = pathname.split("/").slice(3).join("/");

      try {
        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(process.env.MONGO_URI as string);
        }

        const project = await IDEProjectModel.findOne({
          publishedCustomName: customName,
        });

        if (!project) {
          throw new Error();
          return;
        }

        if (!project.published) {
          throw new Error();
          return;
        }

        const file = project.files.find(
          (f: { path: string }) => f.path === `/${path}`
        );

        if (!file) {
          await app.render404(req, res, parsedUrl);
          return;
        }

        const mimeTypes: { [key: string]: string } = {
          js: "application/javascript",
          css: "text/css",
          html: "text/html",
          json: "application/json",
          png: "image/png",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          gif: "image/gif",
          svg: "image/svg+xml",
        };

        const ext = path.split(".").slice(-1)[0];

        res.setHeader("Content-Type", mimeTypes[ext] || "text/plain");
        res.end(file.content);
      } catch (e) {
        console.log(e);
        await app.render404(req, res, parsedUrl);
        return;
      }
    }

    handle(req, res, parsedUrl);
  }).listen(port, "0.0.0.0");

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://0.0.0.0:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});
