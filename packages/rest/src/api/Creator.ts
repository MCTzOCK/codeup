/**
 * packages/rest/src/api/Creator.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.11.2022
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getCourses(token: string): Promise<IResponse> {
  return makeRequest({
    path: "/api/creator/course",
    method: "GET",
    token,
  });
}

export async function createCourse(options: {
  name: string;
  friendlyName: string;
  description: string;
  splashImage: string;
  token: string;
}): Promise<IResponse> {
  return makeRequest({
    path: "/api/creator/course",
    method: "POST",
    token: options.token,
    body: {
      name: options.name,
      friendlyName: options.friendlyName,
      description: options.description,
      splashImage: options.splashImage,
    },
  });
}

export async function deleteCourse(options: {
  id: string;
  token: string;
}): Promise<IResponse> {
  return makeRequest({
    path: "/api/creator/course",
    method: "DELETE",
    token: options.token,
    body: {
      id: options.id,
    },
  });
}

export async function updateCourse(options: {
  id: string;
  token: string;
  update: {
    [key: string]: string | any;
  };
}): Promise<IResponse> {
  return makeRequest({
    path: "/api/creator/course",
    method: "PATCH",
    token: options.token,
    body: {
      id: options.id,
      update: options.update,
    },
  });
}
