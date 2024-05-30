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
    path: "/api/projects/create",
    token: options.token,
    body: {
      name: options.name,
      projectType: options.projectType,
      modifiers: options.modifiers,
    },
  });
}

export async function myProjects(token: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/projects/my",
    token,
  });
}

export async function project(token: string, id: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: `/api/projects/${id}`,
    token,
  });
}

export async function files(token: string, id: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: `/api/projects/${id}/static/files`,
    token,
  });
}

export async function deleteFile(
  token: string,
  id: string,
  fileName: string
): Promise<IResponse> {
  return await makeRequest({
    method: "DELETE",
    path: `/api/projects/${id}/static/files`,
    token,
    body: {
      file: fileName,
    },
  });
}

export async function uploadFile(
  token: string,
  id: string,
  name: string,
  content: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/projects/${id}/static/upload`,
    token,
    body: {
      name,
      content,
    },
  });
}
