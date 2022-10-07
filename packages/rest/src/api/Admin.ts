/**
 * packages/rest/src/api/Admin.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.22
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function listAccounts(token: string): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token,
    path: "/admin/account/list",
  });
}
