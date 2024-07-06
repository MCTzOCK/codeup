/**
 * packages/rest/src/api/ToDo.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.07.2022
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getMyLists(token: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/todo/my-lists",
    token: token,
    method: "GET",
  });
}

export async function createList(options: {
  token: string;
  name: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/todo/lists/create",
    method: "POST",
    token: options.token,
    body: {
      name: options.name,
    },
  });
}

export async function deleteList(options: {
  token: string;
  listId: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/todo/lists/delete",
    method: "POST",
    token: options.token,
    body: {
      list: options.listId,
    },
  });
}

export async function getList(options: {
  token: string;
  listId: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/todo/lists/" + options.listId,
    token: options.token,
    method: "GET",
  });
}

export async function createTask(options: {
  token: string;
  listId: string;
  task: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/todo/lists/" + options.listId + "/tasks/create",
    token: options.token,
    method: "POST",
    body: {
      task: options.task,
    },
  });
}

export async function deleteTask(options: {
  token: string;
  listId: string;
  taskUUID: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/todo/lists/" + options.listId + "/tasks/delete",
    token: options.token,
    method: "POST",
    body: {
      task: options.taskUUID,
    },
  });
}

export async function toggleItemFinish(options: {
  token: string;
  listId: string;
  taskUUID: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/todo/lists/" + options.listId + "/tasks/toggle-finish",
    token: options.token,
    method: "POST",
    body: {
      task: options.taskUUID,
    },
  });
}

export async function updateItem(options: {
  token: string;
  listId: string;
  taskUUID: string;
  update: { [key: string]: any };
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/todo/lists/" + options.listId + "/tasks/update",
    token: options.token,
    method: "POST",
    body: {
      task: options.taskUUID,
      update: options.update,
    },
  });
}

export async function getV2Projects(token: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/todo/projects",
    token: token,
    method: "GET",
  });
}

export async function getV2Project(options: {
  token: string;
  id: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/todo/projects?id=" + options.id,
    method: "GET",
    token: options.token,
  });
}

export async function deleteV2Project(options: {
  token: string;
  id: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/todo/projects?id=" + options.id,
    method: "DELETE",
    token: options.token,
  });
}

export async function createV2Project(options: {
  token: string;
  name: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/todo/projects?name=" + options.name,
    method: "POST",
    token: options.token,
  });
}

export async function updateV2Project(options: {
  token: string;
  id: string;
  saved: any;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/todo/projects?id=" + options.id,
    method: "POST",
    token: options.token,
    body: {
      saved: options.saved,
    },
  });
}

export const V2 = {
  async getMyLists(token: string): Promise<IResponse> {
    return await makeRequest({
      path: "/api/todov2/my",
      token: token,
      method: "GET",
    });
  },
  async getList(token: string, id: string): Promise<IResponse> {
    return await makeRequest({
      path: "/api/todov2/my?id=" + id,
      token: token,
      method: "GET",
    });
  },
  async createList(token: string, name: string): Promise<IResponse> {
    return await makeRequest({
      path: "/api/todov2/my",
      token: token,
      method: "POST",
      body: {
        name,
      },
    });
  },
  async deleteList(token: string, id: string): Promise<IResponse> {
    return await makeRequest({
      path: "/api/todov2/my?id=" + id,
      method: "DELETE",
      token: token,
    });
  },
  async renameList(
    token: string,
    id: string,
    name: string
  ): Promise<IResponse> {
    return await makeRequest({
      path: "/api/todov2/my?id=" + id,
      method: "PUT",
      token: token,
      body: {
        name,
      },
    });
  },
  async getListItems(token: string, id: string): Promise<IResponse> {
    return await makeRequest({
      path: "/api/todov2/items?id=" + id,
      token: token,
      method: "GET",
    });
  },
  async createListItem(
    token: string,
    id: string,
    name: string,
    description: string
  ): Promise<IResponse> {
    return await makeRequest({
      path: "/api/todov2/items?id=" + id,
      token: token,
      method: "POST",
      body: {
        name,
        description,
      },
    });
  },
  async updateListItem(
    token: string,
    id: string,
    itemId: string,
    name: string,
    description: string,
    done: boolean
  ): Promise<IResponse> {
    return await makeRequest({
      path: "/api/todov2/items?id=" + id + "&itemId=" + itemId,
      token: token,
      method: "PUT",
      body: {
        name,
        description,
        done,
      },
    });
  },
  async deleteListItem(
    token: string,
    id: string,
    itemId: string
  ): Promise<IResponse> {
    return await makeRequest({
      path: "/api/todov2/items?id=" + id + "&itemId=" + itemId,
      token: token,
      method: "DELETE",
    });
  },
};
