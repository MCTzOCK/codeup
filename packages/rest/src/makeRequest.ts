/**
 * packages/rest/src/makeRequest.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.07.2022
 *
 */
import { IResponse } from "./types/IResponse";

export default async function makeRequest(options: {
  path: string;
  body?: object;
  token?: string;
  headers?: object;
  returnsRaw?: boolean;
  method:
    | "GET"
    | "POST"
    | "DELETE"
    | "PUT"
    | "HEAD"
    | "PATCH"
    | "OPTIONS"
    | "CONNECT"
    | "TRACE";
}): Promise<IResponse> {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    "X-Executed-By": "@codeup/rest:makeRequest",
  };

  if (options.token) {
    headers["X-JWT"] = options.token;
  }

  if (options.headers) {
    Object.keys(options.headers).forEach((customHeader) => {
      // @ts-ignore
      headers[customHeader] = options.headers[customHeader];
    });
  }

  const res = await fetch(options.path, {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : null,
  });

  let payload = null;

  if (!options.returnsRaw) {
    payload = await res.json();
  } else {
    payload = await res.text();
  }

  return {
    status: res.status,
    payload: payload,
  };
}
