/**
 * apps/observability/src/pages/api/applications.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.10.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { hasSession } from "@/server/hasSession";
import ApplicationModel from "@/models/ApplicationModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await hasSession(req, res);

    if (!auth || !user) return;

    if (req.method === "GET") {
      if (req.query.id) {
        const app = await ApplicationModel.findOne({
          _id: req.query.id,
        });

        if (!app) {
          res.status(404).json({
            status: 404,
            error: "Application not found",
          });
        } else {
          res.status(200).json({
            status: 200,
            data: app,
          });
        }
      } else if (req.query.filter) {
        const apps = await ApplicationModel.find({
          username: user.username,
          name: { $regex: req.query.filter as string, $options: "i" },
        });

        res.status(200).json({
          status: 200,
          data: apps,
        });
      } else {
        const apps = await ApplicationModel.find({
          username: user.username,
        });

        res.status(200).json({
          status: 200,
          data: apps,
        });
      }
    } else if (req.method === "POST") {
      const { name, url, logo } = req.body;
      const app = new ApplicationModel({
        username: user.username,
        name,
        url,
        logo,
      });

      await app.save();

      res.status(200).json({
        status: 200,
        data: app,
      });
    } else if (req.method === "PUT") {
      const { name, url, logo } = req.body;
      const app = await ApplicationModel.findOne({
        _id: req.query.id,
        username: user.username,
      });

      if (!app) {
        res.status(404).json({
          status: 404,
          error: "Application not found",
        });
        return;
      }

      app.name = name || app.name;
      app.url = url || app.url;
      app.logo = logo || app.logo;

      await app.save();

      res.status(200).json({
        status: 200,
        data: app,
      });
    } else if (req.method === "DELETE") {
      const app = await ApplicationModel.findOne({
        _id: req.query.id,
        username: user.username,
      });

      if (!app) {
        res.status(404).json({
          status: 404,
          error: "Application not found",
        });
        return;
      }

      await app.deleteOne();

      res.status(200).json({
        status: 200,
      });
    } else {
      res.status(405).json({
        status: 405,
        error: "Method not allowed",
      });
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
