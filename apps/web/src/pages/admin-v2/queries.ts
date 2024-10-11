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
import type { DocumentNode } from "@graphql-typed-document-node/core/node_modules/graphql";

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

export const DELETE_USER = gql`
  mutation DELETE_USER($id: MongoID!) {
    UserRemoveById(_id: $id) {
      recordId
      error {
        message
      }
    }
  }
`;

export const BLOGS_PAGINATED = gql`
  query BlogsPaginated($page: Int!) {
    BlogPagination(page: $page, perPage: 10) {
      count
      items {
        _id
        title
        published_at
        content
        authorUsername
        tags
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

export const BLOGS_UPDATE = gql`
  mutation BlogUpdate($id: MongoID!, $record: UpdateByIdBlogInput!) {
    BlogUpdateById(_id: $id, record: $record) {
      recordId
      record {
        _id
      }
    }
  }
`;

export const BLOGS_CREATE = gql`
  mutation CreateBlog($record: CreateOneBlogInput!) {
    BlogCreate(record: $record) {
      recordId
      record {
        _id
        title
        content
        authorUsername
        published_at
        tags
        _id
      }
      error {
        message
      }
    }
  }
`;

export const DELETE_BLOG = gql`
  mutation DELETE_BLOG($id: MongoID!) {
    BlogRemoveById(_id: $id) {
      recordId
      error {
        message
      }
    }
  }
`;

export const DASHBOARD_USERS = gql`
  query DashboardUsers($startDate: Date!, $endDate: Date!, $interval: String!) {
    UserCount
    UserCreatedChart(
      startDate: $startDate
      endDate: $endDate
      interval: $interval
      filter: {}
    )
  }
`;

export const DASHBOARD_ANALYTICS = gql`
  query DashboardUsers($startDate: Date!, $endDate: Date!, $interval: String!) {
    AnalyticsCount
    AnalyticsCreatedChart(
      startDate: $startDate
      endDate: $endDate
      interval: $interval
      filter: {}
    )
    SessionReplayCount
    SessionReplayCreatedChart(
      startDate: $startDate
      endDate: $endDate
      interval: $interval
      filter: {}
    )
  }
`;

export const DASHBOARD_CONTACTS = gql`
  query DashboardContacts {
    ContactCount
  }
`;

export const DASHBOARD_PROJECTS = gql`
  query DashboardProjects {
    ProjectCount
    IDEProjectCount
    EditorProjectCount
    CodeUpKidsProjectCount
  }
`;

export const DASHBOARD_ERRORS = gql`
  query DashboardErrors(
    $startDate: Date!
    $endDate: Date!
    $interval: String!
  ) {
    ErrorModelCount
    ErrorModelCreatedChart(
      startDate: $startDate
      endDate: $endDate
      interval: $interval
      filter: {}
    )
  }
`;

export const DASHBOARD_FORUM = gql`
  query DashboardProjects {
    ForumProfileCount
    ForumPostCount
    ForumChatCount
  }
`;

export const DASHBOARD_PLANNING = gql`
  query DashboardPlanning {
    ToDoProjectCount
    ProjectIssueCount
    TodoCount
    ToDoListV2Count
    ProjectFlowCount
  }
`;
