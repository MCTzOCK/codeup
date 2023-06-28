/**
 * packages/rest/src/api/Ask.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.06.23
 *
 */

import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function deletePost(
  id: string,
  token: string
): Promise<IResponse> {
  return await makeRequest({
    method: "DELETE",
    token: token,
    path: "/api/ask/posts?id=" + id,
  });
}

export async function createPost(
  content: string,
  token: string,
  parent?: string
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: "/api/ask/posts",
    body: {
      content: content,
      parent: parent,
    },
    token: token,
  });
}

export async function getPost(id: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/ask/posts?id=" + id,
  });
}

export async function getPostsByUser(
  username: string,
  page?: number
): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/ask/posts?user=" + username + "&page=" + page,
  });
}

export async function getPostsByParent(
  id: string,
  page?: number
): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/ask/posts?parent=" + id + "&page=" + page,
  });
}

export async function searchPosts(
  query: string,
  page?: number
): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/ask/posts?query=" + query + "&page=" + page,
  });
}

export async function getPosts(page?: number): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/ask/posts?page=" + page,
  });
}

export async function getProfile(username: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/ask/profiles/" + username,
  });
}

export async function updateProfile(
  username: string,
  token: string,
  update: {
    bio?: string;
    banner?: string;
    website?: string;
    projects?: string[];
    certificates?: string[];
  }
): Promise<IResponse> {
  return await makeRequest({
    method: "POST",
    path: "/api/ask/profiles/" + username,
    body: { update },
    token: token,
  });
}
