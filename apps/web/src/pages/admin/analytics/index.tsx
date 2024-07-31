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
  Avatar,
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
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
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
import SuperText from "@codeup/components/landingpage/SuperText";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../../global/i18nstaticProps";

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
    todayActiveUsers: {
      username: string;
      views: string;
      userId: string;
    }[];
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
        <SuperText>Analytics</SuperText>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
          maxW={"100%"}
          overflow={"hidden"}
          gap={[0, "4rem"]}
          p={[0, "2rem"]}
        >
          <GridItem>
            <Box bg={"gray.900"} rounded={["none", "lg"]} h={"100%"} p={6}>
              <CHeading size={"lg"}>Browsers (%)</CHeading>
              <Stack w={"100%"} h={"35vh"} alignItems={"center"}>
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
            <Box bg={"gray.900"} rounded={["none", "lg"]} h={"100%"} p={6}>
              <CHeading size={"lg"}>Operating Systems (%)</CHeading>
              <Stack w={"100%"} h={"35vh"} alignItems={"center"}>
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
            <Box bg={"gray.900"} rounded={["none", "lg"]} h={"100%"} p={6}>
              <CHeading size={"lg"}>Views (%)</CHeading>
              <Text>Total Views: {summary?.totalViews}</Text>
              <Stack w={"100%"} h={"35vh"} alignItems={"center"}>
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
            <Box bg={"gray.900"} rounded={["none", "lg"]} h={"100%"} p={6}>
              <CHeading size={"lg"}>Paths (%)</CHeading>
              <Stack w={"100%"} h={"40vh"} alignItems={"center"}>
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
          <GridItem>
            <Box bg={"gray.900"} rounded={["none", "lg"]} h={"100%"} p={6}>
              <HStack gap={6}>
                <CHeading size={"lg"}>Aufrufe (Historie)</CHeading>
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
              <Stack w={"100%"} h={"40vh"} alignItems={"center"}>
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
                          new Date(period.start).getTime() +
                            i * 1000 * 60 * 60 * 24
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

                            const parts = dateString.split("-");

                            if (parts[0].length === 1) {
                              parts[0] = "0" + parts[0];
                            }

                            if (parts[1].length === 1) {
                              parts[1] = "0" + parts[1];
                            }

                            if (parts[2].length === 1) {
                              parts[2] = "0" + parts[2];
                            }

                            return views ? views[parts.join("-")] : 0;
                          }
                        ),
                        backgroundColor: "rgba(75, 192, 192, 1)",
                      },
                    ],
                  }}
                />
              </Stack>
            </Box>
          </GridItem>
          <GridItem>
            <Box bg={"gray.900"} rounded={["none", "lg"]} h={"100%"} p={6}>
              <CHeading size={"lg"}>Aktive Nutzer (24h)</CHeading>
              <Stack
                w={"100%"}
                h={"40vh"}
                alignItems={"center"}
                overflow={"auto"}
              >
                <TableContainer mt={6} w={"100%"}>
                  <Table>
                    <Thead>
                      <Th>Profilbild</Th>
                      <Th>Benutername</Th>
                      <Th>Aufrufe</Th>
                    </Thead>
                    <Tbody>
                      {summary?.todayActiveUsers.map((user) => (
                        <Tr
                          key={user.userId}
                          _hover={{
                            backgroundColor: "gray.700",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            router.push(`/admin/analytics/${user.userId}`);
                          }}
                        >
                          <Td>
                            <Avatar
                              size={"lg"}
                              src={`/api/account/${user.username}/picture`}
                            />
                          </Td>
                          <Td>@{user.username}</Td>
                          <Td>{user.views}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            </Box>
          </GridItem>
          <GridItem>
            <Box bg={"gray.900"} rounded={["none", "lg"]} h={"100%"} p={6}>
              <CHeading size={"lg"}>Daten löschen</CHeading>
              <Text>
                Du kannst die Analylse Daten für einen bestimmten Zeitraum
                löschen. Diese können allerdings nicht wiederhergestellt werden.
              </Text>

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
                    periodEnd: new Date(
                      new Date().getTime() + 24 * 60 * 60 * 1000
                    )
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
            </Box>
          </GridItem>
        </Grid>
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, [])),
  };
}
