/**
 * apps/web/src/pages/api/todo/projects/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.12.2022
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import ToDoProjectModel from "@codeup/util/src/models/ToDoProjectModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!["GET", "POST", "DELETE"].includes(req.method as string)) {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  if (!req.headers["x-jwt"]) {
    res.status(400).json({
      error: "Missing Auth-Header (x-jwt)",
    });
    return;
  }
  try {
    jwt.verify(
      req.headers["x-jwt"] as string,
      process.env.JWT_SECRET as string,
      async (err: VerifyErrors | null, decoded: JwtPayload | string | any) => {
        if (err) {
          res.status(400).json({
            error: "Invalid token",
          });
          return;
        }

        await mongoConnect();

        const user = await UserModel.findById((decoded as any).id);

        if (!user) {
          res.status(400).json({
            error: "Invalid token",
          });
          return;
        }

        if (req.method === "GET") {
          const ret = [];

          if (req.query.id) {
            const project = await ToDoProjectModel.findById(req.query.id);

            if (project.owner.toString() !== user._id.toString()) {
              res.status(400).json({
                error: "Invalid token",
              });
              return;
            }

            ret.push(project);
          } else {
            const projects = await ToDoProjectModel.find({
              owner: user._id,
            });

            ret.push(...projects);
          }

          res.status(200).json({
            projects: ret,
          });
        } else if (req.method === "POST") {
          if (!req.query.id) {
            if (!req.query.name) {
              res.status(400).json({
                error: "Missing id",
              });

              return;
            }

            const newProject = await ToDoProjectModel.create({
              owner: user._id,
              name: req.query.name,
              saved: "",
            });

            res.status(200).json({
              project: newProject,
            });

            return;
          }

          const project = await ToDoProjectModel.findById(req.query.id);

          if (project) {
            if (project.owner.toString() !== user._id.toString()) {
              res.status(400).json({
                error: "Invalid token",
              });
              return;
            }

            if (!req.body.saved) {
              res.status(400).json({
                error: "Bad Request",
              });
              return;
            }

            project.saved = req.body.saved;

            await project.save();

            res.status(200).json({
              project: project,
            });
          } else {
            res.status(400).json({
              error: "Invalid token",
            });
          }
        } else if (req.method === "DELETE") {
          if (!req.query.id) {
            res.status(400).json({
              error: "Missing id",
            });
            return;
          }

          const project = await ToDoProjectModel.findById(req.query.id);

          if (project.owner.toString() !== user._id.toString()) {
            res.status(400).json({
              error: "Invalid token",
            });
            return;
          }

          await project.remove();

          res.status(200).json({
            success: true,
          });
        }
      }
    );
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
    });
    return;
  }
}
