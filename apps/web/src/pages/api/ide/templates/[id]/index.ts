/**
 * apps/web/src/pages/api/ide/templates/[id]/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.2022
 *
 */
import IDETemplateModel from "@codeup/util/src/models/IDETemplateModel";
import mongoConnect from "@codeup/util/src/mongo";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({
      error: "Method not allowed",
    });
    return;
  }

  try {
    await mongoConnect();

    const tpl = await IDETemplateModel.findById(req.query.id);

    if (!tpl) {
      res.status(404).json({
        error: "Could not find template " + req.query.id,
      });
      return;
    }

    res.status(200).json({
      success: true,
      template: tpl,
    });
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
}
