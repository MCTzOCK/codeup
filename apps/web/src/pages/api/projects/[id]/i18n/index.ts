/**
 * apps/web/src/pages/api/projects/[id]/i18n/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.06.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import { isLoggedIn } from "../../../../../global/server/isLoggedIn";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import ProjectI18nModel from "@codeup/util/dist/models/ProjectI18nModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await mongoConnect();

    const { auth, user } = await isLoggedIn(req, res);

    if (!auth) return;

    const project = await ProjectModel.findById(req.query.id);

    if (!project) {
      res.status(404).json({
        status: 404,
        error: "Project not found",
      });
      return;
    }

    if (!project.users.includes(user._id)) {
      res.status(403).json({
        status: 400,
        error: "You are not allowed to view this project",
      });
      return;
    }

    if (req.method === "GET") {
      let i18n = await ProjectI18nModel.findOne({ project: project._id });

      if (!i18n) {
        i18n = await ProjectI18nModel.create({
          project: project._id,
          defaultLanguage: "de",
          languages: ["de", "en"],
          translations: {
            de: {
              "product.name": project.name,
            },
          },
        });
      }

      res.status(200).json({
        status: 200,
        i18n,
      });
      return;
    } else if (req.method === "POST") {
      const i18n = await ProjectI18nModel.findOne({ project: project._id });

      if (!i18n) {
        res.status(404).json({
          status: 404,
          error: "I18n not found",
        });
        return;
      }

      const { action } = req.body;

      if (action === "addLanguage") {
        const { language } = req.body;

        if (i18n.languages.includes(language)) {
          res.status(400).json({
            status: 400,
            error: "Language already exists",
          });
          return;
        }

        i18n.languages.push(language);

        await i18n.save();

        res.status(200).json({
          status: 200,
          i18n,
        });
      } else if (action === "removeLanguage") {
        const { language } = req.body;

        if (!i18n.languages.includes(language)) {
          res.status(400).json({
            status: 400,
            error: "Language not found",
          });
          return;
        }

        if (i18n.languages.length === 1) {
          res.status(400).json({
            status: 400,
            error: "You can't remove the last language",
          });
          return;
        }

        i18n.languages = i18n.languages.filter((l: string) => l !== language);

        if (i18n.defaultLanguage === language) {
          i18n.defaultLanguage = i18n.languages[0];
        }

        await i18n.save();

        res.status(200).json({
          status: 200,
          i18n,
        });
      } else if (action === "setDefaultLanguage") {
        const { language } = req.body;

        if (!i18n.languages.includes(language)) {
          i18n.languages.push(language);
        }

        i18n.defaultLanguage = language;

        await i18n.save();

        res.status(200).json({
          status: 200,
          i18n,
        });
      } else if (action === "setKey") {
        const { key, value, language } = req.body;

        if (!i18n.languages.includes(language)) {
          res.status(400).json({
            status: 400,
            error: "Language not found",
          });
          return;
        }

        if (!i18n.translations[language]) {
          i18n.translations[language] = {};
        }

        i18n.translations[language][key] = value;

        await i18n.markModified("translations");
        await i18n.save();

        res.status(200).json({
          status: 200,
          i18n,
        });
      } else if (action === "deleteKey") {
        const { key, language } = req.body;

        if (!i18n.languages.includes(language)) {
          res.status(400).json({
            status: 400,
            error: "Language not found",
          });
          return;
        }

        if (!i18n.translations[language]) {
          res.status(400).json({
            status: 400,
            error: "Key not found",
          });
          return;
        }

        delete i18n.translations[language][key];

        await i18n.markModified("translations");
        await i18n.save();

        res.status(200).json({
          status: 200,
          i18n,
        });
      }

      return;
    } else {
      res.status(405).json({
        status: 405,
        error: "Method not allowed",
      });
      return;
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
