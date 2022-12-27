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
  role: string;
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
      role: options.role,
      password: options.password,
    },
  });
}

export async function listForumProfiles(token: string): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token,
    path: "/api/admin/forum_profiles/list",
  });
}

export async function deleteForumProfile(options: {
  token: string;
  username: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: "/api/admin/forum_profiles/delete",
    body: {
      username: options.username,
    },
  });
}

export async function updateForumProfile(options: {
  token: string;
  username: string;
  update: { [key: string]: string };
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: "/api/admin/forum_profiles/update",
    body: {
      username: options.username,
      update: options.update,
    },
  });
}

export async function listCourses(
  token: string,
  names_only: boolean = false
): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token,
    path: `/api/admin/course/list${names_only ? "?list=true" : ""}`,
  });
}

export async function createCourse(options: {
  token: string;
  name: string;
  friendlyName: string;
  description: string;
  splashImage: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: "/api/admin/course/create",
    body: {
      name: options.name,
      friendlyName: options.friendlyName,
      description: options.description,
      splashImage: options.splashImage,
    },
  });
}

export async function deleteCourse(options: {
  token: string;
  friendlyName: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: "/api/admin/course/delete",
    body: {
      friendlyName: options.friendlyName,
    },
  });
}

export async function updateCourse(options: {
  token: string;
  id: string;
  update: { [key: string]: string };
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: "/api/admin/course/edit",
    body: {
      id: options.id,
      update: options.update,
    },
  });
}

export async function createVideo(options: {
  token: string;
  title: string;
  friendlyName: string;
  youtubeURL: string;
  course: string;
  transcript: string;
  quiz: any;
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: "/api/admin/video/create",
    body: {
      title: options.title,
      friendlyName: options.friendlyName,
      youtubeURL: options.youtubeURL,
      course: options.course,
      transcript: options.transcript,
      quiz: options.quiz,
    },
  });
}

export async function listVideos(token: string): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token,
    path: "/api/admin/video/list",
  });
}

export async function getVideo(options: {
  token: string;
  vid: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token: options.token,
    path: `/api/admin/video/youtube/${options.vid}`,
  });
}

export async function deleteVideo(options: {
  token: string;
  vid: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "DELETE",
    token: options.token,
    path: `/api/admin/video/youtube/${options.vid}`,
  });
}

export async function updateVideo(options: {
  token: string;
  vid: string;
  update: { [key: string]: string };
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: `/api/admin/video/youtube/${options.vid}`,
    body: {
      update: options.update,
    },
  });
}

/** **/

export async function createText(options: {
  token: string;
  title: string;
  friendlyName: string;
  course: string;
  content: string;
  quiz: any;
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: "/api/admin/text/create",
    body: {
      title: options.title,
      friendlyName: options.friendlyName,
      course: options.course,
      content: options.content,
      quiz: options.quiz,
    },
  });
}

export async function listTexts(token: string): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token,
    path: "/api/admin/text/list",
  });
}

export async function getText(options: {
  token: string;
  tid: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token: options.token,
    path: `/api/admin/text/${options.tid}`,
  });
}

export async function deleteText(options: {
  token: string;
  tid: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "DELETE",
    token: options.token,
    path: `/api/admin/text/${options.tid}`,
  });
}

export async function updateText(options: {
  token: string;
  tid: string;
  update: { [key: string]: string };
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: `/api/admin/text/${options.tid}`,
    body: {
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
    path: "/api/admin/contents",
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
  cid?: string;
  search?: string;
  course?: string;
  type?: string;
}): Promise<IResponse> {
  // not the best way to remove the token from the options object
  // so that it doesn't get added to the query string
  // but it works for now.
  let token = options.token;
  // @ts-ignore
  delete options.token;
  return makeRequest({
    method: "GET",
    token: token,
    path: "/api/admin/contents?" + new URLSearchParams(options).toString(),
  });
}

export async function deleteContent(options: {
  token: string;
  cid: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "DELETE",
    token: options.token,
    path: `/api/admin/contents`,
    body: {
      id: options.cid,
    },
  });
}

export async function getContactMessages(token: string): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token,
    path: "/api/admin/contact/messages",
  });
}

export async function getContactMessageCount(
  token: string
): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token,
    path: "/api/admin/contact/messages?count=true",
  });
}

export async function deleteContactMessage(options: {
  token: string;
  id: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "DELETE",
    token: options.token,
    path: "/api/admin/contact/messages?id=" + options.id,
  });
}

export async function contactUser(options: {
  token: string;
  username: string;
  message: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: "/api/admin/contact/user",
    body: {
      username: options.username,
      message: options.message,
    },
  });
}

export async function getAllObtainedCertificates(
  token: string
): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token,
    path: "/api/admin/certificates/list",
  });
}

export async function deleteObtainedCertificate(options: {
  token: string;
  id: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "DELETE",
    token: options.token,
    path: "/api/admin/certificates/delete?id=" + options.id,
  });
}

export async function getProjectIdeas(token: string): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token,
    path: "/api/admin/project-ideas",
  });
}

export async function deleteProjectIdea(options: {
  token: string;
  id: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "DELETE",
    token: options.token,
    path: "/api/admin/project-ideas?id=" + options.id,
  });
}

export async function createProjectIdea(options: {
  token: string;
  title: string;
  description: string;
  exampleDeployedURL?: string;
  exampleSourceURL?: string;
  level: string;
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    token: options.token,
    path: "/api/admin/project-ideas",
    body: {
      title: options.title,
      description: options.description,
      exampleDeployedURL: options.exampleDeployedURL,
      exampleSourceURL: options.exampleSourceURL,
      level: options.level,
    },
  });
}

export async function getBlogs(options: { token: string }): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token: options.token,
    path: "/api/admin/blog",
  });
}
