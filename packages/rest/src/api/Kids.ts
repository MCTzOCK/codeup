/**
 * packages/rest/src/api/Kids.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.04.2023
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getProjects(token: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/kids/projects",
    token,
  });
}

export async function createProject(options: {
  token: string;
  name: string;
  code?: string;
}): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: "/api/kids/projects",
    token: options.token,
    body: {
      name: options.name,
      code: options.code,
    },
  });
}

export async function deleteProject(options: {
  token: string;
  id: string;
}): Promise<IResponse> {
  return await makeRequest({
    method: "DELETE",
    path: `/api/kids/projects`,
    token: options.token,
    body: {
      id: options.id,
    },
  });
}

export async function updateProject(options: {
  token: string;
  id: string;
  name?: string;
  code?: string;
}): Promise<IResponse> {
  return await makeRequest({
    method: "PUT",
    path: `/api/kids/projects`,
    token: options.token,
    body: {
      id: options.id,
      update: {
        name: options.name,
        code: options.code,
      },
    },
  });
}

export async function getProject(options: {
  token: string;
  id: string;
}): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: `/api/kids/projects?id=${options.id}`,
    token: options.token,
  });
}
