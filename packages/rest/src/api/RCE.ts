/**
 * packages/rest/src/api/RCE.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function rceJavaScript(
  code: string,
  token: string
): Promise<IResponse> {
  return await makeRequest({
    path: "/api/rce/javascript",
    method: "POST",
    token: token,
    body: {
      code: code,
    },
    returnsRaw: true,
  });
}

export async function rceTypeScript(
  code: string,
  token: string
): Promise<IResponse> {
  return await makeRequest({
    path: "/api/rce/typescript",
    method: "POST",
    token: token,
    body: {
      code: code,
    },
    returnsRaw: true,
  });
}

export async function rcePython(
  code: string,
  token: string
): Promise<IResponse> {
  return await makeRequest({
    path: "/api/rce/python",
    method: "POST",
    token: token,
    body: {
      code: code,
    },
    returnsRaw: true,
  });
}

export async function rceJava(code: string, token: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/rce/java",
    method: "POST",
    token: token,
    body: {
      code: code,
    },
    returnsRaw: true,
  });
}

export async function rceGo(code: string, token: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/rce/go",
    method: "POST",
    token: token,
    body: {
      code: code,
    },
    returnsRaw: true,
  });
}
