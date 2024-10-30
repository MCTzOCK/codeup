/**
 * apps/observability/src/gql/queries.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.10.2024
 *
 */
import gql from "graphql-tag";

export const VIEWS_CREATED = gql`
  query ViewsCreated(
    $applicationId: String!
    $startDate: Date!
    $endDate: Date!
  ) {
    PageViewChartCreated(
      applicationId: $applicationId
      startDate: $startDate
      endDate: $endDate
    )
    PageViewCount(applicationId: $applicationId)
  }
`;

export const SR_CREATED = gql`
  query SRCreated($applicationId: String!, $startDate: Date!, $endDate: Date!) {
    SReplayChartCreated(
      applicationId: $applicationId
      startDate: $startDate
      endDate: $endDate
    )
    SReplayCount(applicationId: $applicationId)
  }
`;

export const VIEWS_CHART = gql`
  query ViewsChart($applicationId: String!, $field: String!) {
    PageViewChart(applicationId: $applicationId, field: $field)
  }
`;

export const VIEWS_CHART_RES = gql`
  query ViewsChart($applicationId: String!) {
    screenResolution: PageViewChart(
      applicationId: $applicationId
      field: "screenResolution"
    )
    viewport: PageViewChart(applicationId: $applicationId, field: "viewport")
  }
`;

export const VIEWS_PAGINATED = gql`
  query ViewsChart($applicationId: String!, $page: Int!) {
    PageViewPagination(applicationId: $applicationId, page: $page)
  }
`;

export const SReplays_PAGINATED = gql`
  query ViewsChart($applicationId: String!, $page: Int!) {
    SReplayPagination(applicationId: $applicationId, page: $page) {
      totalPages
      data {
        _id
        application
        createdAt
        sessionStarted
        userAgent
      }
    }
  }
`;

export const SREPLAY_ITEM = gql`
  query SReplayItem($id: String!, $applicationId: String!) {
    SReplayById(applicationId: $applicationId, id: $id) {
      application
      createdAt
      sessionStarted
      userAgent
      events
    }
  }
`;

export const MOST_VIEWED_PAGES = gql`
  query MostViewedPages($applicationId: String!) {
    PageViewChart(applicationId: $applicationId, field: "url")
  }
`;
