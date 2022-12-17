/**
 * apps/web/src/pages/admin/analytics/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.11.2022
 *
 */

import * as React from "react";
import { useState } from "react";
import REST from "@codeup/rest";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Index() {
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title
  );
  const [summary, setSummary] = React.useState<{
    browsers: {
      // BROWSER: Percentage
      [key: string]: number;
    };
    os: {
      // OS: Percentage
      [key: string]: number;
    };
    paths: {
      // PATH: Percentage
      [key: string]: number;
    };
    // Logged in views percentage
    authenticatedViewPercentage: number;
    // Not logged in views percentage
    anonymousViewPercentage: number;
    // Total views
    totalViews: number;
  }>();

  const toast = useToast();
  const router = useRouter();

  const [periodOffset, setPeriodOffset] = useState(7);

  const [period, setPeriod] = React.useState<{
    start: string;
    end: string;
  }>({
    start: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  const [views, setViews] = useState<{
    [key: string]: number;
  }>();

  React.useEffect(() => {
    REST.Analytics.getSummary(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setSummary(res.payload.data);
        } else {
          toast({
            title: "Error",
            description:
              "An error occurred while loading the analytics summary",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    );
  }, []);

  React.useEffect(() => {
    const startDate = new Date(
      new Date().getTime() - periodOffset * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];
    const endDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    setPeriod({
      start: startDate,
      end: endDate,
    });

    REST.Analytics.getViews({
      token: localStorage.getItem("token") as string,
      periodStart: startDate,
      periodEnd: endDate,
    }).then((res) => {
      if (res.status === 200) {
        // extract every date from period
        const dates = [];

        const nStartDate = new Date(startDate);
        const nEndDate = new Date(endDate);

        while (nStartDate.getTime() <= nEndDate.getTime()) {
          dates.push(nStartDate.toISOString().split("T")[0]);
          nStartDate.setDate(nStartDate.getDate() + 1);
        }

        const _views: {
          [key: string]: number;
        } = {};

        for (let i = 0; i < dates.length; i++) {
          _views[dates[i]] = res.payload.data[i] ? res.payload.data[i] : 0;
        }

        setViews(_views);
        console.log(_views);
      } else {
        toast({
          title: "Error",
          description: res.payload.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    });
  }, [toast, periodOffset]);

  return (
    <>
      <Head>
        <title>Analytics - Admin - CodeUp</title>
      </Head>
      <AdminLayout>
        <Heading size={"2xl"} textAlign={"center"} mt={"4rem"}>
          Analytics
        </Heading>
        <Grid
          templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
          p={"2rem"}
          gap={"4rem"}
        >
          <GridItem>
            <Box>
              <Stack w={"100%"} h={"40vh"} alignItems={"center"}>
                <Heading size={"lg"} textAlign={"left"}>
                  Browsers (%)
                </Heading>
                <Pie
                  data={{
                    labels: Object.keys(summary?.browsers || {}),
                    datasets: [
                      {
                        label: "Browser",
                        data: Object.values(summary?.browsers || {}),
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                          "rgba(75, 192, 192, 0.2)",
                          "rgba(153, 102, 255, 0.2)",
                          "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                          "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </Stack>
            </Box>
          </GridItem>
          <GridItem>
            <Box>
              <Stack w={"100%"} h={"40vh"} alignItems={"center"}>
                <Heading size={"lg"} textAlign={"left"}>
                  Operating Systems (%)
                </Heading>
                <Pie
                  data={{
                    labels: Object.keys(summary?.os || {}),
                    datasets: [
                      {
                        label: "OS",
                        data: Object.values(summary?.os || {}),
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                          "rgba(75, 192, 192, 0.2)",
                          "rgba(153, 102, 255, 0.2)",
                          "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                          "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </Stack>
            </Box>
          </GridItem>
          <GridItem>
            <Box>
              <Stack w={"100%"} h={"40vh"} alignItems={"center"}>
                <Heading size={"lg"} textAlign={"left"}>
                  Views (%)
                </Heading>
                <Text>Total Views: {summary?.totalViews}</Text>
                <Pie
                  data={{
                    labels: ["Logged in", "Not logged in"],
                    datasets: [
                      {
                        label: "Views",
                        data: [
                          summary?.authenticatedViewPercentage,
                          summary?.anonymousViewPercentage,
                        ],
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </Stack>
            </Box>
          </GridItem>
          <GridItem>
            <Box>
              <Stack w={"100%"} h={"40vh"} alignItems={"center"}>
                <Heading size={"lg"} textAlign={"left"}>
                  Paths (%)
                </Heading>
                <Pie
                  data={{
                    labels: pathsToLabels(summary?.paths),
                    datasets: [
                      {
                        label: "Views",
                        data: pathsToData(summary?.paths),
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                          "rgba(75, 192, 192, 0.2)",
                          "rgba(153, 102, 255, 0.2)",
                          "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                          "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </Stack>
            </Box>
          </GridItem>
        </Grid>
        <Flex w={"100%"} alignItems={"center"} justifyContent={"center"}>
          <Box
            mt={"8rem"}
            maxW={["100%", "75%"]}
            flex={"100%"}
            maxH={"50vh"}
            mb={"8rem"}
          >
            <HStack>
              <Heading size={"lg"} textAlign={"left"}>
                Aufrufe / Tag
              </Heading>
              <Select
                value={periodOffset}
                onChange={(e) => {
                  // @ts-ignore
                  setPeriodOffset(e.target.value as number);
                }}
              >
                <option value={0}>Heute</option>
                <option value={7}>Eine Woche</option>
                <option value={14}>2 Wochen</option>
                <option value={30}>Ein Monat</option>
                <option value={90}>3 Monate</option>
                <option value={180}>6 Monate</option>
                <option value={365}>Ein Jahr</option>
              </Select>
            </HStack>

            <Bar
              data={{
                // extract every date from period.start to period.end
                labels: Array.from(
                  {
                    length:
                      (new Date(period.end).getTime() -
                        new Date(period.start).getTime()) /
                      (1000 * 60 * 60 * 24),
                  },
                  (_, i) => {
                    const date = new Date(
                      new Date(period.start).getTime() + i * 1000 * 60 * 60 * 24
                    );
                    return `${date.getDate()}.${
                      date.getMonth() + 1
                    }.${date.getFullYear()}`;
                  }
                ),
                datasets: [
                  {
                    label: "Aufrufe",
                    data: Array.from(
                      {
                        length:
                          (new Date(period.end).getTime() -
                            new Date(period.start).getTime()) /
                          (1000 * 60 * 60 * 24),
                      },
                      (_, i) => {
                        const date = new Date(
                          new Date(period.start).getTime() +
                            i * 1000 * 60 * 60 * 24
                        );

                        // "YEAR-MONTH-DAY"
                        const dateString = `${date.getFullYear()}-${
                          date.getMonth() + 1
                        }-${date.getDate()}`;

                        return views ? views[dateString] : 0;
                      }
                    ),
                    backgroundColor: "rgba(75, 192, 192, 1)",
                  },
                ],
              }}
            />
          </Box>
        </Flex>
        <Flex
          w={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          direction={"column"}
          gap={"4rem"}
          mb={"8rem"}
          mt={"8rem"}
        >
          <Heading size={"lg"} textAlign={"left"}>
            Daten löschen
          </Heading>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const deleteDataPeriodInput = (
                (e.target as HTMLFormElement).elements.namedItem(
                  "delete-data-period"
                ) as HTMLInputElement
              ).value as unknown as number;

              REST.Analytics.deleteAnalytics({
                token: localStorage.getItem("token") as string,
                periodStart: new Date(
                  new Date().getTime() -
                    deleteDataPeriodInput * 24 * 60 * 60 * 1000
                )
                  .toISOString()
                  .split("T")[0],
                periodEnd: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
              }).then((res) => {
                router.reload();
              });
            }}
          >
            <FormControl id={"delete-period"}>
              <FormLabel>Zeitraum</FormLabel>
              <Select name={"delete-data-period"} defaultValue={7}>
                <option value={0}>Heute</option>
                <option value={7}>Eine Woche</option>
                <option value={14}>2 Wochen</option>
                <option value={30}>Ein Monat</option>
                <option value={90}>3 Monate</option>
                <option value={180}>6 Monate</option>
                <option value={365}>Ein Jahr</option>
                <option value={420000}>Alles</option>
              </Select>
            </FormControl>
            <Button mt={"1rem"} colorScheme={"red"} type={"submit"}>
              Analytics löschen
            </Button>
          </form>
        </Flex>
      </AdminLayout>
    </>
  );
}

function pathsToLabels(_paths: any) {
  return Object.keys(_paths || {})
    .sort((a, b) => {
      return (_paths as any)[b] - (_paths as any)[a];
    })
    .slice(0, 5)
    .concat(["Other"]);
}

function pathsToData(_paths: any) {
  return Object.values(
    Object.fromEntries(
      Object.entries(_paths || {})
        // @ts-ignore
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .concat([
          [
            "Other",
            Object.keys(_paths || {})
              .sort((a, b) => {
                return (_paths as any)[b] - (_paths as any)[a];
              })
              .slice(5, Object.keys(_paths || {}).length)
              .map((e) => (_paths as any)[e])
              .reduce((a, b) => a + b, 0),
          ],
        ])
    )
  );
}
