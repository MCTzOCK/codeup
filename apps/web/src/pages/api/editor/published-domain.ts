/**
 * apps/web/src/pages/api/editor/published-domain.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.07.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";
import UserModel from "@codeup/util/dist/models/UserModel";
import jwt from "jsonwebtoken";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.id) {
    res.status(400).json({ error: "No id given", success: false });
    return;
  }

  try {
    await mongoConnect();

    const project = await EditorProjectModel.findById(req.query.id as string);

    if (!project || project.customDomain.startsWith("disabled:")) {
      res.status(404).json({ error: "Not found", success: false });
      return;
    }

    res.status(200).json({
      success: true,
      project: {
        name: project.name,
        domain: project.customDomain,
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message, success: false });
  }
}
