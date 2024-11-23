/**
 * apps/web/src/pages/api/v2/pages/[username].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.11.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../global/server/isLoggedIn";
import UserPageModel from "@codeup/util/dist/models/UserPageModel";
import UserModel from "@codeup/util/dist/models/UserModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const { username } = req.query;

    if (req.method === "GET") {
      let userPage = await UserPageModel.findOne({
        user: username,
      });

      if (!userPage) {
        const usr = await UserModel.findOne({
          username: username,
        });

        if (!usr || !usr.active) {
          res.status(404).json({
            status: 404,
            error: "User not found",
          });
          return;
        }

        userPage = await UserPageModel.create({
          username: username,
          displayName: usr.firstName + " " + usr.lastName,
          links: [],
          readme:
            "# " +
            usr.firstName +
            " " +
            usr.lastName +
            "\n\nDas ist das Profil von @" +
            usr.username +
            ".",
        });
      }

      res.status(200).json({
        status: 200,
        data: userPage,
      });
    } else if (req.method === "POST") {
      if (username !== user.username) {
        res.status(403).json({
          status: 403,
          error: "Forbidden",
        });
        return;
      }

      const { displayName, links, readme } = req.body;

      let userPage = await UserPageModel.findOne({
        username: username,
      });

      if (!userPage) {
        userPage = await UserPageModel.create({
          username: username,
          displayName: displayName,
          links: links,
          readme: readme,
        });
      }

      userPage.displayName = displayName;
      userPage.links = links;
      userPage.readme = readme;

      await userPage.save();

      res.status(200).json({
        status: 200,
        data: userPage,
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
