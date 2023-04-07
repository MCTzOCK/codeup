/**
 * packages/rest/src/api/Roadmap.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.04.2023
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getMyRoads(token: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/roadmap/my",
    token: token,
  });
}

export async function createRoad(options: {
  token: string;
  name: string;
}): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: "/api/roadmap/create",
    token: options.token,
    body: {
      name: options.name,
    },
  });
}

export async function deleteRoad(options: {
  token: string;
  id: string;
}): Promise<IResponse> {
  return await makeRequest({
    method: "DELETE",
    path: `/api/roadmap/${options.id}/delete`,
    token: options.token,
  });
}

export async function updateRoad(options: {
  token: string;
  id: string;
  update: {
    projectIdea?: string;
    linkedProject?: string;
    linkedCourses?: string[];
    linkedTodos?: string[];
    linkedFlows?: string[];
    name?: string;
  };
}): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/roadmap/${options.id}/update`,
    token: options.token,
    body: {
      update: options.update,
    },
  });
}

export async function getRoad(options: {
  token: string;
  id: string;
}): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: `/api/roadmap/${options.id}`,
    token: options.token,
  });
}
