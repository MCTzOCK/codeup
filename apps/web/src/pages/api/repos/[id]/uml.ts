/**
 * apps/web/src/pages/api/repos/[id]/uml.ts
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
import RepositoryUMLModel from "@codeup/util/dist/models/RepositoryUMLModel";

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
      if (req.query.umlId) {
        const uml = await RepositoryUMLModel.findById(
          req.query.umlId.toString()
        );
        if (uml.repository.toString() !== repo._id.toString()) {
          res.status(404).json({
            status: 404,
            error: "UML not found",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          diagram: uml,
        });
        return;
      }

      const umls = await RepositoryUMLModel.find({ repository: repo._id });

      res.status(200).json({
        status: 200,
        diagrams: umls,
      });

      return;
    } else if (req.method === "DELETE") {
      if (!req.query.umlId) {
        res.status(400).json({
          status: 400,
          error: "UML ID is required",
        });
        return;
      }

      if (accessLevel < 1) {
        res.status(403).json({
          status: 403,
          error: "You have no access to delete this diagram",
        });
        return;
      }

      const uml = await RepositoryUMLModel.findById(req.query.umlId.toString());

      if (uml.repository.toString() !== repo._id.toString()) {
        res.status(404).json({
          status: 404,
          error: "UML not found",
        });
        return;
      }

      await uml.deleteOne();

      res.status(200).json({
        status: 200,
        message: "UML deleted",
      });
      return;
    } else if (req.method === "POST") {
      const { name, type, data } = req.body;

      if (!name || !type || !data) {
        res.status(400).json({
          status: 400,
          error: "Bad request",
        });
        return;
      }

      if (accessLevel < 1) {
        res.status(403).json({
          status: 403,
          error: "You have no access to create a diagram",
        });
        return;
      }

      const uml = new RepositoryUMLModel({
        repository: repo._id,
        name,
        type,
        data,
      });

      await uml.save();

      res.status(200).json({
        status: 200,
        message: "UML created",
        uml,
      });

      return;
    } else if (req.method === "PUT") {
      if (!req.query.umlId) {
        res.status(400).json({
          status: 400,
          error: "UML ID is required",
        });
        return;
      }

      const { name, data } = req.body;

      if (!name || !data) {
        res.status(400).json({
          status: 400,
          error: "Bad request",
        });
        return;
      }

      if (accessLevel < 1) {
        res.status(403).json({
          status: 403,
          error: "You have no access to update a diagram",
        });
        return;
      }

      const uml = await RepositoryUMLModel.findById(req.query.umlId.toString());

      if (uml.repository.toString() !== repo._id.toString()) {
        res.status(404).json({
          status: 404,
          error: "UML not found",
        });
        return;
      }

      uml.name = name;
      uml.data = data;

      await uml.save();

      res.status(200).json({
        status: 200,
        message: "UML updated",
        uml,
      });

      return;
    }

    res.status(400).json({
      status: 400,
      error: "Bad request",
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
