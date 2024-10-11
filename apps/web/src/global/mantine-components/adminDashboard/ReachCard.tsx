/**
 * apps/web/src/global/mantine-components/adminDashboard/ReachCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.10.2024
 *
 */

import * as React from "react";
import DashboardChartCard from "./DashboardChartCard";
import { LineChart } from "@mantine/charts";
import { DASHBOARD_ANALYTICS } from "../../../pages/admin-v2/queries";

export default function ReachCard() {
  return (
    <>
      <DashboardChartCard
        title={"Reach"}
        description={"Overview over the analytics and the replayable sessions."}
        style={{
          gridColumn: "span 2",
        }}
        renderContent={(data) => (
          <>
            <b>{data.AnalyticsCount}</b> page views have been generated and{" "}
            <br />
            <b>{data.SessionReplayCount}</b> sessions have been recorded.
          </>
        )}
        renderChart={(analyticsData) => (
          <LineChart
            pt={"lg"}
            h={300}
            data={[
              ...analyticsData.AnalyticsCreatedChart.map((item: any) => ({
                Views: item.count,
                date: item.id,
                Sessions: analyticsData.SessionReplayCreatedChart.find(
                  (x: any) => x.id === item.id
                )?.count,
              })),
            ]}
            curveType={"linear"}
            dataKey={"date"}
            withLegend
            series={[
              {
                name: "Views",
                color: "blue.6",
              },
              {
                name: "Sessions",
                color: "teal.6",
              },
            ]}
            tickLine={"xy"}
            gridAxis={"xy"}
            withXAxis={true}
          />
        )}
        gqlQuery={DASHBOARD_ANALYTICS}
        customVariables={{}}
        defaultSelectedTime={"two-week"}
      />
    </>
  );
}
