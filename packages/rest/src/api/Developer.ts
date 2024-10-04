/**
 * packages/rest/src/api/Developer.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.2024
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export const Developer = {
  async getApps(token: string): Promise<IResponse> {
    return await makeRequest({
      path: "/developer/apps",
      method: "GET",
      token: token,
    });
  },
  async getApp(token: string, id: string): Promise<IResponse> {
    return await makeRequest({
      method: "GET",
      path: "/developer/apps?id=" + id,
      token,
    });
  },
  async deleteApp(token: string, id: string): Promise<IResponse> {
    return await makeRequest({
      method: "DELETE",
      path: "/developer/apps?id=" + id,
      token,
    });
  },
  async createApp(
    token: string,
    data: {
      name: string;
      description: string;
      logo: string;
      redirectUris: string[];
    }
  ): Promise<IResponse> {
    return await makeRequest({
      method: "POST",
      path: "/developer/apps",
      token,
      body: data,
    });
  },
  async updateApp(
    token: string,
    id: string,
    data: {
      name: string;
      description: string;
      logo: string;
      redirectUris: string[];
    }
  ): Promise<IResponse> {
    return await makeRequest({
      method: "PUT",
      path: "/developer/apps?id=" + id,
      token,
      body: data,
    });
  },
};
