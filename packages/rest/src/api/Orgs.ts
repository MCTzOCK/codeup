/**
 * packages/rest/src/api/Orgs.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.03.23
 *
 */
import makeRequest from "../makeRequest";
import { IResponse } from "../types/IResponse";

export async function createOrg(options: {
  token: string;
  name: string;
  icon?: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: "/api/orgs/create",
    method: "POST",
    body: {
      name: options.name,
      icon: options.icon,
    },
  });
}

export async function getOrgs(token: string): Promise<IResponse> {
  return await makeRequest({
    token: token,
    path: "/api/orgs/my",
    method: "GET",
  });
}

export async function deleteOrg(options: {
  token: string;
  name: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: "/api/orgs/delete",
    method: "POST",
    body: {
      name: options.name,
    },
  });
}

export async function getOrg(options: {
  token: string;
  name: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: `/api/orgs/${options.name}`,
    method: "GET",
  });
}

export async function renameOrg(options: {
  token: string;
  oldName: string;
  newName: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: "/api/orgs/" + options.oldName + "/update",
    method: "POST",
    body: {
      update: {
        name: options.newName,
      },
    },
  });
}

export async function updateOrgIcon(options: {
  token: string;
  name: string;
  icon: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: "/api/orgs/" + options.name + "/update",
    method: "POST",
    body: {
      update: {
        icon: options.icon,
      },
    },
  });
}

export async function updateOrg(options: {
  token: string;
  name: string;
  update: any;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: "/api/orgs/" + options.name + "/update",
    method: "POST",
    body: {
      update: options.update,
    },
  });
}

export async function addOrgMember(options: {
  token: string;
  name: string;
  userId: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: "/api/orgs/" + options.name + "/members",
    method: "POST",
    body: {
      action: "ADD",
      userId: options.userId,
    },
  });
}

export async function removeOrgMember(options: {
  token: string;
  name: string;
  userId: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: "/api/orgs/" + options.name + "/members",
    method: "POST",
    body: {
      action: "REMOVE",
      userId: options.userId,
    },
  });
}

export async function addOrgTemplate(options: {
  token: string;
  projectId: string;
  org: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: "/api/orgs/" + options.org + "/templates",
    method: "POST",
    body: {
      action: "ADD",
      projectId: options.projectId,
    },
  });
}

export async function removeOrgTemplate(options: {
  token: string;
  projectId: string;
  org: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: "/api/orgs/" + options.org + "/templates",
    method: "POST",
    body: {
      action: "REMOVE",
      projectId: options.projectId,
    },
  });
}

export async function getOrgTemplates(options: {
  token: string;
  org: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path: "/api/orgs/" + options.org + "/templates",
    method: "GET",
  });
}

export async function useOrgTemplate(options: {
  token: string;
  org: string;
  projectId: string;
  name: string;
}): Promise<IResponse> {
  return await makeRequest({
    token: options.token,
    path:
      "/api/orgs/" +
      options.org +
      "/use-template?templateId=" +
      options.projectId +
      "&newProjectName=" +
      options.name,
    method: "GET",
  });
}
