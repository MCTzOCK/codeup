/**
 * apps/web/src/pages/api/admin/contents/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.11.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import ContentModel from "@codeup/util/src/models/ContentModel";
import UserModel from "@codeup/util/src/models/UserModel";
import mongoConnect from "@codeup/util/src/mongo";
import { verify } from "jsonwebtoken";
import CourseModel from "@codeup/util/src/models/CourseModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const jwt = req.headers["x-jwt"];
    if (!verify(jwt as string, process.env.JWT_SECRET as string)) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = verify(
      jwt as string,
      process.env.JWT_SECRET as string
    ) as any;

    const adminuser = await UserModel.findOne({ username: decoded.username });

    if (adminuser.role !== "admin") {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    await mongoConnect();

    if (req.method === "GET") {
      if (req.body.id) {
        const content = await ContentModel.findById(req.query.id as string);

        if (!content) {
          res.status(404).json({
            error: "Not Found",
          });
          return;
        }

        res.status(200).json({
          content,
        });
        return;
      }

      if (req.body.search) {
        const contents = await ContentModel.find({
          $text: { $search: req.query.search as string },
        });

        if (!contents) {
          res.status(404).json({
            error: "Not Found",
          });
          return;
        }

        res.status(200).json({
          contents,
        });
        return;
      }

      if (req.body.type) {
        const contents = await ContentModel.find({
          type: req.query.type as string,
        });

        if (!contents) {
          res.status(404).json({
            error: "Not Found",
          });
          return;
        }

        res.status(200).json({
          contents,
        });
        return;
      }

      if (req.body.course) {
        const contents = await ContentModel.find({
          course: req.query.course as string,
        });

        if (!contents) {
          res.status(404).json({
            error: "Not Found",
          });
          return;
        }

        res.status(200).json({
          contents,
        });
        return;
      }

      const contents = await ContentModel.find({});
      res.status(200).json({
        contents,
        success: true,
      });
      return;
    }

    if (req.method === "POST") {
      const { displayName, course, url, type, textContent, quiz, videoUrl } =
        req.body;

      if (!displayName || !course || !url || !type || !textContent) {
        res.status(400).json({
          error: "Bad Request",
          success: false,
        });
        return;
      }

      if (!["VIDEO", "TEXT"].includes(type)) {
        res.status(400).json({
          error: "Bad Request",
          success: false,
        });
        return;
      }

      if (type === "VIDEO" && !videoUrl) {
        res.status(400).json({
          error: "Bad Request",
          success: false,
        });
        return;
      }

      const courseModel = await CourseModel.findById(course);

      if (!courseModel) {
        res.status(404).json({
          error: "Not Found",
          success: false,
        });
        return;
      }

      const content = await ContentModel.create({
        displayName,
        course,
        url,
        type,
        textContent,
        quiz,
        videoUrl: videoUrl ? videoUrl : undefined,
      });

      courseModel.contentPositions.push(content._id);

      await courseModel.save();

      res.status(200).json({
        content,
        success: true,
      });
    }

    if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        res.status(400).json({
          error: "Bad Request",
          success: false,
        });
        return;
      }

      const content = await ContentModel.findById(id);

      if (!content) {
        res.status(404).json({
          error: "Not Found",
          success: false,
        });
        return;
      }

      await content.remove();

      res.status(200).json({
        success: true,
      });
    }
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      success: false,
    });
  }
}
