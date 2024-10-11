/**
 * apps/web/src/global/mantine-components/adminDashboard/PlanningCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.10.2024
 *
 */

import * as React from "react";
import DashboardChartCard from "./DashboardChartCard";
import { BarChart, RadarChart } from "@mantine/charts";
import { DASHBOARD_PLANNING } from "../../../pages/admin-v2/queries";

export default function PlanningCard() {
  return (
    <>
      <DashboardChartCard
        title={"Planning"}
        description={
          "Overview of the different planning tools integrated into the system."
        }
        renderContent={(data) => <></>}
        noDate
        renderChart={(data) => (
          <RadarChart
            pt={"lg"}
            h={300}
            data={[
              {
                product: "Flows",
                Amount: data.ToDoProjectCount,
              },
              {
                product: "Issues",
                Amount: data.ProjectIssueCount,
              },
              {
                product: "Legacy ToDo",
                Amount: data.TodoCount,
              },
              {
                product: "ToDo",
                Amount: data.ToDoListV2Count,
              },
              {
                product: "ProjectFlows",
                Amount: data.ProjectFlowCount,
              },
            ]}
            dataKey={"product"}
            series={[
              {
                name: "Amount",
                color: "blue.6",
                opacity: 0.2,
              },
            ]}
            withPolarRadiusAxis
          />
        )}
        gqlQuery={DASHBOARD_PLANNING}
        customVariables={{}}
      />
    </>
  );
}
