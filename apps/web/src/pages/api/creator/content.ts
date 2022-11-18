/**
 * apps/web/src/pages/api/creator/content.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.11.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "@codeup/util/src/models/UserModel";
import ContentModel from "@codeup/util/src/models/ContentModel";
import CourseModel from "@codeup/util/src/models/CourseModel";
import mongoConnect from "@codeup/util/src/mongo";
import { verify } from "jsonwebtoken";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (["POST", "GET", "DELETE", "PATCH"].includes(req.method as string)) {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  const token = req.headers["x-jwt"];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    if (!verify(token as string, process.env.JWT_SECRET as string)) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    const decoded = verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as any;

    await mongoConnect();

    const editorUser = await UserModel.findOne({ username: decoded.username });

    if (!editorUser) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    if (!["editor", "admin"].includes(editorUser.role)) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    if (req.method === "GET") {
      if (req.query.course) {
        const contents = await ContentModel.find({
          creator: editorUser.username,
          course: req.query.course,
        });

        res.status(200).json({
          contents,
        });
      } else {
        const contents = await ContentModel.find({
          creator: editorUser.username,
        });

        res.status(200).json({
          contents,
        });
      }
    } else if (req.method === "POST") {
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

      if (courseModel.creator !== editorUser.username) {
        res.status(401).json({
          error: "Unauthorized",
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
    } else if (req.method === "DELETE") {
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

      if (content.creator !== editorUser.username) {
        res.status(401).json({
          error: "Unauthorized",
          success: false,
        });
        return;
      }

      await content.remove();

      res.status(200).json({
        success: true,
      });
    } else if (req.method === "PATCH") {
      const { id, update } = req.body;

      if (!id || !update) {
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

      if (content.creator !== editorUser.username) {
        res.status(401).json({
          error: "Unauthorized",
          success: false,
        });
        return;
      }

      for (const key in update) {
        content[key] = update[key];
      }

      await content.save();

      res.status(200).json({
        success: true,
        content,
      });
    }
  } catch (e) {
    // @ts-ignore
    if (e.message) {
      // @ts-ignore
      res.status(500).json({ error: e.message });
    } else {
      res
        .status(500)
        .json({ error: "Internal Server Error with no specific message" });
    }
  }
}
