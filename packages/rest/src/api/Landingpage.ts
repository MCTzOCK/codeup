/**
 * packages/rest/src/api/Landingpage.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.04.2023
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getTestimonials(): Promise<IResponse> {
  return await makeRequest({
    path: "/api/testimonials",
    method: "GET",
  });
}
