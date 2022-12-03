/**
 * packages/rest/src/api/Certificates.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.11.2022
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function getCertificate(options: {
  token: string;
  course: string;
  onlyLookup: boolean;
}): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    token: options.token,
    path: `/api/course/${options.course}/certificate?onlyLookup=${options.onlyLookup}`,
  });
}

export async function submitCertificate(options: {
  token: string;
  course: string;
  answers: any[];
}): Promise<IResponse> {
  return makeRequest({
    method: "POST",
    path: `/api/course/${options.course}/certificate`,
    token: options.token,
    body: {
      answers: options.answers,
    },
  });
}

export async function getObtainedCertificate(id: string): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    path: `/api/cert?id=${id}`,
  });
}

export async function getObtainedCertificates(
  token: string
): Promise<IResponse> {
  return makeRequest({
    method: "GET",
    path: `/api/certificates/my`,
    token: token,
  });
}
