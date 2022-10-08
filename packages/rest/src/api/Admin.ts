/**
 * packages/rest/src/api/Admin.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.22
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function listAccounts(token: string): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token,
    path: "/api/admin/account/list",
  });
}

export async function updateAccount(options: {
  token: string;
  username: string;
  update: { [key: string]: string };
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: "/api/admin/account/update",
    body: {
      username: options.username,
      update: options.update,
    },
  });
}

export async function deleteAccount(options: {
  token: string;
  username: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: "/api/admin/account/delete",
    body: {
      username: options.username,
    },
  });
}

export async function createAccount(options: {
  token: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  admin: boolean;
  password: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: "/api/admin/account/create",
    body: {
      username: options.username,
      email: options.email,
      firstName: options.firstName,
      lastName: options.lastName,
      active: options.active,
      admin: options.admin,
      password: options.password,
    },
  });
}
