/**
 * apps/web/src/pages/api/ask/profiles/[username].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.06.23
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import UserModel from "@codeup/util/dist/models/UserModel";
import AskProfileModel from "@codeup/util/dist/models/AskProfileModel";
import { verify } from "jsonwebtoken";
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";
import ObtainedCertificateModel from "@codeup/util/dist/models/ObtainedCertificateModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!["GET", "POST"].includes(req.method as string)) {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  try {
    await mongoConnect();

    if (req.method === "GET") {
      const username = req.query.username as string;

      const profile = await getProfileByUsername(username);

      if (!profile) {
        res.status(404).json({
          error: "Profile not found",
        });
        return;
      }

      res.status(200).json({
        profile,
      });
    } else if (req.method === "POST") {
      const username = req.query.username as string;

      const profile = await getProfileByUsername(username);

      if (!profile) {
        res.status(404).json({
          error: "Profile not found",
        });
        return;
      }

      const token = req.headers["x-jwt"] as string;

      if (!token) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      const decoded = verify(token, process.env.JWT_SECRET as string) as any;

      if (!decoded) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      const user = await UserModel.findOne({
        username: decoded.username,
      });

      if (!user) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      if (user.username !== profile.username) {
        res.status(401).json({
          error: "Unauthorized",
        });
        return;
      }

      const { update } = req.body;

      if (!update) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const updatableKeys = [
        "banner",
        "website",
        "bio",
        "certificates",
        "projects",
      ];

      for (const key of updatableKeys) {
        if (update[key]) {
          if (["banner", "website"].includes(key)) {
            if (key === "website" && update[key] === "codeup.remove()") {
              profile[key] = "";
              continue;
            }

            if (update[key].match(/(https?:\/\/[^\s]+)/g)) {
              profile[key] = update[key];
            } else {
              res.status(400).json({
                error: "Banner or Website is not a valid URL",
              });
              return;
            }
          } else if (key === "bio") {
            if (update[key] === "codeup.remove()") {
              profile[key] = "";
              continue;
            }

            if (update[key].length > 0 && update[key].length < 200) {
              profile[key] = update[key];
            } else {
              res.status(400).json({
                error: "Bio is too long",
              });
              return;
            }
          } else if (key === "projects") {
            const projects = update[key] as any[];
            for (const p of projects) {
              const project = await EditorProjectModel.findById(p);
              if (!project || !user._id.equals(project.owner)) {
                res.status(400).json({
                  error: "Project not found",
                });
                return;
              }
            }

            profile[key] = projects;
          } else if (key === "certificates") {
            const certificates = update[key] as any[];

            for (const c of certificates) {
              const certificate = await ObtainedCertificateModel.findById(c);
              if (!certificate || user.username !== certificate.username) {
                res.status(400).json({
                  error: "Certificate not found",
                });
                return;
              }
            }

            profile[key] = certificates;
          }
        }
      }

      await profile.save();

      res.status(200).json({
        profile,
      });
    }
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
}

const getProfileByUsername = async (
  username: string
): Promise<typeof AskProfileModel | any | null> => {
  const user = await UserModel.findOne({
    username,
  });

  if (!user) {
    return null;
  }

  let profile = await AskProfileModel.findOne({
    user: user._id,
  });

  if (!profile) {
    profile = await AskProfileModel.create({
      user: user._id,
      username: username,
      banner: "/_static/images/software-developer-6521720_1920.jpgw",
      badges: [],
      website: "",
      bio: "",
      certificates: [],
      projects: [],
    });
  }

  return profile;
};
