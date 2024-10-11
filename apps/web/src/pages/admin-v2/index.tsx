/**
 * apps/web/src/pages/admin-v2/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.2024
 *
 */

import * as React from "react";
import { sProp } from "../../global/i18nstaticProps";
import {
  Button,
  Container,
  SimpleGrid,
  Title,
  Text,
  Group,
  Popover,
  ActionIcon,
} from "@mantine/core";
import AdminLayout from "../../global/mantine-components/AdminLayout";
import { useQuery } from "@apollo/client";
import {
  DASHBOARD_ANALYTICS,
  DASHBOARD_CONTACTS,
  DASHBOARD_PROJECTS,
  DASHBOARD_USERS,
} from "./queries";
import moment from "moment";
import { AreaChart, BarChart, LineChart } from "@mantine/charts";
import { FaCalendar } from "react-icons/fa";
import { DatePicker } from "@mantine/dates";
import UserCard from "../../global/mantine-components/adminDashboard/UserCard";
import DashboardChartCard from "../../global/mantine-components/adminDashboard/DashboardChartCard";
import DashboardCard from "../../global/mantine-components/adminDashboard/DashboardCard";
import { Table, Thead, Tr, Td, Th, Tbody } from "@chakra-ui/react";

export default function Index() {
  const {
    loading: analyticsLoading,
    error: analyticsError,
    data: analyticsData,
  } = useQuery(DASHBOARD_ANALYTICS, {
    variables: {
      startDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      interval: "day",
    },
  });

  return (
    <>
      <AdminLayout>
        <Container p={"lg"} fluid>
          <Title order={2}>Dashboard Overview</Title>
        </Container>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
          mb={"md"}
          p={"md"}
        >
          <UserCard />
          <DashboardChartCard
            title={"Reach"}
            description={
              "Overview over the analytics and the replayable sessions."
            }
            renderContent={(data) => (
              <>
                <b>{analyticsData.AnalyticsCount}</b> page views have been
                generated and <br />
                <b>{analyticsData.SessionReplayCount}</b> sessions have been
                recorded.
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
          />
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
          <DashboardCard
            title={"Contact Requests"}
            description={
              "Overview over the contact requests that may have to be answered."
            }
            renderContent={(data) => (
              <>
                <Text>
                  <b>{data.ContactCount}</b> contact requests have been
                  received. You can view them in the dedicated page.
                </Text>
                <Button
                  component={"a"}
                  href={"/admin-v2/contacts"}
                  fullWidth
                  mt={"md"}
                >
                  View Contact Requests
                </Button>
              </>
            )}
            gqlQuery={DASHBOARD_CONTACTS}
            customVariables={{}}
          />
        </SimpleGrid>
      </AdminLayout>
    </>
  );
}

Index.noLayout = true;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["admin-v2"])),
  };
}
