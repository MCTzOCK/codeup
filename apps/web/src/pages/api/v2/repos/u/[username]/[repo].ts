/**
 * apps/web/src/pages/api/v2/repos/u/[username]/[repo].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.11.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../../../../global/server/isLoggedIn";
import RepositoryModel from "@codeup/util/src/models/RepositoryModel";
import fs from "fs";
import path from "path";
import Logger from "../../../../../../server/logger";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const { username, repo } = req.query;

    if (!username || !repo) {
      res.status(400).json({
        status: 400,
        error: "Missing required fields",
      });
      return;
    }

    if (req.method === "GET") {
      const onlyPublic = user.username !== username;
      const ft: any = {
        username: username,
        name: repo,
      };

      if (onlyPublic) {
        ft.public = true;
      }

      const repository = await RepositoryModel.findOne(ft);

      if (!repository) {
        res.status(404).json({
          status: 404,
          error: "Repository not found",
        });
        return;
      }

      res.status(200).json({
        status: 200,
        data: repository,
      });
    } else {
      const repository = await RepositoryModel.findOne({
        username: user.username,
        name: repo,
      });

      if (!repository) {
        res.status(404).json({
          status: 404,
          error: "Repository not found",
        });
        return;
      }

      if (req.method === "POST") {
        const { description, isPublic, deploymentType, deploymentName } =
          req.body;

        if (!description || !isPublic || !deploymentType || !deploymentName) {
          res.status(400).json({
            status: 400,
            error: "Missing required fields",
          });
          return;
        }

        repository.description = description;
        repository.public = isPublic;
        repository.deploymentType = deploymentType;
        repository.deploymentName = deploymentName;
        await repository.save();

        res.status(200).json({
          status: 200,
          data: repository,
        });
      } else if (req.method === "DELETE") {
        await repository.delete();

        Logger.info(
          `Deleting repository ${repository.name} from ${user.username}`,
          Logger.GIT
        );

        fs.rmdirSync(
          path.join(
            process.env.GIT_SERVER_HOME as string,
            user.username,
            repository.name
          ),
          {
            recursive: true,
          }
        );

        res.status(200).json({
          status: 200,
        });
      } else {
        res.status(405).json({
          status: 405,
          error: "Method not allowed",
        });
      }
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
