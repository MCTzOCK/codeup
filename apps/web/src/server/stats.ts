/**
 * apps/web/src/server/stats.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.11.2024
 *
 */
import fs from "fs";
import path from "path";
import { ServerResponse } from "node:http";

export const handleStats = async (res: ServerResponse) => {
  if (process.env.NODE_ENV === "production") {
    if (
      fs.existsSync(path.join(__dirname, "..", "..", ".codeup_app_stats.json"))
    ) {
      res.setHeader("Content-Type", "application/json");
      res.end(
        fs
          .readFileSync(
            path.join(__dirname, "..", "..", ".codeup_app_stats.json")
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
};
