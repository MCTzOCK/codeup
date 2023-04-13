/**
 * packages/rest/src/api/Newsletter.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.04.2023
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export function subscribe(token: string): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    path: "/api/newsletter/subscribe",
    token,
  });
}

export function unsubscribe(token: string): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    path: "/api/newsletter/unsubscribe",
    token,
  });
}

export function subscribed(token: string): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    path: "/api/newsletter/subscribed",
    token,
  });
}
