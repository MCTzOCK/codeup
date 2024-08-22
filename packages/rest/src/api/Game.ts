/**
 * packages/rest/src/api/api/game.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.08.2024
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function myLevels(token: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/game/levels/my",
    token,
  });
}

export async function createLevel(
  token: string,
  name: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: "/api/game/levels/create",
    token,
    body: {
      name,
    },
  });
}

export async function updateLevel(
  token: string,
  id: string,
  name: string,
  content: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/game/levels/update?id=${id}`,
    token,
    body: {
      name,
      content,
    },
  });
}

export async function deleteLevel(
  token: string,
  id: string
): Promise<IResponse> {
  return await makeRequest({
    method: "DELETE",
    path: `/api/game/levels/delete?id=${id}`,
    token,
  });
}
