/**
 * apps/web/src/pages/api/admin/analytics/views.ts
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

    const data: number[] = [];

    const defaultPeriod = {
      start: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };
    let period = defaultPeriod;

    if (req.query.periodStart && req.query.periodEnd) {
      period = {
        start: req.query.periodStart as string,
        end: req.query.periodEnd as string,
      };
    }

    console.log(new Date(period.start));

    const analytics = await AnalyticsModel.find({
      createdAt: {
        $gte: new Date(period.start),
        $lte: new Date(period.end),
      },
    });

    const days = Math.round(
      (new Date(period.end).getTime() - new Date(period.start).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    for (let i = 0; i < days; i++) {
      data.push(0);

      analytics.forEach((a) => {
        if (
          new Date(a.createdAt).getDate() ===
            new Date(
              new Date(period.start).getTime() + i * 24 * 60 * 60 * 1000
            ).getDate() &&
          new Date(a.createdAt).getMonth() ===
            new Date(
              new Date(period.start).getTime() + i * 24 * 60 * 60 * 1000
            ).getMonth() &&
          new Date(a.createdAt).getFullYear() ===
            new Date(
              new Date(period.start).getTime() + i * 24 * 60 * 60 * 1000
            ).getFullYear()
        ) {
          data[i]++;
        }
      });
    }

    res.status(200).json({ data });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
