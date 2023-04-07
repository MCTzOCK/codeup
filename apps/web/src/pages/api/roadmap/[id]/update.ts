/**
 * apps/web/src/pages/api/roadmap/[id]/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.04.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import jwt from "jsonwebtoken";
import RoadmapModel from "@codeup/util/dist/models/RoadmapModel";
import UserModel from "@codeup/util/dist/models/UserModel";
import ToDoProjectModel from "@codeup/util/dist/models/ToDoProjectModel";
import TodoListModel from "@codeup/util/dist/models/TodoListModel";
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";
import ProjectIdeaModel from "@codeup/util/dist/models/ProjectIdeaModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.headers["x-jwt"]) {
    res.status(401).send({
      error: "Not authenticated",
    });
    return;
  }

  const token = req.headers["x-jwt"] as string;

  if (!req.body || !req.body.update) {
    res.status(400).send({
      error: "Bad request",
    });
    return;
  }

  try {
    await mongoConnect();

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded) {
      res.status(401).send({
        error: "Not authenticated",
      });
      return;
    }

    const user = await UserModel.findById((decoded as any).id);

    if (!user) {
      res.status(401).send({
        error: "Not authenticated",
      });
      return;
    }

    const roadmap = await RoadmapModel.findById(req.query.id);

    if (!roadmap) {
      res.status(404).send({
        error: "Roadmap not found",
      });
      return;
    }

    if (roadmap.owner.toString() !== user._id.toString()) {
      res.status(403).send({
        error: "Not allowed",
      });
      return;
    }

    const update = req.body.update;

    if (update.linkedCourses) {
      roadmap.linkedCourses = update.linkedCourses;
    }

    if (update.linkedFlows) {
      for (const flow of update.linkedFlows) {
        if (!roadmap.linkedFlows.includes(flow)) {
          const flowX = await ToDoProjectModel.findById(flow);
          if (!flowX || flowX.owner.toString() !== user._id.toString()) {
            res.status(403).send({
              error: "Not allowed",
            });
            return;
          }

          roadmap.linkedFlows.push(flow);
        }
      }
    }

    if (update.linkedTodos) {
      for (const todo of update.linkedTodos) {
        if (!roadmap.linkedTodos.includes(todo)) {
          const todoX = await TodoListModel.findById(todo);
          if (!todoX || todoX.owner.toString() !== user._id.toString()) {
            res.status(403).send({
              error: "Not allowed",
            });
            return;
          }

          roadmap.linkedTodos.push(todo);
        }
      }
    }

    if (update.linkedProject) {
      const project = await EditorProjectModel.findById(update.linkedProject);
      if (!project || project.owner.toString() !== user._id.toString()) {
        res.status(403).send({
          error: "Not allowed",
        });
        return;
      }

      roadmap.linkedProject = update.linkedProject;
    }

    if (update.name) {
      roadmap.name = update.name;
    }

    if (update.projectIdea) {
      const idea = await ProjectIdeaModel.findById(update.projectIdea);
      if (!idea) {
        res.status(404).send({
          error: "Project idea not found",
        });
        return;
      }

      roadmap.projectIdea = update.projectIdea;
    }

    await roadmap.save();

    res.status(200).send({
      success: true,
      roadmap,
    });
  } catch (e: any) {
    res.status(500).send({
      error: e.message as string,
    });
    return;
  }
}
