/**
 * apps/web/src/pages/api/developer/apps.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import OAuthApp from "@codeup/util/src/models/OAuthApp";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);
    if (!auth) return;

    if (req.method === "GET") {
      if (req.query.id) {
        const app = await OAuthApp.findOne({
          _id: req.query.id,
        });

        if (!app) {
          res.status(404).json({
            status: 404,
            error: "App not found",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          app,
        });
      } else {
        const apps = await OAuthApp.find({
          user: user._id,
        });

        res.status(200).json({
          status: 200,
          apps,
        });
      }
    } else if (req.method === "DELETE") {
      if (!req.query.id) {
        res.status(400).json({
          status: 400,
          error: "No ID provided",
        });
        return;
      }

      const app = await OAuthApp.findOne({
        _id: req.query.id,
        user: user._id,
      });

      if (!app) {
        res.status(404).json({
          status: 404,
          error: "App not found",
        });
        return;
      }
      await app.remove();

      res.status(200).json({
        status: 200,
        message: "App deleted",
      });
    } else if (req.method === "POST") {
      const { name, description, redirectUris } = req.body;
      if (!name || !description || !redirectUris) {
        res.status(400).json({
          status: 400,
          error: "Missing parameters",
        });
        return;
      }

      const app = new OAuthApp({
        user: user._id,
        name,
        description,
        redirectUris,
      });

      await app.save();

      res.status(200).json({
        status: 200,
        app,
      });
    } else if (req.method === "PUT") {
      if (!req.query.id) {
        res.status(400).json({
          status: 400,
          error: "No ID provided",
        });
        return;
      }

      const app = await OAuthApp.findOne({
        _id: req.query.id,
        user: user._id,
      });

      if (!app) {
        res.status(404).json({
          status: 404,
          error: "App not found",
        });
        return;
      }

      const { name, description, redirectUris } = req.body;

      if (name) app.name = name;
      if (description) app.description = description;
      if (redirectUris) app.redirectUris = redirectUris;

      await app.save();

      res.status(200).json({
        status: 200,
        app,
      });
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
