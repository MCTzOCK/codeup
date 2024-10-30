/**
 * apps/observability/src/pages/app/applications/[id]/views.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.10.2024
 *
 */

import * as React from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Box, Container, em, Flex } from "@mantine/core";
import CardWithChart from "@/components/CardWithChart";
import {
  BarChart,
  BubbleChart,
  DonutChart,
  LineChart,
  PieChart,
} from "@mantine/charts";
import {
  MOST_VIEWED_PAGES,
  VIEWS_CHART,
  VIEWS_CHART_RES,
  VIEWS_CREATED,
} from "@/gql/queries";
import { useRouter } from "next/router";
import ViewTable from "@/components/ViewTable";

export default function Views() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const isTablet = useMediaQuery(`(max-width: ${em(1100)})`);

  const router = useRouter();
  const appId = router.query.id;

  return (
    <>
      <Flex align={"center"} justify={"center"} w={"100%"}>
        <Container
          style={{
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "90%",
          }}
          bg={"gray.9"}
          fluid
        >
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(1, 1fr)"
                : isTablet
                ? "repeat(2, 1fr)"
                : "repeat(3, 1fr)",
              gap: "1rem",
              overflow: "auto",
              width: "100%",
            }}
          >
            <CardWithChart
              title={"Views"}
              description={"Views of your application in the given time period"}
              renderContent={(data) => (
                <>
                  <b>{data.PageViewCount}</b> views have registered in
                  total.&nbsp;
                </>
              )}
              renderChart={(data) => (
                <>
                  <LineChart
                    pt={"lg"}
                    h={300}
                    data={data.PageViewChartCreated.map((item: any) => ({
                      Views: item.count,
                      date: item.id,
                    }))}
                    dataKey={"date"}
                    withLegend
                    series={[
                      {
                        name: "Views",
                        color: "blue.6",
                      },
                    ]}
                    tickLine={"xy"}
                    gridAxis={"xy"}
                    withXAxis={true}
                  />
                </>
              )}
              gqlQuery={VIEWS_CREATED}
              customVariables={{
                applicationId: appId,
              }}
            />
            <CardWithChart
              title={"Pages"}
              description={"Most viewed pages of your application"}
              renderContent={(data) => (
                <>
                  {data.PageViewChart.length > 0 ? (
                    <>
                      The most viewed page is&nbsp;
                      <b>
                        {
                          JSON.parse(JSON.stringify(data.PageViewChart)).sort(
                            // @ts-ignore
                            (a, b) => b.count - a.count
                          )[0]._id
                        }
                      </b>
                      &nbsp;with&nbsp;
                      <b>
                        {
                          JSON.parse(JSON.stringify(data.PageViewChart)).sort(
                            // @ts-ignore
                            (a, b) => b.count - a.count
                          )[0].count
                        }
                      </b>
                      &nbsp;views.
                    </>
                  ) : (
                    <>
                      There are no views registered yet. Please check back
                      later.
                    </>
                  )}
                </>
              )}
              noDate
              renderChart={(data) => (
                <>
                  <Flex align={"center"} w={"100%"} justify={"center"}>
                    <PieChart
                      withTooltip
                      tooltipDataSource={"segment"}
                      pt={"lg"}
                      size={210}
                      data={data.PageViewChart.map((item: any) => ({
                        name: item._id,
                        value: item.count,
                        color: getRandomMantineColor(),
                      }))}
                      withLabelsLine
                      labelsPosition={"outside"}
                      labelsType={"percent"}
                      withLabels
                    />
                  </Flex>
                </>
              )}
              gqlQuery={MOST_VIEWED_PAGES}
              customVariables={{
                applicationId: appId,
              }}
            />
            <CardWithChart
              noDate
              title={"Browser Usage"}
              description={"Browser usage of your users"}
              renderContent={(data) => (
                <>
                  See which browser your users are using to access your
                  application.
                </>
              )}
              renderChart={(data) => (
                <Flex align={"center"} w={"100%"} justify={"center"}>
                  <PieChart
                    withTooltip
                    tooltipDataSource={"segment"}
                    pt={"lg"}
                    size={210}
                    data={data.PageViewChart.map((item: any) => {
                      let c = "";

                      if (item._id.includes("Chrome")) {
                        c = "blue.6";
                      } else if (item._id.includes("Safari")) {
                        c = "green.6";
                      } else if (item._id.includes("Firefox")) {
                        c = "red.6";
                      } else if (item._id.includes("Edge")) {
                        c = "cyan.6";
                      } else if (item._id.includes("Opera")) {
                        c = "lime.6";
                      } else {
                        c = getRandomMantineColor();
                      }

                      return {
                        name: item._id,
                        value: item.count,
                        color: c,
                      };
                    })}
                    withLabelsLine
                    labelsPosition={"outside"}
                    labelsType={"percent"}
                    withLabels
                  />
                </Flex>
              )}
              gqlQuery={VIEWS_CHART}
              customVariables={{
                applicationId: appId,
                field: "browser",
              }}
            />
            <CardWithChart
              noDate
              title={"Operating Systems"}
              description={"Operating systems of your users"}
              renderContent={(data) => (
                <>
                  See which operating system your users are using to access your
                </>
              )}
              renderChart={(data) => (
                <Flex align={"center"} w={"100%"} justify={"center"}>
                  <BarChart
                    pt={"lg"}
                    h={300}
                    data={data.PageViewChart.map((item: any) => ({
                      OS: item.count,
                      os: item._id,
                    }))}
                    dataKey={"os"}
                    withLegend
                    series={[
                      {
                        name: "OS",
                        color: "green.6",
                      },
                    ]}
                    tickLine={"xy"}
                    gridAxis={"xy"}
                    withXAxis={true}
                  />
                </Flex>
              )}
              gqlQuery={VIEWS_CHART}
              customVariables={{
                applicationId: appId,
                field: "os",
              }}
            />
            <CardWithChart
              noDate
              title={"Language"}
              description={"Languages of your users"}
              renderContent={(data) => (
                <>
                  See which language your users are using to access your
                  application.
                </>
              )}
              renderChart={(data) => (
                <Flex align={"center"} w={"100%"} justify={"center"}>
                  <DonutChart
                    withTooltip
                    tooltipDataSource={"segment"}
                    pt={"lg"}
                    size={210}
                    data={data.PageViewChart.map((item: any) => {
                      let c = "";

                      if (item._id.includes("de")) {
                        c = "blue.6";
                      } else if (item._id.includes("en")) {
                        c = "green.6";
                      } else if (item._id.includes("fr")) {
                        c = "red.6";
                      } else if (item._id.includes("es")) {
                        c = "cyan.6";
                      } else if (item._id.includes("it")) {
                        c = "lime.6";
                      } else {
                        c = getRandomMantineColor();
                      }

                      return {
                        name: item._id,
                        value: item.count,
                        color: c,
                      };
                    })}
                    withLabelsLine
                    withLabels
                    thickness={30}
                  />
                </Flex>
              )}
              gqlQuery={VIEWS_CHART}
              customVariables={{
                applicationId: appId,
                field: "language",
              }}
            />
            <CardWithChart
              noDate
              title={"Screen"}
              description={"Screen Resolution and Viewport"}
              renderContent={(data) => (
                <>
                  See which screen resolution and viewport your users are using
                  to browse your website.
                </>
              )}
              renderChart={(data) => (
                <Flex
                  align={"center"}
                  w={"100%"}
                  justify={"center"}
                  pt={"lg"}
                  direction={"column"}
                  gap={"lg"}
                >
                  <BubbleChart
                    h={60}
                    data={data.screenResolution.map((item: any) => ({
                      resolution: item._id,
                      index: 1,
                      value: item.count,
                    }))}
                    range={[16, 225]}
                    label="Resolution"
                    color="lime.6"
                    dataKey={{ x: "resolution", y: "index", z: "value" }}
                  />
                  <BubbleChart
                    h={60}
                    data={data.screenResolution.map((item: any) => ({
                      viewport: item._id,
                      index: 1,
                      value: item.count,
                    }))}
                    range={[16, 225]}
                    label="Viewport"
                    color="red.6"
                    dataKey={{ x: "viewport", y: "index", z: "value" }}
                  />
                </Flex>
              )}
              gqlQuery={VIEWS_CHART_RES}
              customVariables={{
                applicationId: appId,
              }}
            />
            <ViewTable />
          </Box>
        </Container>
      </Flex>
    </>
  );
}

function getRandomMantineColor() {
  const colors = [
    "red.6",
    "pink.6",
    "grape.6",
    "violet.6",
    "indigo.6",
    "blue.6",
    "cyan.6",
    "teal.6",
    "green.6",
    "lime.6",
    "yellow.6",
    "orange.6",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
