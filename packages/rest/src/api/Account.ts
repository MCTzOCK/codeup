/**
 * packages/rest/src/api/Account.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.07.2022
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function register(options: {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/account/register",
    body: {
      username: options.username,
      email: options.email,
      firstName: options.firstName,
      lastName: options.lastName,
      password: options.password,
    },
    method: "POST",
  });
}

export async function login(options: {
  email: string;
  password: string;
  code?: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/account/login",
    body: {
      email: options.email,
      password: options.password,
      code: options.code ? options.code : null,
    },
    method: "POST",
  });
}

export async function checkUsername(name: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/account/check-username/" + name,
    method: "GET",
  });
}

export async function checkResetToken(token: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/account/check-reset-token/" + token,
  });
}

export async function deleteAccount(token: string): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: "/api/account/delete",
    token: token,
  });
}

export async function reset(email: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/account/reset",
    method: "POST",
    body: {
      email: email,
    },
  });
}

export async function resetConfirm(options: {
  resetToken: string;
  password: string;
}): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: "/api/account/reset-confirm",
    body: {
      token: options.resetToken,
      password: options.password,
    },
  });
}

export async function update(options: {
  keyName: string;
  keyValue: string;
  token: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/account/update",
    method: "POST",
    body: {
      keyName: options.keyName,
      keyValue: options.keyValue,
    },
  });
}
