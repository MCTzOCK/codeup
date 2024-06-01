/**
 * apps/web/src/pages/api/projects/[id]/issues/index.ts
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
import ProjectIssueModel from "@codeup/util/dist/models/ProjectIssueModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await mongoConnect();

    const { auth, user } = await isLoggedIn(req, res);

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
      if (req.query.issueId) {
        const issue = await ProjectIssueModel.findById(
          req.query.issueId as string
        );

        if (!issue) {
          res.status(404).json({
            status: 404,
            error: "Issue not found",
          });
          return;
        }

        if (issue.project.toString() !== project._id.toString()) {
          res.status(403).json({
            status: 403,
            error: "You are not allowed to view this issue",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          issue,
        });

        return;
      }

      const issues = await ProjectIssueModel.find({
        project: project._id,
      });

      res.status(200).json({
        status: 200,
        issues,
      });
      return;
    } else if (req.method === "POST") {
      const { title, description, priority, status } = req.body;

      if (!title || !description || !priority || !status) {
        res.status(400).json({
          status: 400,
          error: "Missing required fields",
        });
        return;
      }

      const newIssue = await ProjectIssueModel.create({
        title,
        description,
        priority,
        status,
        project: project._id,
      });

      await newIssue.save();

      res.status(200).json({
        status: 200,
        issue: newIssue,
      });
      return;
    } else if (req.method === "PUT") {
      const { title, description, priority, status } = req.body;

      if (!title || !description || !priority || !status) {
        res.status(400).json({
          status: 400,
          error: "Missing required fields",
        });
        return;
      }

      const issue = await ProjectIssueModel.findById(
        req.query.issueId as string
      );

      if (!issue) {
        res.status(404).json({
          status: 404,
          error: "Issue not found",
        });
        return;
      }

      if (issue.project.toString() !== project._id.toString()) {
        res.status(403).json({
          status: 403,
          error: "You are not allowed to edit this issue",
        });
        return;
      }

      issue.title = title;
      issue.description = description;
      issue.priority = priority;
      issue.status = status;

      await issue.save();

      res.status(200).json({
        status: 200,
        issue,
      });
      return;
    } else if (req.method === "DELETE") {
      const issue = await ProjectIssueModel.findById(
        req.query.issueId as string
      );

      if (!issue) {
        res.status(404).json({
          status: 404,
          error: "Issue not found",
        });
        return;
      }

      if (issue.project.toString() !== project._id.toString()) {
        res.status(403).json({
          status: 403,
          error: "You are not allowed to delete this issue",
        });
        return;
      }

      await issue.remove();

      res.status(200).json({
        status: 200,
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
