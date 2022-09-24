/**
 * packages/rest/src/api/Forum.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2022
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function createProfile(options: {
  token: string;
  username: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/forum/" + options.username + "/profile",
    method: "POST",
    token: options.token,
  });
}

export async function getProfile(username: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/forum/" + username + "/profile",
    method: "GET",
  });
}

export async function modifyProfile(options: {
  update: { [key: string]: string | undefined | null };
  token: string;
  username: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/forum/" + options.username + "/profile",
    method: "POST",
    token: options.token,
    body: options.update,
  });
}

export async function deleteProfile(options: {
  token: string;
  username: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/forum/" + options.username + "/profile",
    method: "DELETE",
    token: options.token,
  });
}

export async function createPost(options: {
  token: string;
  content: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/forum/post",
    method: "POST",
    token: options.token,
    body: {
      content: options.content,
    },
  });
}

export async function getPost(id: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/forum/post/" + id,
    method: "GET",
  });
}

export async function getProfilePosts(options: {
  username: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/forum/" + options.username + "/posts",
    method: "GET",
  });
}

export async function deletePost(options: {
  token: string;
  id: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/forum/post/" + options.id + "/delete",
    method: "POST",
    token: options.token,
  });
}

export async function getProfiles(): Promise<IResponse> {
  return await makeRequest({
    path: "/api/forum/profiles",
    method: "GET",
  });
}
