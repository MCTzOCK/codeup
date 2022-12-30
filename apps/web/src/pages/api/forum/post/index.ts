/**
 * apps/web/src/pages/api/forum/post/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2022
 *
 */
import mongoConnect from "@codeup/util/src/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { decode, verify } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import ForumPostModel from "@codeup/util/src/models/ForumPostModel";
import ogs from "open-graph-scraper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.headers["x-jwt"]) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  if (!req.body || !req.body.content) {
    res.status(400).json({
      error: "Bad request",
    });
    return;
  }

  try {
    await mongoConnect();

    if (
      !verify(req.headers["x-jwt"] as string, process.env.JWT_SECRET as string)
    ) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = decode(req.headers["x-jwt"] as string);

    const user = await UserModel.findOne({
      // @ts-ignore
      username: decoded.username,
    });

    if (!user) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    if (req.body.parent) {
      const parent = await ForumPostModel.findById(req.body.parent);
      if (!parent) {
        res.status(400).json({
          error: "Bad request",
        });
        return;
      }
      const post = await ForumPostModel.create({
        user: user._id,
        username: user.username,
        content: req.body.content,
        parent: parent._id,
        embeds: await getEmbeds(req.body.content),
      });

      await post.save();

      res.status(200).json({
        post,
      });

      return;
    }

    const post = await ForumPostModel.create({
      user: user._id,
      username: user.username,
      content: req.body.content,
      embeds: await getEmbeds(req.body.content),
    });

    await post.save();

    res.status(200).json({
      post,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}

async function getEmbeds(content: string): any[] {
  const embeds: {
    type: "file" | "image" | "video" | "audio" | "link";
    url?: string;
    title?: string;
    description?: string;
    image?: string;
    site_name?: string;
  }[] = [];

  const links = content.match(/(https?:\/\/[^\s]+)/g);

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

  return embeds;
}
