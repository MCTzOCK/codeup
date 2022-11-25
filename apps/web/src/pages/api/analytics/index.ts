/**
 * apps/web/src/pages/api/analytics/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.11.2022
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import UAParser from "ua-parser-js";
import { verify } from "jsonwebtoken";
import AnalyticsModel from "@codeup/util/src/models/AnalyticsModel";
import mongoConnect from "@codeup/util/src/mongo";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (
    !req.headers["referer"] ||
    !req.headers["user-agent"] ||
    !req.headers["host"]
  ) {
    res.status(400).json({ error: "Bad request" });
    return;
  }

  const parser = new UAParser(req.headers["user-agent"] as string);

  const browser = parser.getBrowser().name;
  const os = parser.getOS().name + " " + parser.getOS().version;

  const token = req.headers["x-jwt"];

  let loggedIn = false;
  let userId = null;

  if (token) {
    const decoded = verify(token as string, process.env.JWT_SECRET as string);
    if (decoded) {
      loggedIn = true;
      userId = (decoded as any)["id"] as any;
    } else {
      loggedIn = false;
      userId = null;
    }
  }

  const path = (req.headers["referer"] as string)
    .replace("https://", "")
    .replace("http://", "")
    .replace(req.headers["host"] as string, "");

  try {
    await mongoConnect();

    const analytics = await AnalyticsModel.create({
      browser,
      os,
      path,
      loggedIn,
      userId,
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
    });
  } catch (e) {
    // @ts-ignore
    if (e.message) {
      // @ts-ignore
      res.status(500).json({ error: e.message });
    } else {
      // @ts-ignore
      res.status(500).json({ error: "Unknown Internal server error" });
    }
  }
}
