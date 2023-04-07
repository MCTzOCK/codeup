/**
 * apps/web/src/pages/api/admin/analytics/user-summary.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.04.2023
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

  if (!req.query.userId) {
    res.status(400).json({
      error: "Bad Request",
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

    await mongoConnect();

    const adminuser = await UserModel.findOne({ username: decoded.username });

    if (!adminuser) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    if (adminuser.role !== "admin") {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const user = await UserModel.findById(req.query.userId as string);

    if (!user) {
      res.status(400).json({
        error: "Bad Request",
      });
      return;
    }
    const analytics = await AnalyticsModel.find({
      userId: user._id,
    });

    if (req.query.detailed === "true") {
      res.status(200).json({
        analytics,
      });
    } else {
      if (analytics.length === 0) {
        res.status(200).json({
          first: {
            view: "2023-04-06T23:14:59.367Z",
            page: "",
            browser: "",
            os: "",
          },
          last: {
            view: "2023-04-07T23:14:59.368Z",
            page: "",
            browser: "",
            os: "",
          },
          totalViews: 0,
          averageViewsPerDay: 0,
        });
        return;
      }

      const firstView = analytics.sort((a, b) => a.createdAt - b.createdAt)[0];

      const lastView = analytics.sort((a, b) => b.createdAt - a.createdAt)[0];

      res.status(200).json({
        first: {
          view: firstView.createdAt,
          page: firstView.path,
          browser: firstView.browser,
          os: firstView.os,
        },
        last: {
          view: lastView.createdAt,
          page: lastView.path,
          browser: lastView.browser,
          os: lastView.os,
        },
        totalViews: analytics.length,
        averageViewsPerDay:
          (analytics.length / (new Date().getTime() - firstView.createdAt)) *
          1000 *
          60 *
          60 *
          24,
      });
    }
  } catch (e) {
    console.log(e);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
