/**
 * packages/rest/src/api/Editor.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.03.2023
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getProjects(token: string): Promise<IResponse> {
  return await makeRequest({
    token: token,
    path: "/api/editor/projects",
    method: "GET",
  });
}

export async function getDomainById(id: string): Promise<IResponse> {
  return await makeRequest({
    path: `/api/editor/published-domain?id=${id}`,
    method: "GET",
  });
}
