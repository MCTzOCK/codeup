/**
 * apps/web/src/pages/api/orgs/[name]/templates.ts
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

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    if (
      !req.headers["x-jwt"] ||
      !req.body ||
      !req.body.action ||
      !req.body.projectId
    ) {
      res.status(400).json({
        error: "Missing token",
      });
      return;
    }

    try {
      jwt.verify(
        req.headers["x-jwt"] as string,
        // @ts-ignore
        process.env.JWT_SECRET as string,
        async (err, decoded) => {
          if (err) {
            res.status(400).json({
              error: "Invalid token",
            });
            return;
          } else {
            await mongoConnect();
            const user = await UserModel.findOne({
              _id: (decoded as any).id as string,
            });

            if (!user) {
              res.status(400).json({
                error: "User not found",
              });
              return;
            }

            const name = req.query.name;

            try {
              let org = await OrgModel.findOne({
                name: name,
              });

              if (!org) {
                res.status(400).json({
                  success: false,
                  error: "Organisation not found",
                });
                return;
              }

              if (org.owner.toString() !== user._id.toString()) {
                res.status(400).json({
                  success: false,
                  error: "You are not the owner of this organisation",
                });
                return;
              }

              if (req.body.action === "ADD") {
                const project = await EditorProjectModel.findById(
                  req.body.projectId
                );

                if (
                  !project ||
                  project.owner.toString() !== user._id.toString()
                ) {
                  res.status(400).json({
                    success: false,
                    error: "Project not found",
                  });
                  return;
                }

                const currentOrgTemplate =
                  await OrgProjectTemplateModel.findOne({
                    org: org._id,
                    projectId: project._id,
                  });

                if (currentOrgTemplate) {
                  res.status(400).json({
                    success: false,
                    error: "Project is already a template",
                  });
                  return;
                }

                const template = await OrgProjectTemplateModel.create({
                  org: org._id,
                  projectId: project._id,
                  name: project.name,
                });

                res.status(200).json({
                  success: true,
                  template: template,
                });

                return;
              } else if (req.body.action === "REMOVE") {
                const template = await OrgProjectTemplateModel.findById(
                  req.body.projectId
                );

                if (
                  !template ||
                  template.org.toString() !== org._id.toString()
                ) {
                  res.status(400).json({
                    success: false,
                    error: "Template not found",
                  });
                  return;
                }

                await template.remove();

                res.status(200).json({
                  success: true,
                });
                return;
              }

              res.status(400).json({
                success: false,
                error: "Action must be type of ADD or REMOVE",
              });
            } catch (e: any) {
              res.status(400).json({
                success: false,
                error: e.message,
              });
            }
          }
        }
      );
    } catch (e) {
      res.status(500).json({
        error: "Invalid token",
      });
    }
  } else if (req.method === "GET") {
    if (!req.headers["x-jwt"]) {
      res.status(400).json({
        error: "Missing token",
      });
      return;
    }

    try {
      await mongoConnect();

      const decoded = jwt.verify(
        req.headers["x-jwt"] as string,
        // @ts-ignore
        process.env.JWT_SECRET as string
      );

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

      const org = await OrgModel.findOne({
        name: req.query.name,
      });

      if (!org) {
        res.status(400).json({
          error: "Organisation not found",
        });
        return;
      }

      if (!org.members.includes(user._id) && !org.owner === user._id) {
        res.status(400).json({
          error: "Organisation not found",
        });
        return;
      }

      const templates = await OrgProjectTemplateModel.find({
        org: org._id,
      });

      res.status(200).json({
        success: true,
        templates: templates,
      });
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
