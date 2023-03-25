/**
 * apps/web/src/pages/api/discovery.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.12.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import IDEProjectModel from "@codeup/util/src/models/IDEProjectModel";
import UserModel from "@codeup/util/dist/models/UserModel";
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const projects = await EditorProjectModel.find({
      discovery: true,
    });

    let p: any[] = [];

    for (const project of projects) {
      const user = await UserModel.findById(project.owner);

      p.push({
        name: project.name,
        description: project.discoveryDescription,
        author: user.username,
        domain: project.customDomain,
        id: project._id,
      });
    }
    res.status(200).json({ projects: p });
  } else {
    res.status(404).json({ error: "Not Found" });
  }
};
