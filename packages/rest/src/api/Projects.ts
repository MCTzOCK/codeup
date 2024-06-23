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

export async function getI18nData(
  token: string,
  id: string
): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: `/api/projects/${id}/i18n`,
    token,
  });
}

export async function i18nAddLanguage(
  token: string,
  id: string,
  language: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/projects/${id}/i18n`,
    token,
    body: {
      action: "addLanguage",
      language,
    },
  });
}

export async function i18nRemoveLanguage(
  token: string,
  id: string,
  language: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/projects/${id}/i18n`,
    token,
    body: {
      action: "removeLanguage",
      language,
    },
  });
}

export async function i18nSetDefaultLanguage(
  token: string,
  id: string,
  language: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/projects/${id}/i18n`,
    token,
    body: {
      action: "setDefaultLanguage",
      language,
    },
  });
}

export async function i18nSetKey(
  token: string,
  id: string,
  language: string,
  key: string,
  value: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/projects/${id}/i18n`,
    token,
    body: {
      action: "setKey",
      key,
      value,
      language,
    },
  });
}

export async function i18nDeleteKey(
  token: string,
  id: string,
  language: string,
  key: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/projects/${id}/i18n`,
    token,
    body: {
      action: "deleteKey",
      key,
      language,
    },
  });
}

export async function umlDiagrams(
  token: string,
  id: string,
  umlId?: string
): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: `/api/projects/${id}/uml` + (umlId ? `?umlId=${umlId}` : ""),
    token,
  });
}

export async function createUmlDiagram(
  token: string,
  id: string,
  name: string,
  data: string,
  type: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/projects/${id}/uml`,
    token,
    body: {
      name,
      data,
      type,
    },
  });
}

export async function updateUmlDiagram(
  token: string,
  id: string,
  umlId: string,
  data: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: `/api/projects/${id}/uml?umlId=${umlId}`,
    token,
    body: {
      data,
    },
  });
}

export async function deleteUmlDiagram(
  token: string,
  id: string,
  umlId: string
): Promise<IResponse> {
  return await makeRequest({
    method: "DELETE",
    path: `/api/projects/${id}/uml?umlId=${umlId}`,
    token,
  });
}

export const GitOps = {
  tree: async (
    token: string,
    id: string,
    withContent?: string
  ): Promise<IResponse> => {
    return await makeRequest({
      method: "GET",
      path: `/api/projects/${id}/gitops/tree${
        withContent ? `?withContent=${withContent}` : ""
      }`,
      token,
    });
  },
  branch: async (token: string, id: string): Promise<IResponse> => {
    return await makeRequest({
      method: "GET",
      path: `/api/projects/${id}/gitops/branch`,
      token,
    });
  },
  setBranch: async (
    token: string,
    id: string,
    branch: string
  ): Promise<IResponse> => {
    return await makeRequest({
      method: "POST",
      path: `/api/projects/${id}/gitops/branch`,
      token,
      body: {
        branch,
      },
    });
  },
  commit: async (
    token: string,
    id: string,
    message: string
  ): Promise<IResponse> => {
    return await makeRequest({
      method: "POST",
      path: `/api/projects/${id}/gitops/commit`,
      token,
      body: {
        message,
      },
    });
  },
  commits: async (token: string, id: string): Promise<IResponse> => {
    return await makeRequest({
      method: "GET",
      path: `/api/projects/${id}/gitops/commits`,
      token,
    });
  },
  status: async (token: string, id: string): Promise<IResponse> => {
    return await makeRequest({
      method: "GET",
      path: `/api/projects/${id}/gitops/status`,
      token,
    });
  },
};

export const Files = {
  get: async (token: string, id: string, path: string): Promise<IResponse> => {
    return await makeRequest({
      method: "GET",
      path: `/api/projects/${id}/files/${path}`,
      token,
    });
  },
  setFileContent: async (
    token: string,
    id: string,
    path: string,
    content: string
  ): Promise<IResponse> => {
    return await makeRequest({
      method: "POST",
      path: `/api/projects/${id}/files/${path}`,
      token,
      body: {
        content,
      },
    });
  },
  delete: async (
    token: string,
    id: string,
    path: string
  ): Promise<IResponse> => {
    return await makeRequest({
      method: "DELETE",
      path: `/api/projects/${id}/files/${path}`,
      token,
    });
  },
  createFolder: async (
    token: string,
    id: string,
    path: string
  ): Promise<IResponse> => {
    return await makeRequest({
      method: "POST",
      path: `/api/projects/${id}/files/${path}`,
      token,
      body: {
        folder: true,
      },
    });
  },
  rename: async (
    token: string,
    id: string,
    oldPath: string,
    newPath: string
  ): Promise<IResponse> => {
    return await makeRequest({
      method: "PUT",
      path: `/api/projects/${id}/files/${oldPath}`,
      token,
      body: {
        newName: newPath,
      },
    });
  },
};

export const DB = {
  getDatabase: async (token: string, id: string): Promise<IResponse> => {
    return await makeRequest({
      method: "GET",
      path: `/api/projects/${id}/mysql/databases?action=database`,
      token,
    });
  },
  getCredentials: async (token: string, id: string): Promise<IResponse> => {
    return await makeRequest({
      method: "GET",
      path: `/api/projects/${id}/mysql/databases?action=credentials`,
      token,
    });
  },
  executeSQL: async (
    token: string,
    id: string,
    sql: string
  ): Promise<IResponse> => {
    return await makeRequest({
      method: "POST",
      token,
      path: `/api/projects/${id}/mysql/databases`,
      body: {
        sql,
      },
    });
  },
};

export const Deployment = {
  getBuildJobs: async (options: {
    token: string;
    id: string;
    jobId?: string;
    latest?: boolean;
  }): Promise<IResponse> => {
    return await makeRequest({
      method: "GET",
      path:
        "/api/projects/" +
        options.id +
        "/deployment/build" +
        (options.jobId ? `?job_id=${options.jobId}` : "") +
        (options.latest ? `?latest=true` : ""),
      token: options.token,
    });
  },
  startBuildJob: async (token: string, id: string): Promise<IResponse> => {
    return await makeRequest({
      method: "POST",
      path: "/api/projects/" + id + "/deployment/build",
      token,
    });
  },
  getCurrentDeployment: async (
    token: string,
    id: string,
    logs?: boolean
  ): Promise<IResponse> => {
    return await makeRequest({
      method: "GET",
      path: `/api/projects/${id}/deployment/current${logs ? "?logs=true" : ""}`,
      token,
    });
  },
};
