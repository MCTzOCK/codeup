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
