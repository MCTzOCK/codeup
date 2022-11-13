/**
 * packages/rest/src/api/Course.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.11.2022
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getSection(options: {
  course: string;
  section: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/course/" + options.course + "/" + options.section,
    method: "GET",
  });
}

export async function getCourse(options: {
  course: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/course/" + options.course,
    method: "GET",
  });
}
