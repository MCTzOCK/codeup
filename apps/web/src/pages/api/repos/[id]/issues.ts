/**
 * apps/web/src/pages/api/repo/[id]/issues.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.12.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../global/server/isLoggedIn";
import RepositoryModel from "@codeup/util/dist/models/RepositoryModel";
import RepositoryIssueModel from "@codeup/util/dist/models/RepositoryIssueModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user, auth } = await isLoggedIn(req, res);

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
      if (req.query.issueId) {
        const issue = await RepositoryIssueModel.findById(
          req.query.issueId.toString()
        );
        if (!issue || issue.repository.toString() !== repo._id.toString()) {
          res.status(404).json({
            status: 404,
            error: "Issue not found",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          issue,
        });
        return;
      }

      const issues = await RepositoryIssueModel.find({
        repository: repo._id,
      });

      res.status(200).json({
        status: 200,
        issues,
      });
      return;
    } else if (req.method === "DELETE") {
      if (!req.query.issueId) {
        res.status(400).json({
          status: 400,
          error: "Bad request",
        });
        return;
      }

      const issue = await RepositoryIssueModel.findById(
        req.query.issueId.toString()
      );
      if (
        !issue ||
        issue.repository.toString() !== repo._id.toString() ||
        accessLevel < 1
      ) {
        res.status(404).json({
          status: 404,
          error: "Issue not found",
        });
        return;
      }

      await issue.deleteOne();

      res.status(200).json({
        status: 200,
        message: "Issue deleted",
      });
      return;
    } else if (req.method === "POST") {
      if (accessLevel < 1) {
        res.status(403).json({
          status: 403,
          error: "You have no access to this repository",
        });
        return;
      }

      const { title, body } = req.body;

      if (!title || !body) {
        res.status(400).json({
          status: 400,
          error: "Bad request",
        });
        return;
      }

      const issue = await RepositoryIssueModel.create({
        repository: repo._id,
        title,
        body,
        user: user._id,
        username: user.username,
      });

      await issue.save();

      res.status(200).json({
        status: 200,
        issue,
      });
      return;
    } else if (req.method === "PUT") {
      if (accessLevel < 1) {
        res.status(403).json({
          status: 403,
          error: "You have no access to this repository",
        });
        return;
      }

      if (!req.query.issueId) {
        res.status(400).json({
          status: 400,
          error: "Bad request",
        });
        return;
      }

      const issue = await RepositoryIssueModel.findById(
        req.query.issueId.toString()
      );
      if (!issue || issue.repository.toString() !== repo._id.toString()) {
        res.status(404).json({
          status: 404,
          error: "Issue not found",
        });
        return;
      }

      const { title, body, status } = req.body;

      if (!title || !body || !status) {
        res.status(400).json({
          status: 400,
          error: "Bad request",
        });
        return;
      }

      issue.title = title;
      issue.body = body;
      issue.status = status;

      await issue.save();

      res.status(200).json({
        status: 200,
        issue,
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
