/**
 * apps/web/src/global/mantine-components/adminDashboard/ProjectsCard.tsx
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
import { DASHBOARD_PROJECTS } from "../../../pages/admin-v2/queries";

export default function ProjectsCard() {
  return (
    <>
      <DashboardChartCard
        noDate
        title={"Projects"}
        description={"Overview over the user-created projects."}
        renderContent={(data) => (
          <>
            <b>
              {data.ProjectCount +
                data.IDEProjectCount +
                data.EditorProjectCount +
                data.CodeUpKidsProjectCount}
            </b>{" "}
            projects have been created by users.
          </>
        )}
        renderChart={(data) => (
          <BarChart
            pt={"lg"}
            h={300}
            data={[
              {
                "V1 Projects": data.IDEProjectCount,
                "V2 Projects": data.EditorProjectCount,
                "V3 Projects": data.ProjectCount,
                "CodeUp-Kids": data.CodeUpKidsProjectCount,
                date: "Projects",
              },
            ]}
            dataKey={"date"}
            withLegend
            series={[
              {
                name: "V1 Projects",
                color: "blue.6",
              },
              {
                name: "V2 Projects",
                color: "teal.6",
              },
              {
                name: "V3 Projects",
                color: "red.6",
              },
              {
                name: "CodeUp-Kids",
                color: "green.6",
              },
            ]}
            tickLine={"xy"}
            gridAxis={"xy"}
            withXAxis={true}
          />
        )}
        gqlQuery={DASHBOARD_PROJECTS}
        customVariables={{}}
      />
    </>
  );
}
