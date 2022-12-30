/**
 * packages/rest/src/api/Snippets.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.12.2022
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getSnippets(token: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/snippets",
    token,
  });
}

export async function getSnippet(options: {
  token: string;
  id: string;
}): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/snippets?id=" + options.id,
    token: options.token,
  });
}

export async function createSnippet(options: {
  token: string;
  title: string;
  code: string;
  language: string;
}): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: "/api/snippets",
    token: options.token,
    body: {
      title: options.title,
      code: options.code,
      language: options.language,
    },
  });
}

export async function deleteSnippet(options: {
  token: string;
  id: string;
}): Promise<IResponse> {
  return await makeRequest({
    method: "DELETE",
    path: "/api/snippets?id=" + options.id,
    token: options.token,
  });
}
