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
import { Button, Container, SimpleGrid, Title, Text } from "@mantine/core";
import AdminLayout from "../../global/mantine-components/AdminLayout";
import { useQuery } from "@apollo/client";
import { DASHBOARD_ANALYTICS, DASHBOARD_USERS } from "./queries";
import moment from "moment";
import { BarChart, LineChart } from "@mantine/charts";

export default function Index() {
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(DASHBOARD_USERS, {
    variables: {
      startDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      interval: "day",
    },
  });

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
          <Container
            p={"md"}
            fluid
            bg={"var(--mantine-color-dark-7)"}
            style={{
              borderRadius: "var(--mantine-radius-md)",
              width: "100%",
              height: "100%",
            }}
          >
            <Title order={3}>Users</Title>
            <Text size={"sm"} c={"dimmed"}>
              Overview over the users in the system and the history of creation.
            </Text>
            {userLoading || !userData ? (
              <Text>Loading...</Text>
            ) : (
              <>
                <Text>
                  <b>{userData.UserCount}</b> users have registered in total.
                </Text>
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
          </Container>
          <Container
            p={"md"}
            fluid
            bg={"var(--mantine-color-dark-7)"}
            style={{
              borderRadius: "var(--mantine-radius-md)",
              width: "100%",
              height: "100%",
            }}
          >
            <Title order={3}>Reach</Title>
            <Text size={"sm"} c={"dimmed"}>
              Overview over the analytics and the replayable sessions.
            </Text>
            {analyticsLoading || !analyticsData ? (
              <Text>Loading...</Text>
            ) : (
              <>
                <Text>
                  <b>{analyticsData.AnalyticsCount}</b> page views have been
                  generated and <br />
                  <b>{analyticsData.SessionReplayCount}</b> sessions have been
                  recorded.
                </Text>
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
              </>
            )}
          </Container>
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
