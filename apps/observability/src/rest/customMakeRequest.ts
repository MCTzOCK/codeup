/**
 * apps/observability/src/rest/customMakeRequest.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.10.2024
 *
 */
import { IResponse } from "@codeup/rest/dist/types/IResponse";

const basePath = "/api";

export interface ICustomMakeRequestOptions {
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
}

export default async function customMakeRequest(
  options: ICustomMakeRequestOptions
): Promise<IResponse> {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers.Authorization = options.token;
  }

  if (options.headers) {
    Object.keys(options.headers).forEach((customHeader) => {
      // @ts-ignore
      headers[customHeader] = options.headers[customHeader];
    });
  }

  const res = await fetch(basePath + options.path, {
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
