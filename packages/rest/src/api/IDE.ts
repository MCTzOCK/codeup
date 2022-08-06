/**
 * packages/rest/src/api/IDE.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.07.2022
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getProjectPermissions(options: {
  token: string;
  projectId: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/" + options.projectId + "/permissions",
    token: options.token,
    method: "GET",
  });
}

export async function saveFile(options: {
  token: string;
  projectId: string;
  path: string;
  content: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/" + options.projectId + "/file/save",
    method: "POST",
    token: options.token,
    body: {
      path: options.path,
      content: options.content,
    },
  });
}

export async function deleteFile(options: {
  token: string;
  projectId: string;
  path: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/" + options.projectId + "/file/delete",
    method: "POST",
    token: options.token,
    body: {
      path: options.path,
    },
  });
}

export async function getProject(options: {
  projectId: string;
  token: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/" + options.projectId,
    method: "GET",
    token: options.token,
  });
}

export async function addContributor(options: {
  projectId: string;
  email: string;
  token: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/contributors/add",
    method: "POST",
    token: options.token,
    body: {
      project: options.projectId,
      contributor: options.email,
    },
  });
}

export async function removeContributor(options: {
  projectId: string;
  email: string;
  token: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/contributors/remove",
    method: "POST",
    token: options.token,
    body: {
      project: options.projectId,
      contributor: options.email,
    },
  });
}

export async function getContributors(options: {
  token: string;
  projectId: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/contributors/list",
    method: "POST",
    token: options.token,
    body: {
      project: options.projectId,
    },
  });
}

export async function overwriteContributorPermissions(options: {
  token: string;
  projectId: string;
  contributorEmail: string;
  permissions: [
    "READ",
    "WRITE" | null,
    "DELETE" | null,
    "DUPLICATE" | null,
    "RENAME" | null,
    "EXPORT" | null,
    "MANAGE-CONTRIBUTORS" | null
  ];
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/contributors/permissions",
    method: "POST",
    token: options.token,
    body: {
      project: options.projectId,
      contributor: options.contributorEmail,
      permissions: options.permissions,
    },
  });
}

export async function renameProject(options: {
  token: string;
  projectId: string;
  newName: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/update/name",
    method: "POST",
    token: options.token,
    body: {
      id: options.projectId,
      name: options.newName,
    },
  });
}

export async function createProject(options: {
  token: string;
  name: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/create",
    method: "POST",
    token: options.token,
    body: {
      name: options.name,
    },
  });
}

export async function deleteProject(options: {
  token: string;
  projectId: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/delete",
    method: "POST",
    token: options.token,
    body: {
      id: options.projectId,
    },
  });
}

export async function duplicateProject(options: {
  token: string;
  projectId: string;
  name: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/duplicate",
    method: "POST",
    token: options.token,
    body: {
      id: options.projectId,
      name: options.name,
    },
  });
}

export async function getProjects(options: {
  token: string;
  type: "OWNER" | "CONTRIBUTOR" | "ALL";
  minimal?: boolean;
  withStats?: boolean;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/list",
    method: "POST",
    token: options.token,
    body: {
      type: options.type,
      minimal: options.minimal,
      withStats: options.withStats,
    },
  });
}

export async function publishTemplate(options: {
  token: string;
  projectId: string;
  displayName: string;
  description: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/" + options.projectId + "/template/publish",
    method: "POST",
    token: options.token,
    body: {
      displayName: options.displayName,
      description: options.description,
    },
  });
}

export async function removeTemplate(options: {
  token: string;
  projectId: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/" + options.projectId + "/template/remove",
    method: "POST",
    token: options.token,
  });
}

export async function updateTemplate(options: {
  token: string;
  projectId: string;
  update: {
    displayName?: string;
    description?: string;
  };
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/" + options.projectId + "/template/update",
    token: options.token,
    method: "POST",
    body: {
      update: options.update,
    },
  });
}

export async function getTemplate(templateId: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/templates/" + templateId,
    method: "GET",
  });
}

export async function rateTemplate(options: {
  token: string;
  templateId: string;
  rating: number;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/templates/" + options.templateId + "/rating",
    method: "POST",
    token: options.token,
    body: {
      rating: options.rating,
    },
  });
}

export async function useTemplate(options: {
  token: string;
  templateId: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/templates/" + options.templateId + "/use",
    method: "POST",
    token: options.token,
  });
}

export async function hasTemplate(options: {
  token: string;
  projectId: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/" + options.projectId + "/template/has",
    method: "GET",
    token: options.token,
  });
}

export async function getAllTemplates(): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/templates/list",
    method: "GET",
  });
}

export async function toggleProjectPin(options: {
  token: string;
  projectId: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/ide/projects/" + options.projectId + "/toggle-pin",
    token: options.token,
    method: "POST",
  });
}
