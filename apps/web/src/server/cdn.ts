/**
 * apps/web/src/server/cdn.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.11.2024
 *
 */
import { ServerResponse } from "node:http";
import { getS3 } from "../global/getS3";

export const handleCDNRequest = (res: ServerResponse, pathname: string) => {
  const client = getS3();

  client.presignedGetObject(
    "codeup-cdn",
    pathname!.split("/").slice(1).join("/"),
    (err, url) => {
      if (err) {
        res.statusCode = 404;
        res.write("Not Found");
        res.end();
        return;
      }
      res.writeHead(302, {
        Location: url,
      });
      res.end();
    }
  );
};
