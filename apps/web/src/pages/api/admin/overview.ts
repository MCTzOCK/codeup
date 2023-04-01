/**
 * apps/web/src/pages/api/admin/overview.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.04.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import mongoConnect from "@codeup/util/dist/mongo";
import UserModel from "@codeup/util/dist/models/UserModel";
import OrgModel from "@codeup/util/dist/models/OrgModel";
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";
import EditorProjectPageModel from "@codeup/util/dist/models/EditorProjectPageModel";
import ForumProfileModel from "@codeup/util/dist/models/ForumProfileModel";
import ForumPostModel from "@codeup/util/dist/models/ForumPostModel";
import TodoListModel from "@codeup/util/dist/models/TodoListModel";
import ToDoProjectModel from "@codeup/util/dist/models/ToDoProjectModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.headers["x-jwt"]) {
    res.status(401).send({
      error: "Unauthorized",
    });
    return;
  }

  const token = req.headers["x-jwt"] as string;

  try {
    await mongoConnect();

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    const user = await UserModel.findById(decoded.id);

    if (!user || user.role !== "admin") {
      res.status(401).send({
        error: "Unauthorized",
      });
      return;
    }

    const stats = {
      users: {
        count: await UserModel.countDocuments(),
        admins: await UserModel.countDocuments({ role: "admin" }),
        editors: await UserModel.countDocuments({ role: "editor" }),
        newUsers: await UserModel.countDocuments({
          createdAt: {
            $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
          },
        }),
      },
      orgs: {
        count: await OrgModel.countDocuments(),
        newOrgs: await OrgModel.countDocuments({
          createdAt: {
            $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
          },
        }),
      },
      projects: {
        count: await EditorProjectModel.countDocuments(),
        newProjects: await EditorProjectModel.countDocuments({
          createdAt: {
            $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
          },
        }),
        projectPages: await EditorProjectPageModel.countDocuments(),
        publishedProjects: await EditorProjectModel.countDocuments({
          customDomain: {
            $not: /disabled:/,
          },
        }),
      },
      forum: {
        profiles: await ForumProfileModel.countDocuments(),
        newProfiles: await ForumProfileModel.countDocuments({
          createdAt: {
            $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
          },
        }),
        posts: await ForumPostModel.countDocuments(),
        newPosts: await ForumPostModel.countDocuments({
          createdAt: {
            $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
          },
        }),
      },
      todo: {
        count: await TodoListModel.countDocuments(),
        newTodos: await TodoListModel.countDocuments({
          createdAt: {
            $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
          },
        }),
      },
      flowCharts: {
        count: await ToDoProjectModel.countDocuments(),
        newFlowCharts: await ToDoProjectModel.countDocuments({
          createdAt: {
            $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
          },
        }),
      },
    };

    res.status(200).send(stats);
  } catch (e: any) {
    res.status(500).send({
      error: e.message,
    });
  }
}
