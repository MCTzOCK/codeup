/**
 * packages/rest/src/api/Payments.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.06.2023
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function createCheckoutLink(jwt: string): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: "/api/payments/createCheckoutSession",
    token: jwt,
  });
}

export async function cancelSubscription(jwt: string): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: "/api/payments/cancelSubscription",
    token: jwt,
  });
}
