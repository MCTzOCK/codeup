/**
 * packages/rest/src/api/Repositories.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.11.2024
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getRepositories(
  username: string,
  token: string
): Promise<IResponse> {
  return await makeRequest({
    path: "/api/v2/repos/u/" + username,
    method: "GET",
    token,
  });
}

export async function getRepository(
  username: string,
  repo: string,
  token: string
): Promise<IResponse> {
  return await makeRequest({
    path: "/api/v2/repos/u/" + username + "/" + repo,
    method: "GET",
    token,
  });
}

export function createRepository(
  token: string,
  options: {
    name: string;
    description: string;
    isPublic: boolean;
    deploymentType: string;
    deploymentName: string;
    templateURL: string;
  }
): Promise<IResponse> {
  return makeRequest({
    path: "/api/v2/repos/create",
    method: "POST",
    token,
    body: options,
  });
}

export function updateRepository(
  token: string,
  username: string,
  repo: string,
  options: {
    description: string;
    isPublic: boolean;
    deploymentType: string;
    deploymentName: string;
  }
): Promise<IResponse> {
  return makeRequest({
    path: "/api/v2/repos/u/" + username + "/" + repo,
    method: "POST",
    token,
    body: options,
  });
}

export function deleteRepository(
  token: string,
  username: string,
  repo: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/v2/repos/u/" + username + "/" + repo,
    method: "DELETE",
    token,
  });
}
