/**
 * packages/rest/src/api/Blog.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.12.2022
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getBlogs(): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/blog",
  });
}

export async function getBlog(id: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: `/api/blog/${id}`,
  });
}
