/**
 * apps/web/src/pages/api/course/[course]/certificate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.11.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import CourseModel from "@codeup/util/src/models/CourseModel";
import Certificate from "@codeup/util/src/models/Certificate";
import UserModel from "@codeup/util/src/models/UserModel";
import ObtainedCertificateModel from "@codeup/util/src/models/ObtainedCertificateModel";
import { verify } from "jsonwebtoken";
import puppeteer from "puppeteer";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { course } = req.query;

  try {
    await mongoConnect();

    const token = req.headers["x-jwt"];

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

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

    const user = await UserModel.findOne({ username: decoded.username });

    if (!user) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    let courseObject = await CourseModel.findById(course);

    if (!courseObject) {
      courseObject = await CourseModel.findOne({
        friendlyName: course,
      });
    }

    if (!courseObject) {
      res.status(404).json({
        error: "Course not found",
      });
    }

    let certificate = await Certificate.findOne({
      course: courseObject._id,
    });

    if (!certificate) {
      res.status(404).json({
        error: "Certificate not found",
      });
      return;
    }

    if (req.method === "GET") {
      if (req.query.onlyLookup && req.query.onlyLookup === "true") {
        res.status(200).json({
          certificate: certificate._id,
        });
        return;
      }

      let certificateObject = certificate.toObject();

      for (const step of certificateObject.steps) {
        if (step.step_type === "MULTIPLE_CHOICE") {
          for (const answer of step.multiple_choice.answers) {
            delete answer.correct;
          }
        } else if (step.step_type === "TEXT") {
          for (const a of step.text_parts) {
            if (a.type === "INPUT") {
              delete a.value;
            }
          }
        } else if (step.step_type === "CODE_CHECK") {
          delete step.code_check.correct;
        } else if (step.step_type === "CODE_COMPARE") {
          delete step.code_compare.code_a.correct;
          delete step.code_compare.code_b.correct;
        }
      }

      delete certificateObject._id;
      delete certificateObject.__v;
      delete certificateObject.minPercentage;

      res.status(200).json({ certificate: certificateObject });
    } else if (req.method === "POST") {
      const { answers } = req.body;

      if (!answers) {
        res.status(400).json({
          error: "Bad Request",
        });
        return;
      }

      let correct = 0;
      let total = 0;

      for (const step of certificate.steps) {
        const index = certificate.steps.indexOf(step);

        const answer = answers.find((a: any) => a.step === index);

        if (!answer) {
          res.status(400).json({
            error: "Bad Request",
          });
          return;
        }

        if (step.step_type === "MULTIPLE_CHOICE") {
          total++;
          const selectedAnswerIndex = answer.answer;

          if (step.multiple_choice.answers[selectedAnswerIndex].correct) {
            correct++;
          }
        } else if (step.step_type === "TEXT") {
          for (const textPart of step.text_parts) {
            if (textPart.type === "INPUT") {
              total++;
              if (textPart.value === answer[textPart.id]) {
                correct++;
              }
            }
          }
        } else if (step.step_type === "CODE_CHECK") {
          total++;
          if (step.code_check.correct && answer.answer === true) {
            correct++;
          }
        } else if (step.step_type === "CODE_COMPARE") {
          total++;
          if (step.code_compare.code_a.correct && answer.answer === 0) {
            correct++;
          } else if (step.code_compare.code_b.correct && answer.answer === 1) {
            correct++;
          }
        }
      }

      const percentage = (correct / total) * 100;

      const alreadyObtained = await ObtainedCertificateModel.findOne({
        username: user.username,
      });

      if (percentage >= certificate.minPercentage) {
        let cert_id = "";

        if (alreadyObtained) {
          alreadyObtained.date = new Date();
          alreadyObtained.percentage = percentage;
          await alreadyObtained.save();

          cert_id = alreadyObtained._id;
        } else {
          const obtainedCertificate = await ObtainedCertificateModel.create({
            username: user.username,
            course: courseObject._id,
            name: user.firstName + " " + user.lastName,
            date: new Date(),
            percentage: percentage,
          });

          cert_id = obtainedCertificate._id;
        }

        res.status(200).json({
          success: true,
          obtainedCertificate: true,
          obtainedCertificateId: cert_id,
        });
      } else {
        res.status(200).json({
          success: true,
          obtainedCertificate: false,
          percentage,
        });
      }
    } else {
      res.status(405).json({
        error: "Method not allowed",
      });
    }
  } catch (e) {
    console.log(e);
    // @ts-ignore
    if (e.message) {
      // @ts-ignore
      res.status(500).json({ error: "Internal Server Error: " + e.message });
    } else {
      res.status(500).json({ error: "Unknown internal server error" });
    }
  }
}
