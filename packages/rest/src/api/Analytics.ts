/**
 * packages/rest/src/api/Analytics.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.11.2022
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function postAnalytics(options: {
  token?: string;
}): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: "/api/analytics",
    token: options.token,
  });
}
