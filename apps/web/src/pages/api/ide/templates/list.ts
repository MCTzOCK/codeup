/**
 * apps/web/src/pages/api/ide/templates/all.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.2022
 *
 */
import IDETemplateModel from "@codeup/util/src/models/IDETemplateModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const t = await IDETemplateModel.find({});

  console.log(123);

  res.status(200).json({
    success: true,
    templates: t,
  });
}
