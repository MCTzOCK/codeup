/**
 * apps/web/src/pages/api/admin/analytics/summary.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.11.2022
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import mongoConnect from "@codeup/util/src/mongo";
import UserModel from "@codeup/util/src/models/UserModel";
import AnalyticsModel from "@codeup/util/src/models/AnalyticsModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
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

  try {
    const jwt = req.headers["x-jwt"];
    if (!verify(jwt as string, process.env.JWT_SECRET as string)) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = verify(
      jwt as string,
      process.env.JWT_SECRET as string
    ) as any;

    const adminuser = await UserModel.findOne({ username: decoded.username });

    if (adminuser.role !== "admin") {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    await mongoConnect();

    const data: {
      browsers: {
        // BROWSER: Percentage
        [key: string]: number;
      };
      os: {
        // OS: Percentage
        [key: string]: number;
      };
      paths: {
        // PATH: Percentage
        [key: string]: number;
      };
      // Logged in views percentage
      authenticatedViewPercentage: number;
      // Not logged in views percentage
      anonymousViewPercentage: number;
      // Total views
      totalViews: number;
    } = {
      browsers: {},
      paths: {},
      os: {},
      authenticatedViewPercentage: 0,
      anonymousViewPercentage: 0,
      totalViews: 0,
    };

    let findObject: any = {};

    if (req.query.userId) {
      findObject.userId = req.query.userId;
    }

    const analytics = await AnalyticsModel.find(findObject);

    analytics.forEach((a) => {
      data.totalViews++;

      if (a.browser) {
        if (data.browsers[a.browser]) {
          data.browsers[a.browser]++;
        } else {
          data.browsers[a.browser] = 1;
        }
      }

      if (a.os) {
        if (data.os[a.os]) {
          data.os[a.os]++;
        } else {
          data.os[a.os] = 1;
        }
      }

      if (a.path) {
        if (data.paths[a.path]) {
          data.paths[a.path]++;
        } else {
          data.paths[a.path] = 1;
        }
      }

      if (a.loggedIn) {
        data.authenticatedViewPercentage++;
      } else {
        data.anonymousViewPercentage++;
      }
    });

    data.authenticatedViewPercentage =
      (data.authenticatedViewPercentage / data.totalViews) * 100;
    data.anonymousViewPercentage =
      (data.anonymousViewPercentage / data.totalViews) * 100;

    for (const b in data.browsers) {
      data.browsers[b] = Math.round((data.browsers[b] / data.totalViews) * 100);
    }

    for (const o in data.os) {
      data.os[o] = Math.round((data.os[o] / data.totalViews) * 100);
    }

    for (const p in data.paths) {
      data.paths[p] = Math.round((data.paths[p] / data.totalViews) * 100);
    }

    res.status(200).json({ data });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
