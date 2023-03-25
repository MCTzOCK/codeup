/**
 * apps/web/src/pages/api/creator/certificates.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.11.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";

import {
  CertificateBuilder,
  MultipleChoiceBuilder,
} from "@codeup/util/src/certificates/CertificateBuilder";

import CertificateModel from "@codeup/util/src/models/Certificate";
import CourseModel from "@codeup/util/src/models/CourseModel";
import UserModel from "@codeup/util/src/models/UserModel";
import mongoConnect from "@codeup/util/src/mongo";
import { verify } from "jsonwebtoken";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!["POST", "GET", "DELETE", "PATCH"].includes(req.method as string)) {
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

    /* -- REMOVE CREATOR LOCK -- */

    /*
    if (!["editor", "admin"].includes(editorUser.role)) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }
    */

    if (req.method === "GET") {
      const { courseId } = req.query;

      if (!courseId) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        res.status(404).json({
          error: "Not Found",
        });
        return;
      }

      const certificate = await CertificateModel.findOne({ course: courseId });

      if (!certificate) {
        res.status(404).json({
          error: "Not Found",
        });
        return;
      }

      res.status(200).json({ certificate });
    } else if (req.method === "POST") {
      if (req.body.create) {
        const { courseId } = req.body;

        if (!courseId) {
          res.status(400).json({
            error: "Bad Request",
          });
          return;
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
          res.status(404).json({
            error: "Not Found",
          });
          return;
        }

        const exisiting = await CertificateModel.findOne({
          course: courseId,
        });

        if (exisiting) {
          res.status(200).json({ certificate: exisiting });
          return;
        }

        const cert = await CertificateModel.create({
          course: courseId,
          minPercentage: 75,
          steps: [],
        });

        res.status(200).json({ certificate: cert });

        return;
      }

      const { courseId, update } = req.body;

      if (!courseId || !update) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        res.status(404).json({
          error: "Not Found",
        });
        return;
      }

      const certificate = await CertificateModel.findOne({ course: courseId });

      if (!certificate) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      if (update.minPercentage) {
        if (update.minPercentage < 0 || update.minPercentage > 100) {
          res.status(400).json({
            error: "Bad Request",
          });
          return;
        }
        certificate.minPercentage = update.minPercentage;
      }

      if (update.steps) {
        certificate.steps = update.steps;
      }

      await certificate.save();

      res.status(200).json({ certificate });
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
