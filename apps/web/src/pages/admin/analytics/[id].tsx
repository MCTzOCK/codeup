/**
 * apps/web/src/pages/admin/analytics/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.04.2023
 *
 */

import * as React from "react";
import AdminLayout from "@codeup/components/dist/admin/AdminLayout";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import { useRouter } from "next/router";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import {
  Box,
  Heading,
  Flex,
  Text,
  chakra,
  Grid,
  GridItem,
  Accordion,
  AccordionPanel,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Stack,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  InputGroup,
  InputLeftElement,
  Input,
  TableCaption,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
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
import { CHeading } from "@codeup/components/dist/global/CHeading";

export default function UserViewer() {
  const [user, setUser] = React.useState<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  }>();

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

  const [fullAnalytics, setFullAnalytics] = React.useState<
    {
      _id: string;
      loggedIn: boolean;
      userId: string;
      path: string;
      createdAt: string;
      browser: string;
      os: string;
      __v: number;
    }[]
  >([]);

  const [calculatedOverview, setCalculatedOverview] = React.useState<{
    first: {
      view: string;
      page: string;
      browser: string;
      os: string;
    };
    last: {
      view: string;
      page: string;
      browser: string;
      os: string;
    };
    totalViews: number;
    averageViewsPerDay: number;
  }>();

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

  const router = useRouter();
  const [filteredAnalytics, setFilteredAnalytics] = React.useState<
    {
      _id: string;
      loggedIn: boolean;
      userId: string;
      path: string;
      createdAt: string;
      browser: string;
      os: string;
      __v: number;
    }[]
  >([]);

  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (router && router.query && router.query.id) {
      REST.Account.getUserById(router.query.id as string).then(async (res) => {
        setUser(res.payload.user);

        const fullAnalyticsRes = await REST.Admin.getUserAnalytics({
          token: AccountManager.getActiveToken(),
          userId: router.query.id as string,
          detailed: true,
        });

        if (fullAnalyticsRes.status === 200) {
          setFullAnalytics(fullAnalyticsRes.payload.analytics);
          setFilteredAnalytics(fullAnalyticsRes.payload.analytics);
        }

        const calculatedOverviewRes = await REST.Admin.getUserAnalytics({
          token: AccountManager.getActiveToken(),
          userId: router.query.id as string,
          detailed: false,
        });

        if (calculatedOverviewRes.status === 200) {
          setCalculatedOverview(calculatedOverviewRes.payload as any);
        }

        const useSummaryRes = await REST.Analytics.getSummary(
          AccountManager.getActiveToken(),
          router.query.id as string
        );

        if (useSummaryRes.status === 200) {
          setSummary(useSummaryRes.payload.data);
        }

        setLoaded(true);
      });
    }
  }, [router]);

  return (
    <>
      <AdminLayout>
        <SuperText>Analytics</SuperText>
        {!loaded || !user ? (
          <>
            <AuthenticateLoadingIndicator
              text={"Informationen werden gesammelt..."}
            />
          </>
        ) : (
          <>
            <Box w={"100%"}>
              <Box m={4} p={4}>
                <Flex justifyContent={"center"} mt={4}>
                  <chakra.img
                    src={user.profilePicture}
                    alt={"Profilbild"}
                    borderRadius={"full"}
                    w={"100px"}
                    h={"100px"}
                  />
                </Flex>
                <Flex
                  justifyContent={"center"}
                  mt={4}
                  direction={"column"}
                  alignItems={"center"}
                >
                  <Heading>@{user.username}</Heading>
                  <Text>
                    {user.firstName} {user.lastName}
                  </Text>
                </Flex>
                {calculatedOverview && filteredAnalytics ? (
                  <>
                    <Flex
                      w={"100%"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <Grid
                        templateColumns={"repeat(2, 1fr)"}
                        gap={6}
                        mt={4}
                        p={4}
                        bg={"gray.900"}
                        borderRadius={"md"}
                        w={"50%"}
                      >
                        <GridItem>
                          <Heading size={"md"}>Erster Besuch</Heading>
                          <Text>
                            Am&nbsp;
                            {new Date(calculatedOverview.first.view)
                              .toLocaleString()
                              .replace(", ", " um ") + " Uhr"}
                          </Text>
                          <Text>
                            <code>{calculatedOverview.first.page}</code>{" "}
                            auf&nbsp;
                            {calculatedOverview.first.browser} mit&nbsp;
                            {calculatedOverview.first.os}
                          </Text>
                        </GridItem>
                        <GridItem>
                          <Heading size={"md"}>Letzter Besuch</Heading>
                          <Text>
                            Am&nbsp;
                            {new Date(calculatedOverview.last.view)
                              .toLocaleString()
                              .replace(", ", " um ") + " Uhr"}
                          </Text>
                          <Text>
                            <code>{calculatedOverview.last.page}</code>{" "}
                            auf&nbsp;
                            {calculatedOverview.last.browser} mit&nbsp;
                            {calculatedOverview.last.os}
                          </Text>
                        </GridItem>
                        <GridItem>
                          <Heading size={"md"}>Seitenaufrufe</Heading>
                          <Text>{calculatedOverview.totalViews}</Text>
                        </GridItem>
                        <GridItem>
                          <Heading size={"md"}>
                            &#216; Seitenaufrufe / Tag
                          </Heading>
                          <Text>
                            {Math.round(calculatedOverview.averageViewsPerDay)}
                          </Text>
                        </GridItem>
                      </Grid>
                    </Flex>
                    <Grid
                      templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
                      p={"2rem"}
                      gap={"4rem"}
                    >
                      <GridItem>
                        <Box
                          bg={"gray.900"}
                          rounded={["none", "lg"]}
                          h={"100%"}
                          p={6}
                        >
                          <CHeading size={"lg"}>Browser (%)</CHeading>
                          <Stack w={"100%"} h={"35vh"} alignItems={"center"}>
                            <Pie
                              data={{
                                labels: Object.keys(summary?.browsers || {}),
                                datasets: [
                                  {
                                    label: "Browser",
                                    data: Object.values(
                                      summary?.browsers || {}
                                    ),
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
                        <Box
                          bg={"gray.900"}
                          rounded={["none", "lg"]}
                          h={"100%"}
                          p={6}
                        >
                          <CHeading size={"lg"}>Betriebssysteme (%)</CHeading>
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
                        <Box
                          bg={"gray.900"}
                          rounded={["none", "lg"]}
                          h={"100%"}
                          p={6}
                        >
                          <CHeading size={"lg"}>Seiten (%)</CHeading>
                          <Stack w={"100%"} h={"35vh"} alignItems={"center"}>
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
                        <Box
                          bg={"gray.900"}
                          rounded={["none", "lg"]}
                          h={"100%"}
                          p={6}
                        >
                          <Accordion allowToggle mt={8} mb={4}>
                            <AccordionItem>
                              <AccordionButton>
                                <Box flex="1" textAlign="left">
                                  Alle Seitenaufrufe
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                              <AccordionPanel>
                                <InputGroup>
                                  <InputLeftElement>
                                    <FaSearch />
                                  </InputLeftElement>
                                  <Input
                                    placeholder={"Suche"}
                                    onChange={(e) => {
                                      const filter = e.target.value;

                                      setFilteredAnalytics(
                                        fullAnalytics.filter((a) => {
                                          if (filter === "") return true;
                                          return (
                                            a.path
                                              .toLowerCase()
                                              .includes(filter.toLowerCase()) ||
                                            a.browser
                                              .toLowerCase()
                                              .includes(filter.toLowerCase()) ||
                                            a.os
                                              .toLowerCase()
                                              .includes(filter.toLowerCase())
                                          );
                                        })
                                      );
                                    }}
                                  />
                                </InputGroup>
                                <TableContainer>
                                  <Table>
                                    <Thead>
                                      <Tr>
                                        <Th>Zeitpunkt</Th>
                                        <Th>Seite</Th>
                                        <Th>Browser</Th>
                                        <Th>Betriebssystem</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {filteredAnalytics
                                        .sort((a, b) => {
                                          return (
                                            new Date(b.createdAt).getTime() -
                                            new Date(a.createdAt).getTime()
                                          );
                                        })
                                        .map((analytics) => {
                                          return (
                                            <>
                                              <Tr>
                                                <Td>
                                                  {new Date(analytics.createdAt)
                                                    .toLocaleString()
                                                    .replace(", ", " um ") +
                                                    " Uhr"}
                                                </Td>
                                                <Td>
                                                  <code>{analytics.path}</code>
                                                </Td>
                                                <Td>{analytics.browser}</Td>
                                                <Td>{analytics.os}</Td>
                                              </Tr>
                                            </>
                                          );
                                        })}
                                    </Tbody>
                                    <TableCaption>
                                      {filteredAnalytics.length} Einträge
                                    </TableCaption>
                                  </Table>
                                </TableContainer>
                              </AccordionPanel>
                            </AccordionItem>
                          </Accordion>
                        </Box>
                      </GridItem>
                    </Grid>
                  </>
                ) : null}
              </Box>
            </Box>
          </>
        )}
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
