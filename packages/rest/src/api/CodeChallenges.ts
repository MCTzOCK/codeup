/**
 * packages/rest/src/api/CodeChallenges.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
 *
 */

import makeRequest from "../makeRequest";
import { IResponse } from "../types/IResponse";

export async function getChallenges(
  token: string,
  id?: string
): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/challenges" + (id ? `?id=${id}` : ""),
    token,
  });
}

export async function getCompletedChallenges(
  token: string
): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/challenges/completed",
    token,
  });
}
