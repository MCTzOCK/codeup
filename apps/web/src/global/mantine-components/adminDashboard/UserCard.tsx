/**
 * apps/web/src/global/mantine-components/adminDashboard/UserCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.10.2024
 *
 */

import * as React from "react";
import { DASHBOARD_USERS } from "../../queries";
import { BarChart } from "@mantine/charts";
import DashboardChartCard from "./DashboardChartCard";

export default function UserCard() {
  return (
    <DashboardChartCard
      title={"Users"}
      description={
        "Overview over the users in the system and the history of creation."
      }
      renderContent={(data) => {
        return (
          <>
            <b>{data.UserCount}</b> users have registered in total.
          </>
        );
      }}
      renderChart={(userData) => (
        <>
          <BarChart
            pt={"lg"}
            h={300}
            data={userData.UserCreatedChart.map((item: any) => ({
              Users: item.count,
              date: item.id,
            }))}
            dataKey={"date"}
            withLegend
            series={[
              {
                name: "Users",
                color: "blue.6",
              },
            ]}
            tickLine={"xy"}
            gridAxis={"xy"}
            withXAxis={true}
          />
        </>
      )}
      gqlQuery={DASHBOARD_USERS}
      customVariables={{}}
    />
  );
}
