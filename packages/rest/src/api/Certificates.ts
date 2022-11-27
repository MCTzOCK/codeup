/**
 * packages/rest/src/api/Certificates.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.11.2022
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getCertificate(
  course: string,
  onlyLookup: boolean = false
): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    path: `/api/course/${course}/certificate?onlyLookup=${onlyLookup}`,
  });
}
