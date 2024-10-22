/**
 * apps/observability/src/rest/RestClient.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.10.2024
 *
 */
import { IResponse } from "@codeup/rest/dist/types/IResponse";
import customMakeRequest, {
  ICustomMakeRequestOptions,
} from "@/rest/customMakeRequest";

export default class RestClient {
  private static token: string;

  public static hasToken(): boolean {
    return !!RestClient.token;
  }

  /**
   * Sets the token for the entire REST Client
   * @param token The authentication token to use
   */
  public static setToken(token: string) {
    RestClient.token = token;
  }

  /**
   * Retrieves all applications created by the specific user.
   * @returns The response from the server
   */
  public static async getApplications(): Promise<IResponse> {
    return await RestClient.makeRequest.GET("/applications");
  }

  /**
   * Retrieves a specific application by its ID.
   * @param id The ID of the application to retrieve
   * @returns The response from the server
   */
  public static async getApplication(id: string): Promise<IResponse> {
    return await RestClient.makeRequest.GET("/applications?id=" + id);
  }

  /**
   * Searches through the user created applications using the name
   * @param nameFilter The name to search for
   * @returns The response from the server
   */
  public static async getApplicationsByName(
    nameFilter: string
  ): Promise<IResponse> {
    return await RestClient.makeRequest.GET(
      "/applications?filter=" + nameFilter
    );
  }

  /**
   * Creates a new application for the user
   * @param options The options for the new application
   * @returns The response from the server
   */
  public static async createApplication(options: {
    name: string;
    url: string;
    logo?: string;
  }): Promise<IResponse> {
    return await RestClient.makeRequest.POST("/applications", {
      ...options,
    });
  }

  /**
   * Deletes an application by its ID
   * @param id The ID of the existing application
   * @returns The response from the server
   */
  public static async deleteApplication(id: string): Promise<IResponse> {
    return await RestClient.makeRequest.DELETE("/applications?id=" + id);
  }

  /**
   * Updates an existing application
   * @param options The properties to update
   */
  public static async updateApplication(options: {
    name?: string;
    url?: string;
    logo?: string;
  }): Promise<IResponse> {
    return await RestClient.makeRequest.PUT("/applications", options);
  }

  public static makeRequest = {
    $: async (options: ICustomMakeRequestOptions): Promise<IResponse> => {
      return await customMakeRequest({
        ...options,
        token: RestClient.token,
      });
    },
    GET: async (path: string, headers?: object): Promise<IResponse> => {
      return await RestClient.makeRequest.$({
        path,
        method: "GET",
        headers,
      });
    },
    POST: async (
      path: string,
      body: object,
      headers?: object
    ): Promise<IResponse> => {
      return await RestClient.makeRequest.$({
        path,
        method: "POST",
        body,
        headers,
      });
    },
    DELETE: async (path: string, headers?: object): Promise<IResponse> => {
      return await RestClient.makeRequest.$({
        path,
        method: "DELETE",
        headers,
      });
    },
    PUT: async (
      path: string,
      body: object,
      headers?: object
    ): Promise<IResponse> => {
      return await RestClient.makeRequest.$({
        path,
        method: "PUT",
        body,
        headers,
      });
    },
    PATCH: async (
      path: string,
      body: object,
      headers?: object
    ): Promise<IResponse> => {
      return await RestClient.makeRequest.$({
        path,
        method: "PATCH",
        body,
        headers,
      });
    },
  };
}
