/**
 * apps/web/src/pages/api/projects/[id]/uml/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.06.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import { isLoggedIn } from "../../../../../global/server/isLoggedIn";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import ProjectUMLModel from "@codeup/util/dist/models/ProjectUMLModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await mongoConnect();

    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const project = await ProjectModel.findById(req.query.id);

    if (!project) {
      res.status(404).json({
        status: 404,
        error: "Project not found",
      });
      return;
    }

    if (!project.users.includes(user._id)) {
      res.status(403).json({
        status: 400,
        error: "You are not allowed to view this project",
      });
      return;
    }

    if (req.method === "GET") {
      if (req.query.umlId) {
        const uml = await ProjectUMLModel.findById(req.query.umlId as string);

        if (uml.project.toString() !== project._id.toString()) {
          res.status(403).json({
            status: 403,
            error: "You are not allowed to view this UML",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          uml,
        });
        return;
      }

      const umls = await ProjectUMLModel.find({ project: project._id });

      res.status(200).json({
        status: 200,
        umls,
      });
      return;
    } else if (req.method === "POST") {
      if (req.query.umlId) {
        const uml = await ProjectUMLModel.findById(req.query.umlId as string);

        if (uml.project.toString() !== project._id.toString()) {
          res.status(403).json({
            status: 403,
            error: "You are not allowed to view this UML",
          });
          return;
        }

        const { umlData } = req.body;

        uml.data = umlData;

        await uml.save();

        res.status(200).json({
          status: 200,
          uml: uml,
        });
        return;
      }

      const { name, data, type } = req.body;

      const uml = await ProjectUMLModel.create({
        project: project._id,
        name,
        data,
        type,
      });

      res.status(200).json({
        status: 200,
        uml,
      });
      return;
    } else if (req.method === "DELETE") {
      const uml = await ProjectUMLModel.findById(req.query.umlId as string);

      if (uml.project.toString() !== project._id.toString()) {
        res.status(403).json({
          status: 403,
          error: "You are not allowed to delete this UML",
        });
        return;
      }

      await uml.delete();

      res.status(200).json({
        status: 200,
        uml,
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
