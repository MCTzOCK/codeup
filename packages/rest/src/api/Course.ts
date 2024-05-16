/**
 * packages/rest/src/api/Course.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.11.2022
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getSection(options: {
  course: string;
  section: string;
  token?: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/course/" + options.course + "/" + options.section,
    method: "GET",
    token: options.token ? options.token : undefined,
  });
}

export async function getCourse(options: {
  course: string;
  token?: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/course/" + options.course,
    method: "GET",
    token: options.token ? options.token : undefined,
  });
}

export async function listCourses(options: {
  token?: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/course/list-courses",
    method: "GET",
    token: options.token ? options.token : undefined,
  });
}

export async function getEnrollments(options: {
  token: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/course/enrollments",
    method: "GET",
    token: options.token,
  });
}

export async function getEnrollment(options: {
  token: string;
  course: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/course/" + options.course + "/enrollment",
    method: "GET",
    token: options.token,
  });
}

export async function changeEnrollment(options: {
  token: string;
  course: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/course/" + options.course + "/enrollment",
    method: "POST",
    token: options.token,
  });
}

export async function getCourseProgress(options: {
  token: string;
  course: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/course/" + options.course + "/progress",
    method: "GET",
    token: options.token,
  });
}

export async function updateCourseProgress(options: {
  token: string;
  course: string;
  section: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/course/" + options.course + "/progress",
    method: "POST",
    token: options.token,
    body: {
      section: options.section,
    },
  });
}
