/**
 * apps/web/src/global/mantine-components/adminDashboard/LearningCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.10.2024
 *
 */

import * as React from "react";
import DashboardChartCard from "./DashboardChartCard";
import { AreaChart, BarChart, LineChart } from "@mantine/charts";
import { DASHBOARD_LEARNING } from "../../../pages/admin-v2/queries";

export default function LearningCard() {
  return (
    <>
      <DashboardChartCard
        title={"Learning Metrics"}
        description={"Overview over the learning progress on CodeUp."}
        renderContent={(data) => (
          <>
            <b>{data.CourseCount}</b> courses have been created so far with a
            total of&nbsp;
            <b>{data.ContentCount}</b> lessons.
            <br />
            <b>{data.CourseEnrollmentCount}</b> course enrollments have been
            made.
            <br />
            Out of all users <b>{data.ObtainedCertificateCount}</b> certificates
            have been obtained.
          </>
        )}
        renderChart={(data) => (
          <>
            <LineChart
              pt={"lg"}
              h={300}
              data={[
                ...data.CourseCreatedChart.map((item: any) => ({
                  date: item.id,
                  Courses: item.count,
                  Lessons: data.ContentCreatedChart.find(
                    (x: any) => x.id === item.id
                  )?.count,
                  "Course Enrollments": data.CourseEnrollmentCreatedChart.find(
                    (x: any) => x.id === item.id
                  )?.count,
                })),
              ]}
              curveType={"linear"}
              dataKey={"date"}
              withLegend
              series={[
                {
                  name: "Courses",
                  color: "blue.6",
                },
                {
                  name: "Lessons",
                  color: "red.6",
                },
                {
                  name: "Course Enrollments",
                  color: "green.6",
                },
              ]}
              tickLine={"xy"}
              gridAxis={"xy"}
              withXAxis={true}
            />
          </>
        )}
        gqlQuery={DASHBOARD_LEARNING}
        customVariables={{}}
      />
    </>
  );
}
