/**
 * apps/web/src/pages/api/forum/embeds.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.12.2022
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import ogs from "open-graph-scraper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.body) {
    res.status(400).send("No body provided");
    return;
  }

  const links = req.body.links;

  if (!links) {
    res.status(400).send("No links provided");
    return;
  }

  const embeds: {
    type: "file" | "image" | "video" | "audio" | "link";
    url?: string;
    title?: string;
    description?: string;
    image?: string;
    site_name?: string;
  }[] = [];

  for (const link of links) {
    const headRes = await fetch(link, {
      method: "HEAD",
    });

    const contentType = ((headRes.headers.get("Content-Type") as string) || "")
      .toLowerCase()
      .split(";")[0];

    if (contentType === "text/html") {
      const o = await ogs({ url: link });
      if (!o.error) {
        embeds.push({
          title: (o.result as any).ogTitle as string,
          description: (o.result as any).ogDescription as string,
          image: (o.result as any).ogImage.url as string,
          url: (o.result as any).ogUrl as string,
          site_name: (o.result as any).ogSiteName as string,
          type: "link",
        });
      }
    } else if (contentType.startsWith("image/")) {
      embeds.push({
        url: link,
        type: "image",
      });
    } else if (contentType.startsWith("video/")) {
      embeds.push({
        url: link,
        type: "video",
      });
    } else {
      embeds.push({
        url: link,
        type: "file",
      });
    }
  }

  res.status(200).send(embeds);
}
