/**
 * apps/web/src/pages/api/orgs/[name]/use-template.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.03.2023
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import OrgModel from "@codeup/util/src/models/OrgModel";
import OrgProjectTemplateModel from "@codeup/util/src/models/OrgProjectTemplateModel";
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";
import EditorProjectPageModel from "@codeup/util/dist/models/EditorProjectPageModel";
import EditorProjectFunctionModel from "@codeup/util/dist/models/EditorProjectFunctionModel";
import { v4 } from "uuid";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    if (!req.headers["x-jwt"]) {
      res.status(400).json({
        error: "Missing token",
      });
      return;
    }

    if (!req.query.templateId || !req.query.newProjectName) {
      res.status(400).json({
        error: "Missing templateId or newProjectName",
      });
      return;
    }

    const templateId = req.query.templateId as string;
    const newProjectName = req.query.newProjectName as string;

    try {
      await mongoConnect();

      jwt.verify(
        req.headers["x-jwt"] as string,
        // @ts-ignore
        process.env.JWT_SECRET as string,
        async (err, decoded) => {
          if (!decoded) {
            res.status(400).json({
              error: "Invalid token",
            });
            return;
          }

          const user = await UserModel.findOne({
            _id: (decoded as any).id as string,
          });

          if (!user) {
            res.status(400).json({
              error: "User not found",
            });
            return;
          }

          const template = await OrgProjectTemplateModel.findOne({
            _id: templateId,
          });

          if (!template) {
            res.status(400).json({
              error: "Template not found",
            });
            return;
          }

          const org = await OrgModel.findOne({
            _id: template.org,
          });

          if (!org) {
            res.status(400).json({
              error: "Org not found",
            });
            return;
          }

          if (
            !org.members.includes(user._id) &&
            org.owner.toString() !== user._id.toString()
          ) {
            res.status(400).json({
              error: "User is not a member of the org",
            });
            return;
          }

          const newProject = await EditorProjectModel.create({
            name: newProjectName,
            owner: user._id,
            customDomain: "disabled:" + v4(),
          });

          const pages = await EditorProjectPageModel.find({
            project: template.projectId,
          });

          for (const page of pages) {
            await EditorProjectPageModel.create({
              project: newProject._id,
              type: page.type,
              mainContent: page.mainContent,
              resources: page.resources,
              url: page.url,
            });
          }

          const functions = await EditorProjectFunctionModel.find({
            project: template.projectId,
          });

          for (const func of functions) {
            await EditorProjectFunctionModel.create({
              path: func.path,
              code: func.code,
              project: newProject._id,
            });
          }

          res.status(200).json({
            success: true,
            project: newProject,
          });
        }
      );
    } catch (e) {
      res.status(500).json({
        error: "Invalid token",
      });
    }
  } else {
    res.status(405).json({
      error: "Method not allowed",
    });
  }
}
