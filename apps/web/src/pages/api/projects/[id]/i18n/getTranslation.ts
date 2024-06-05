/**
 * apps/web/src/pages/api/projects/[id]/i18n/getTranslation.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import ProjectI18nModel from "@codeup/util/dist/models/ProjectI18nModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await mongoConnect();

    const project = await ProjectModel.findById(req.query.id);

    if (!project) {
      res.status(404).json({
        status: 404,
        error: "Project not found",
      });
      return;
    }

    const i18n = await ProjectI18nModel.findOne({ project: project._id });

    if (!i18n) {
      res.status(404).json({
        status: 404,
        error: "No i18n found for this project",
      });
      return;
    }
    const { key, language } = req.query;

    if (!key || !language) {
      res.status(400).json({
        status: 400,
        error: "You need to provide a key and a language",
      });
      return;
    }

    if (!i18n.translations[language as string]) {
      res.status(200).json({
        status: 200,
        translation: "codeup.i18n.languageNotFound",
      });
      return;
    }

    if (!i18n.translations[language as string][key as string]) {
      res.status(200).json({
        status: 200,
        translation: key,
      });
      return;
    }

    res.status(200).json({
      status: 200,
      translation: i18n.translations[language as string][key as string],
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      translation: "codeup.i18n.error",
      error: e.message,
    });
  }
}
