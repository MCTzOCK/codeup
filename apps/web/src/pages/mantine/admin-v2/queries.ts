/**
 * apps/web/src/pages/mantine/admin-v2/queries.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.10.2024
 *
 */

import { gql } from "@apollo/client";
import makeRequest from "@codeup/rest/dist/makeRequest";
import AccountManager from "@codeup/util/dist/AccountManager";

export function gatherToken(setToken: (token: string) => void) {
  makeRequest({
    path: "/api/admin/gql",
    token: AccountManager.getActiveToken(),
    method: "GET",
  }).then((res) => {
    setToken(res.payload.gql.token);
  });
}

export const USERS_PAGINATED = gql`
  query UsersPaginated($page: Int!, $filter: RegExpAsString!) {
    UserPagination(
      page: $page
      perPage: 10
      filter: { _operators: { username: { regex: $filter } } }
      sort: USERNAME_ASC
    ) {
      count
      items {
        _id
        username
        email
        firstName
        lastName
        createdAt
        twoFactorEnabled
        active
        sso
        role
        subscription
        __typename
      }
      pageInfo {
        currentPage
        perPage
        pageCount
        itemCount
        hasNextPage
        hasPreviousPage
        __typename
      }
      __typename
    }
  }
`;

export const USERS_UPDATE = gql`
  mutation UserUpdate($id: MongoID!, $record: UpdateByIdUserInput!) {
    UserUpdateById(_id: $id, record: $record) {
      recordId
      record {
        _id
      }
    }
  }
`;
