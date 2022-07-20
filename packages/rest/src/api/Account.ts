/**
 * packages/rest/src/api/Account.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.07.2022
 *
 */
import { IResponse } from "../types/IResponse";
import makeRequest from "../makeRequest";

export async function register(options: {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}): Promise<IResponse> {
  return await makeRequest({
    path: "/api/account/register",
    body: {
      username: options.username,
      email: options.email,
      firstName: options.firstName,
      lastName: options.lastName,
      password: options.password,
    },
    method: "POST",
  });
}
