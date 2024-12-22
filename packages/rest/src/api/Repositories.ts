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

export function getIssues(token: string, repoId: string): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/issues",
    method: "GET",
    token,
  });
}

export function getIssue(
  token: string,
  repoId: string,
  issueId: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/issues?issueId=" + issueId,
    method: "GET",
    token,
  });
}

export function createIssue(
  token: string,
  repoId: string,
  title: string,
  body: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/issues",
    method: "POST",
    token,
    body: {
      title,
      body,
    },
  });
}

export function deleteIssue(
  token: string,
  repoId: string,
  issueId: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/issues?issueId=" + issueId,
    method: "DELETE",
    token,
  });
}

export function updateIssue(
  token: string,
  repoId: string,
  issueId: string,
  body: string,
  title: string,
  status: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/issues?issueId=" + issueId,
    method: "PUT",
    token,
    body: {
      title,
      body,
      status,
    },
  });
}

export function getWikiPages(
  token: string,
  repoId: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/wiki",
    method: "GET",
    token,
  });
}

export function getWikiPage(
  token: string,
  repoId: string,
  wikiId: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/wiki?wikiId=" + wikiId,
    method: "GET",
    token,
  });
}

export function deleteWikiPage(
  token: string,
  repoId: string,
  wikiId: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/wiki?wikiId=" + wikiId,
    method: "DELETE",
    token,
  });
}

export function createWikiPage(
  token: string,
  repoId: string,
  title: string,
  content: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/wiki",
    method: "POST",
    token,
    body: {
      title,
      content,
    },
  });
}

export function updateWikiPage(
  token: string,
  repoId: string,
  wikiId: string,
  title: string,
  content: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/wiki?wikiId=" + wikiId,
    method: "PUT",
    token,
    body: {
      title,
      content,
    },
  });
}

export function getUMLDiagrams(
  token: string,
  repoId: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/uml",
    method: "GET",
    token,
  });
}

export function getUMLDiagram(
  token: string,
  repoId: string,
  umlId: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/uml?umlId=" + umlId,
    method: "GET",
    token,
  });
}

export function deleteUMLDiagram(
  token: string,
  repoId: string,
  umlId: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/uml?umlId=" + umlId,
    method: "DELETE",
    token,
  });
}

export function createUMLDiagram(
  token: string,
  repoId: string,
  name: string,
  type: string,
  data: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/uml",
    method: "POST",
    token,
    body: {
      name,
      type,
      data,
    },
  });
}

export function updateUMLDiagram(
  token: string,
  repoId: string,
  umlId: string,
  name: string,
  data: string
): Promise<IResponse> {
  return makeRequest({
    path: "/api/repos/" + repoId + "/uml?umlId=" + umlId,
    method: "PUT",
    token,
    body: {
      name,
      data,
    },
  });
}

export async function uploadS3Object(
  token: string,
  id: string,
  name: string,
  content: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/repos/${id}/static/upload`,
    token,
    body: {
      name,
      content,
    },
  });
}

export async function s3Objects(token: string, id: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: `/api/repos/${id}/static/files`,
    token,
  });
}

export async function deleteS3Object(
  token: string,
  id: string,
  fileName: string
): Promise<IResponse> {
  return await makeRequest({
    method: "DELETE",
    path: `/api/repos/${id}/static/files`,
    token,
    body: {
      file: fileName,
    },
  });
}

export async function deployRepo(
  token: string,
  id: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: "/api/repos/" + id + "/deploy",
    token,
  });
}

export async function deployStatus(
  token: string,
  id: string
): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/repos/" + id + "/deploy/status",
    token,
  });
}

export async function deployLogs(
  token: string,
  id: string
): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/repos/" + id + "/deploy/logs",
    token,
  });
}
