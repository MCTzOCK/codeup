/**
 * packages/rest/src/api/AI.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.07.2024
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getAIQuota(token: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ai/quota",
    method: "GET",
    token,
  });
}

export async function getAIChats(token: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ai/chats",
    method: "GET",
    token,
  });
}

export async function deleteAIChat(
  token: string,
  id: string
): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ai/chats?id=" + id,
    method: "DELETE",
    token,
  });
}

export async function createCompletion(opts: {
  token: string;
  message: string;
  id?: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ai/chats",
    method: "POST",
    token: opts.token,
    body: {
      message: opts.message,
      id: opts.id,
    },
  });
}
