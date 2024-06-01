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

export async function wikiPages(
  token: string,
  id: string,
  page_id?: string
): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path:
      `/api/projects/${id}/wiki/pages` + (page_id ? `?pageId=${page_id}` : ""),
    token,
  });
}

export async function createWikiPage(
  token: string,
  id: string,
  title: string,
  content: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/projects/${id}/wiki/pages`,
    token,
    body: {
      title,
      content,
    },
  });
}

export async function updateWikiPage(
  token: string,
  id: string,
  page_id: string,
  title: string,
  content: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/projects/${id}/wiki/pages`,
    token,
    body: {
      title,
      content,
      page_id,
    },
  });
}

export async function deleteWikiPage(
  token: string,
  id: string,
  page_id: string
): Promise<IResponse> {
  return await makeRequest({
    method: "DELETE",
    path: `/api/projects/${id}/wiki/pages`,
    token,
    body: {
      page_id,
    },
  });
}

export async function getIssues(
  token: string,
  id: string,
  issueId?: string
): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: `/api/projects/${id}/issues` + (issueId ? `?issueId=${issueId}` : ""),
    token,
  });
}

export async function createIssue(
  token: string,
  id: string,
  title: string,
  description: string,
  priority: string,
  status: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/projects/${id}/issues`,
    token,
    body: {
      title,
      description,
      priority,
      status,
    },
  });
}

export async function updateIssue(
  token: string,
  id: string,
  issueId: string,
  title: string,
  description: string,
  priority: string,
  status: string
): Promise<IResponse> {
  return await makeRequest({
    method: "PUT",
    path: `/api/projects/${id}/issues?issueId=${issueId}`,
    token,
    body: {
      title,
      description,
      priority,
      status,
    },
  });
}

export async function deleteIssue(
  token: string,
  id: string,
  issueId: string
): Promise<IResponse> {
  return await makeRequest({
    method: "DELETE",
    path: `/api/projects/${id}/issues?issueId=${issueId}`,
    token,
  });
}

export async function getFlows(
  token: string,
  id: string,
  flowId?: string
): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: `/api/projects/${id}/flows` + (flowId ? `?flowId=${flowId}` : ""),
    token,
  });
}

export async function createFlow(
  token: string,
  id: string,
  name: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/projects/${id}/flows`,
    token,
    body: {
      name,
    },
  });
}

export async function updateFlow(
  token: string,
  id: string,
  flowId: string,
  name: string,
  saved: string
): Promise<IResponse> {
  return await makeRequest({
    method: "PUT",
    path: `/api/projects/${id}/flows?flowId=${flowId}`,
    token,
    body: {
      name,
      saved,
    },
  });
}

export async function deleteFlow(
  token: string,
  id: string,
  flowId: string
): Promise<IResponse> {
  return await makeRequest({
    method: "DELETE",
    path: `/api/projects/${id}/flows?flowId=${flowId}`,
    token,
  });
}
