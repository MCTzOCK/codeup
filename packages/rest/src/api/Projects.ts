/**
 * packages/rest/src/api/Projects.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.05.2024
 *
 */

import makeRequest from "../makeRequest";
import { IResponse } from "../types/IResponse";

export async function createProject(options: {
  token: string;
  name: string;
  projectType: string;
  modifiers: string[];
}): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: "/projects/create",
    token: options.token,
    body: {
      name: options.name,
      projectType: options.projectType,
      modifiers: options.modifiers,
    },
  });
}
