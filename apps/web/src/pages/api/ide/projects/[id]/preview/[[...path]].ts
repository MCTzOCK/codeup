/**
 * apps/web/src/pages/api/ide/projects/[id]/preview/[[...path]].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.07.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/src/mongo";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserModel from "@codeup/util/src/models/UserModel";
import IDEProjectModel from "@codeup/util/src/models/IDEProjectModel";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const path = (req.query.path as string[])?.join("/") || "index.html";

  res.end("Pathname: " + path);
}
