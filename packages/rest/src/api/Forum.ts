/**
 * packages/rest/src/api/Forum.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2022
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function createProfile(options: {
  token: string;
  username: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/forum/" + options.username + "/profile",
    method: "POST",
    token: options.token,
  });
}

export async function getProfile(username: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/forum/" + username + "/profile",
    method: "GET",
  });
}

export async function modifyProfile(options: {
  token: string;
  username: string;
  update: {
    [key: string]: string;
  };
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/forum/" + options.username + "/profile",
    method: "POST",
    token: options.token,
    body: options.update,
  });
}

export async function deleteProfile(options: {
  token: string;
  username: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/forum/" + options.username + "/profile",
    method: "DELETE",
    token: options.token,
  });
}
