/**
 * apps/web/src/global/mantine-components/adminDashboard/ForumCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.10.2024
 *
 */

import * as React from "react";
import DashboardChartCard from "./DashboardChartCard";
import { BarChart } from "@mantine/charts";
import { DASHBOARD_FORUM } from "../../../pages/admin-v2/queries";

export default function ForumCard() {
  return (
    <>
      <DashboardChartCard
        title={"Forum Metrics"}
        description={"Overview over the forum metrics."}
        renderContent={(data) => (
          <>
            There are <b>{data.ForumProfileCount}</b> forum profiles, &nbsp;
            <b>{data.ForumPostCount}</b> forum posts and{" "}
            <b>{data.ForumChatCount}</b> forum chats.
          </>
        )}
        noDate
        renderChart={(data) => (
          <BarChart
            pt={"lg"}
            h={300}
            data={[
              {
                product: "Profiles",
                Profiles: data.ForumProfileCount,
                Chats: data.ForumChatCount,
                Posts: data.ForumPostCount,
              },
            ]}
            dataKey={"product"}
            withLegend
            series={[
              {
                name: "Profiles",
                color: "blue.6",
              },
              {
                name: "Posts",
                color: "red.6",
              },
              {
                name: "Chats",
                color: "green.6",
              },
            ]}
            tickLine={"xy"}
            gridAxis={"xy"}
            withXAxis={true}
          />
        )}
        gqlQuery={DASHBOARD_FORUM}
        customVariables={{}}
      />
    </>
  );
}
