/**
 * apps/observability/src/pages/api/analytics/view.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.10.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import ApplicationModel from "@/models/ApplicationModel";
import UAParser from "ua-parser-js";
import PageViewModel from "@/models/PageViewModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({
        status: 405,
        error: "Method not allowed",
      });
    }

    const { appId } = req.query;

    if (!appId) {
      res.status(400).json({
        status: 400,
        error: "Please provide an application id",
      });
      return;
    }

    const app = await ApplicationModel.findById(appId as string);

    if (!app) {
      res.status(404).json({
        status: 404,
        error: "Application not found",
      });
      return;
    }

    const { url, userAgent, language, screenResolution, viewport } = req.body;

    const ip = req.connection.remoteAddress;

    if (!url || !userAgent) {
      res.status(400).json({
        status: 400,
        error: "Please provide a url and a user agent",
      });
      return;
    }

    let parser = new UAParser(userAgent);
    let browser = parser.getBrowser().name + " " + parser.getBrowser().version;
    let os = parser.getOS().name + " " + parser.getOS().version;

    const pageView = await PageViewModel.create({
      application: app._id,
      url,
      userAgent,
      browser,
      os,
      language,
      screenResolution,
      viewport,
      ip,
    });

    await pageView.save();

    res.status(200).json({
      status: 200,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
