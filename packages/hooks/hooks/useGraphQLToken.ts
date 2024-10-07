/**
 * packages/hooks/hooks/useGraphQLToken.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.2024
 *
 */

import makeRequest from "@codeup/rest/dist/makeRequest";
import AccountManager from "@codeup/util/dist/AccountManager";
import { useState } from "react";

export const useGraphQLToken = () => {
  const token = AccountManager.getActiveToken();
  const [gqlToken, setGqlToken] = useState<string | null>(null);

  if (!token) {
    return gqlToken;
  }

  makeRequest({
    path: "/api/admin/gql",
    token,
    method: "GET",
  }).then((res) => {
    if (res.status === 200) {
      setGqlToken(res.payload.gql.token);
    }
  });

  return gqlToken;
};
