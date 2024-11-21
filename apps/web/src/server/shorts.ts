/**
 * apps/web/src/server/shorts.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.11.2024
 *
 */
import ShortURLModel from "@codeup/util/dist/models/ShortURLModel";
import { ServerResponse } from "node:http";

export const handleShortURL = async (
  pathname: string,
  res: ServerResponse
): Promise<boolean> => {
  const shortUrl = await ShortURLModel.findOne({
    short: pathname!.startsWith("/") ? pathname!.slice(1) : pathname,
  });

  if (shortUrl) {
    res.writeHead(302, {
      Location: shortUrl.destination,
    });

    res.end();

    return true;
  }

  return false;
};
