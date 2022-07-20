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
