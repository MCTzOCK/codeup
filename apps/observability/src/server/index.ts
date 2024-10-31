/**
 * apps/observability/src/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.10.2024
 *
 */

import * as http from "http";
import next from "next";
import mongoose from "mongoose";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const app = next({ dev, customServer: true });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        process.env.MONGO_URI || "mongodb://localhost:27017/observability",
        {}
      );
    }

    console.log("Connected to MongoDB");

    const server = http.createServer((req, res) => {
      console.log(new Date().toLocaleString(), req.method, req.url);
      if (req.method === "OPTIONS") {
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, PATCH, OPTIONS, TRACE, HEAD",
          "Access-Control-Allow-Headers": "*",
        });
        res.end();
        return;
      }

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS, TRACE, HEAD"
      );
      res.setHeader("Access-Control-Allow-Headers", "*");

      handle(req, res);
    });

    server.listen(port, () => {
      console.log(`Server started on http://0.0.0.0:${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
