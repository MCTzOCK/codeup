/**
 * apps/web/src/global/mantine-components/adminDashboard/ErrorsCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.10.2024
 *
 */

import * as React from "react";
import DashboardChartCard from "./DashboardChartCard";
import { AreaChart } from "@mantine/charts";
import { DASHBOARD_ERRORS } from "../../queries";

export default function ErrorsCard() {
  return (
    <>
      <DashboardChartCard
        title={"Errors"}
        description={"Overview over the errors that have been thrown."}
        renderContent={(data) => (
          <>
            <b>{data.ErrorModelCount}</b> errors have been thrown so far.
          </>
        )}
        renderChart={(data) => (
          <AreaChart
            pt={"lg"}
            h={300}
            data={
              data.ErrorModelCreatedChart.map((item: any) => ({
                Errors: item.count,
                date: item.id,
              })) || []
            }
            dataKey={"date"}
            withLegend
            series={[
              {
                name: "Errors",
                color: "red.6",
              },
            ]}
            tickLine={"xy"}
            gridAxis={"xy"}
            withXAxis={true}
          />
        )}
        gqlQuery={DASHBOARD_ERRORS}
        customVariables={{}}
        style={{
          gridColumn: "span 2",
        }}
        defaultSelectedTime={"two-week"}
      />
    </>
  );
}
