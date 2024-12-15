/**
 * apps/web/src/pages/api/repos/[id]/wiki.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.12.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../global/server/isLoggedIn";
import RepositoryModel from "@codeup/util/dist/models/RepositoryModel";
import RepositoryWikiModel from "@codeup/util/dist/models/RepositoryWikiModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const { id } = req.query;

    const repo = await RepositoryModel.findById((id as string).toString());

    if (!repo) {
      res.status(404).json({
        status: 404,
        error: "Repository not found",
      });
      return;
    }

    let accessLevel = -1;

    if (repo.public) {
      accessLevel = 0;
    }

    if (repo.username === user.username) {
      accessLevel = 1;
    }

    if (accessLevel === -1) {
      res.status(403).json({
        status: 403,
        error: "You have no access to this repository",
      });
      return;
    }

    if (req.method === "GET") {
      if (req.query.wikiId) {
        const wiki = await RepositoryWikiModel.findById(
          req.query.wikiId.toString()
        );

        if (!wiki || wiki.repository.toString() !== repo._id.toString()) {
          res.status(404).json({
            status: 404,
            error: "Wiki not found",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          page: wiki,
        });
        return;
      }

      const wikis = await RepositoryWikiModel.find({ repository: repo._id });

      res.status(200).json({
        status: 200,
        pages: wikis,
      });
      return;
    } else if (req.method === "DELETE") {
      if (!req.query.wikiId) {
        res.status(400).json({
          status: 400,
          error: "No wikiId provided",
        });
        return;
      }

      const wiki = await RepositoryWikiModel.findById(
        req.query.wikiId.toString()
      );

      if (!wiki || wiki.repository.toString() !== repo._id.toString()) {
        res.status(404).json({
          status: 404,
          error: "Wiki not found",
        });
        return;
      }

      if (accessLevel < 1) {
        res.status(403).json({
          status: 403,
          error: "You have no access to delete this wiki",
        });
        return;
      }

      await wiki.deleteOne();

      res.status(200).json({
        status: 200,
        message: "Wiki deleted",
      });
      return;
    } else if (req.method === "POST") {
      if (accessLevel < 1) {
        res.status(403).json({
          status: 403,
          error: "You have no access to create a wiki",
        });
        return;
      }

      if (!req.body.title || !req.body.content) {
        res.status(400).json({
          status: 400,
          error: "Bad request",
        });
        return;
      }

      const wiki = new RepositoryWikiModel({
        repository: repo._id,
        title: req.body.title,
        content: req.body.content,
      });

      await wiki.save();

      res.status(200).json({
        status: 200,
        message: "Wiki created",
        wiki,
      });
      return;
    } else if (req.method === "PUT") {
      if (!req.query.wikiId) {
        res.status(400).json({
          status: 400,
          error: "No wikiId provided",
        });
        return;
      }

      const wiki = await RepositoryWikiModel.findById(
        req.query.wikiId.toString()
      );

      if (!wiki || wiki.repository.toString() !== repo._id.toString()) {
        res.status(404).json({
          status: 404,
          error: "Wiki not found",
        });
        return;
      }

      if (accessLevel < 1) {
        res.status(403).json({
          status: 403,
          error: "You have no access to update this wiki",
        });
        return;
      }

      if (!req.body.title || !req.body.content) {
        res.status(400).json({
          status: 400,
          error: "Bad request",
        });
        return;
      }

      wiki.title = req.body.title;
      wiki.content = req.body.content;

      await wiki.save();

      res.status(200).json({
        status: 200,
        message: "Wiki updated",
        wiki,
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
