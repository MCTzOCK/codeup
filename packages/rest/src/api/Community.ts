/**
 * packages/rest/src/api/Community.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.07.2022
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function search(term: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/community/search?term=" + term,
    method: "GET",
  });
}

export async function getFeed(options: {
  from: number;
  to: number;
  idsOnly?: boolean;
  noReplies?: boolean;
}): Promise<IResponse> {
  return await makeRequest({
    path: `/api/community/feed?from=${options.from}&to=${options.to}&idsOnly=${
      options.idsOnly || false
    }&noReplies=${options.noReplies || false}`,
    method: "GET",
  });
}

export async function existsProfile(id: string): Promise<IResponse> {
  return await makeRequest({
    path: "/api/community/has-profile/" + id,
    method: "GET",
  });
}

export async function createPost(options: {
  token: string;
  content: string;
  parent: string | null | undefined;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/community/post/create",
    method: "POST",
    token: options.token,
    body: {
      content: options.content,
      parent: options.parent ? options.parent : null,
    },
  });
}

export async function getPost(id: string): Promise<IResponse> {
  return await makeRequest({
    method: "GET",
    path: "/api/community/post/" + id,
  });
}

export async function likePost(options: {
  token: string;
  postId: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/community/post/" + options.postId + "/like",
    method: "POST",
    token: options.token,
  });
}

export async function deletePost(options: {
  token: string;
  postId: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/community/post/" + options.postId + "/delete",
    method: "POST",
    token: options.token,
  });
}

export async function createProfile(options: {
  token: string;
  displayName: string;
  biography: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/community/profile/create",
    token: options.token,
    body: {
      displayName: options.displayName,
      bio: options.biography,
    },
    method: "POST",
  });
}

export async function getProfile(
  name: string,
  small?: boolean
): Promise<IResponse> {
  let path = "/api/community/profile/" + name;

  if (small) {
    path += "?small=true";
  }

  return await makeRequest({
    path,
    method: "GET",
  });
}

export async function updateProfile(options: {
  token: string;
  update: { [key: string]: string };
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/community/profile/update",
    method: "POST",
    body: {
      update: options.update,
    },
    token: options.token,
  });
}

export async function isFollowing(
  profile: string,
  otherProfile: string
): Promise<IResponse> {
  return await makeRequest({
    path: "/api/community/profile/" + profile + "/is-following/" + otherProfile,
    method: "GET",
  });
}

export async function getProfileFollowers(options: {
  name: string;
  count?: boolean;
  from?: number;
  to?: number;
}): Promise<IResponse> {
  let path = "/api/community/profile/" + options.name + "/followers?";

  if (options.count) {
    path += "count=true&";
  }

  if (options.from) {
    path += "from=" + options.from + "&";
  }

  if (options.to) {
    path += "to=" + options.to + "&";
  }

  return await makeRequest({
    path,
    method: "GET",
  });
}

export async function getProfilePosts(options: {
  name: string;
  count?: boolean;
  from?: number;
  to?: number;
}): Promise<IResponse> {
  let path = "/api/community/profile/" + options.name + "/posts?";

  if (options.count) {
    path += "count=true&";
  }

  if (options.from) {
    path += "from=" + options.from + "&";
  }

  if (options.to) {
    path += "to=" + options.to + "&";
  }

  return await makeRequest({
    path,
    method: "GET",
  });
}

export async function toggleFollow(options: {
  token: string;
  profile: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/community/profile/" + options.profile + "/toggle-follow",
    method: "POST",
    token: options.token,
  });
}
