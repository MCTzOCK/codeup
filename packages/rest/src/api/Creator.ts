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
export async function createContent(options: {
  token: string;
  displayName: string;
  course: string;
  url: string;
  type: "VIDEO" | "TEXT";
  textContent: string;
  quiz: {
    question: string;
    answers: {
      answer: string;
      correct: boolean;
    }[];
  }[];
  videoUrl?: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: "/api/creator/content",
    body: {
      displayName: options.displayName,
      course: options.course,
      url: options.url,
      type: options.type,
      textContent: options.textContent,
      quiz: options.quiz,
      videoUrl: options.videoUrl,
    },
  });
}

export async function getContents(options: {
  token: string;
  courseId?: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token: options.token,
    path:
      "/api/creator/content" +
      (options.courseId ? `?course=${options.courseId}` : ""),
  });
}

export async function deleteContent(options: {
  token: string;
  cid: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "DELETE",
    token: options.token,
    path: `/api/creator/content`,
    body: {
      id: options.cid,
    },
  });
}

export async function updateContent(options: {
  token: string;
  cid: string;
  update: {
    [key: string]: string | any;
  };
}): Promise<IResponse> {
  return makeRequest({
    method: "PATCH",
    token: options.token,
    path: `/api/creator/content`,
    body: {
      id: options.cid,
      update: options.update,
    },
  });
}

export async function getTopCreators(): Promise<IResponse> {
  return makeRequest({
    path: "/api/creator/top",
    method: "GET",
  });
}
