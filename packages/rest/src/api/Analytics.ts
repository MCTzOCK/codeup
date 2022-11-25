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

export async function getSummary(token: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/admin/analytics/summary",
    token,
  });
}

export async function getViews(options: {
  token: string;
  periodStart?: string;
  periodEnd?: string;
}): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path:
      "/api/admin/analytics/views" +
      (options.periodStart && options.periodEnd
        ? `?periodStart=${options.periodStart}&periodEnd=${options.periodEnd}`
        : ""),
    token: options.token,
  });
}
