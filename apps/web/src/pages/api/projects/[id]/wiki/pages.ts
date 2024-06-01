/**
 * apps/web/src/pages/api/projects/[id]/wiki/pages.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.05.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import { isLoggedIn } from "../../../../../global/server/isLoggedIn";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import ProjectWikiPageModel from "@codeup/util/dist/models/ProjectWikiPageModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await mongoConnect();

    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const project = await ProjectModel.findById(req.query.id as string);

    if (!project) {
      res.status(404).json({
        status: 404,
        error: "Project not found",
      });
      return;
    }

    if (!project.users.includes(user._id.toString())) {
      res.status(403).json({
        status: 403,
        error: "You are not allowed to view this project",
      });
      return;
    }

    if (req.method === "GET") {
      if (req.query.pageId) {
        const page = await ProjectWikiPageModel.findById(
          req.query.pageId as string
        );
        if (!page) {
          res.status(404).json({
            status: 404,
            error: "Page not found",
          });
          return;
        }

        if (page.project.toString() !== project._id.toString()) {
          res.status(403).json({
            status: 403,
            error: "You are not allowed to view this page",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          page,
        });
        return;
      }

      const pages = await ProjectWikiPageModel.find({ project: project._id });

      res.status(200).json({
        status: 200,
        pages,
      });
    } else if (req.method === "POST") {
      const { title, content } = req.body;

      if (!title || !content) {
        res.status(400).json({
          status: 400,
          error: "Invalid Request",
        });
        return;
      }

      if (req.body.page_id) {
        const page = await ProjectWikiPageModel.findById(
          req.body.page_id as string
        );

        if (!page) {
          res.status(404).json({
            status: 404,
            error: "Page not found",
          });
          return;
        }

        if (page.project.toString() !== project._id.toString()) {
          res.status(403).json({
            status: 403,
            error: "You are not allowed to edit this page",
          });
          return;
        }

        page.title = title;
        page.content = content;

        await page.save();

        res.status(200).json({
          status: 200,
          page,
        });
        return;
      }

      const page = await ProjectWikiPageModel.create({
        project: project._id,
        title,
        content,
      });

      res.status(200).json({
        status: 200,
        page,
      });
    } else if (req.method === "DELETE") {
      const { page_id } = req.body;

      if (!page_id) {
        res.status(400).json({
          status: 400,
          error: "Invalid Request",
        });
        return;
      }

      const page = await ProjectWikiPageModel.findById(page_id);

      if (!page) {
        res.status(404).json({
          status: 404,
          error: "Page not found",
        });
        return;
      }

      if (page.project.toString() !== project._id.toString()) {
        res.status(403).json({
          status: 403,
          error: "You are not allowed to delete this page",
        });
        return;
      }

      await page.remove();

      res.status(200).json({
        status: 200,
      });
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
