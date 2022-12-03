/**
 * apps/web/src/pages/api/project-ideas.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.12.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import ProjectIdeaModel from "@codeup/util/src/models/ProjectIdeaModel";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const projectIdeas = await ProjectIdeaModel.find({});
    res.status(200).json({ ideas: projectIdeas });
  } else {
    res.status(404).json({ error: "Not Found" });
  }
};
