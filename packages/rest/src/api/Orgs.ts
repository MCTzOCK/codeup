/**
 * packages/rest/src/api/Orgs.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.03.23
 *
 */
import makeRequest from "../makeRequest";
import { IResponse } from "../types/IResponse";

export async function createOrg(options: {
  token: string;
  name: string;
  icon?: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: "/api/orgs/create",
    method: "POST",
    body: {
      name: options.name,
      icon: options.icon,
    },
  });
}

export async function getOrgs(token: string): Promise<IResponse> {
  return await makeRequest({
    token: token,
    path: "/api/orgs/my",
    method: "GET",
  });
}

export async function deleteOrg(options: {
  token: string;
  name: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: "/api/orgs/delete",
    method: "POST",
    body: {
      name: options.name,
    },
  });
}

export async function getOrg(options: {
  token: string;
  name: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: `/api/orgs/${options.name}`,
    method: "GET",
  });
}
