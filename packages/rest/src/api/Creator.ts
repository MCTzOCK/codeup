/**
 * packages/rest/src/api/Creator.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.11.2022
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getCourses(token: string): Promise<IResponse> {
  return makeRequest({
    path: "/api/creator/course",
    method: "GET",
    token,
  });
}
