/**
 * packages/rest/src/api/Discovery.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.12.2022
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getDiscoveryProjects(): Promise<IResponse> {
  return await makeRequest({
    path: "/api/discovery",
    method: "GET",
  });
}
