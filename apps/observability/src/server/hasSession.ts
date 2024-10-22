/**
 * apps/observability/src/server/hasSession.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.10.2024
 *
 */
import { NextApiRequest, NextApiResponse } from "next";
import REST from "@codeup/rest/dist";
import { RESTAPI } from "@codeup/rest/dist/makeRequest";
RESTAPI.path_prefix = "https://codeup.space";

export const hasSession = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{
  auth: boolean;
  user?: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    subscription: "PRO" | "FREE";
  };
}> => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(403).json({
      status: 403,
      error: "Unauthorized",
    });
    return {
      auth: false,
    };
  }

  const ires = await REST.Account.verify(token);

  const hasAuth = ires.status === 200;

  if (!hasAuth) {
    res.status(403).json({
      status: 403,
      error: "Unauthorized",
    });
    return {
      auth: false,
    };
  }

  return {
    auth: hasAuth,
    user: ires.payload.data,
  };
};
