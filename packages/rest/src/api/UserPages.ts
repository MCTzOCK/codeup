/**
 * packages/rest/src/api/UserPages.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.11.2024
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getUserPage(
  username: string,
  token: string
): Promise<IResponse> {
  return await makeRequest({
    path: "/api/v2/pages/" + username,
    method: "GET",
    token,
  });
}

export async function updateUserPage(
  username: string,
  token: string,
  payload: {
    displayName: string;
    links: string[];
    readme: string;
  }
): Promise<IResponse> {
  return await makeRequest({
    path: "/api/v2/pages/" + username,
    method: "POST",
    token,
    body: payload,
  });
}
