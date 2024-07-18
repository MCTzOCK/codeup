/**
 * apps/web/src/pages/api/account/dashboard.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.07.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import UserDashboardPreferencesModel from "@codeup/util/dist/models/UserDashboardPreferencesModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user, auth } = await isLoggedIn(req, res);

    if (req.method === "GET") {
      const dashboardConfig = await UserDashboardPreferencesModel.findOne({
        user: user._id,
      });

      if (dashboardConfig) {
        res.status(200).json({
          config: dashboardConfig,
        });
        return;
      }

      const dbC = await UserDashboardPreferencesModel.create({
        user: user._id,
      });

      res.status(200).json({
        config: dbC,
      });
      return;
    } else if (req.method === "POST") {
      const { sections } = req.body;

      if (!sections) {
        res.status(400).json({
          status: 400,
          error: "Missing sections",
        });
        return;
      }

      const validSections = [
        "codeup.courses",
        "codeup.certificates",
        "codeup.todos",
        "codeup.kids",
        "codeup.flows",
        "codeup.snippets",
        "codeup.projects",
      ];

      const invalidSections = sections.filter(
        (s: string) => !validSections.includes(s)
      );

      if (invalidSections.length > 0) {
        res.status(400).json({
          status: 400,
          error: "Invalid sections",
          invalidSections,
        });
        return;
      }

      const dashboardConfig = await UserDashboardPreferencesModel.findOne({
        user: user._id,
      });

      if (dashboardConfig) {
        dashboardConfig.sections = sections;
        await dashboardConfig.save();

        res.status(200).json({
          config: dashboardConfig,
        });
        return;
      }

      const dbC = await UserDashboardPreferencesModel.create({
        user: user._id,
        sections,
      });

      res.status(200).json({
        config: dbC,
      });
      return;
    }

    res.status(405).json({
      status: 405,
      error: "Method not allowed",
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
