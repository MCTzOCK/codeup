/**
 * apps/web/src/pages/admin/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.04.2023
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import Head from "next/head";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import {
  Heading,
  useToast,
  Box,
  Flex,
  Text,
  Button,
  Link,
  Icon,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  SimpleGrid,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import SuperText from "@codeup/components/dist/landingpage/SuperText";

export default function Index() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const [stats, setStats] = React.useState<{
    users: {
      count: number;
      admins: number;
      editors: number;
      newUsers: number;
    };
    orgs: {
      count: number;
      newOrgs: number;
    };
    projects: {
      count: number;
      newProjects: number;
      projectPages: number;
      publishedProjects: number;
    };
    forum: {
      profiles: number;
      newProfiles: number;
      posts: number;
      newPosts: number;
    };
    todo: {
      count: number;
      newTodos: number;
    };
    flowCharts: {
      count: number;
      newFlowCharts: number;
    };
  }>();

  const toast = useToast();

  React.useEffect(() => {
    REST.Admin.getOverview(AccountManager.getActiveToken()).then((res) => {
      if (res.status === 200) {
        setStats(res.payload as any);
      } else {
        toast({
          title: "Fehler",
          description: "Die Statistiken konnten nicht geladen werden.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>Admin - CodeUp</title>
      </Head>
      <AdminLayout>
        <Flex
          w={"100%"}
          minH={"100vh"}
          h={"fit-content"}
          alignItems={"center"}
          justifyContent={"center"}
          direction={"column"}
        >
          <SuperText>Dashboard</SuperText>
          <Flex w={"100%"} justifyContent={"center"}>
            <Flex
              p={4}
              textAlign={"center"}
              direction={"column"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Box mt={10}>
                <Heading as="h2" size="lg">
                  Generell
                </Heading>
                <Box mt={5}>
                  <Flex gap={8} alignItems={"center"} justifyContent={"center"}>
                    <Stat flex={"100%"}>
                      <StatLabel>Benutzer</StatLabel>
                      <StatNumber>{stats?.users.count}</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        {stats?.users.newUsers} neue Benutzer
                      </StatHelpText>
                    </Stat>
                    <Stat flex={"100%"}>
                      <StatLabel>Organisationen</StatLabel>
                      <StatNumber>{stats?.orgs.count}</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        {stats?.orgs.newOrgs} neue Organisationen
                      </StatHelpText>
                    </Stat>
                    <Stat flex={"100%"}>
                      <StatLabel>Projekte</StatLabel>
                      <StatNumber>{stats?.projects.count}</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        {stats?.projects.newProjects} neue Projekte
                      </StatHelpText>
                    </Stat>
                    <Stat flex={"100%"}>
                      <StatLabel>Projektseiten</StatLabel>
                      <StatNumber>{stats?.projects.projectPages}</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        {stats?.projects.publishedProjects} veröffentlichte
                        Projekte
                      </StatHelpText>
                    </Stat>
                  </Flex>
                </Box>
              </Box>
              <Box mt={10}>
                <Heading as="h2" size="lg">
                  Forum
                </Heading>
                <Box mt={5}>
                  <Flex gap={8} alignItems={"center"} justifyContent={"center"}>
                    <Stat flex={"100%"}>
                      <StatLabel>Profile</StatLabel>
                      <StatNumber>{stats?.forum.profiles}</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        {stats?.forum.newProfiles} neue Profile
                      </StatHelpText>
                    </Stat>
                    <Stat flex={"100%"}>
                      <StatLabel>Posts</StatLabel>
                      <StatNumber>{stats?.forum.posts}</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        {stats?.forum.newPosts} neue Posts
                      </StatHelpText>
                    </Stat>
                  </Flex>
                </Box>
              </Box>
              <Box mt={10}>
                <Heading as="h2" size="lg">
                  Planung
                </Heading>
                <Box mt={5}>
                  <Flex gap={8} alignItems={"center"} justifyContent={"center"}>
                    <Stat flex={"100%"}>
                      <StatLabel>ToDos</StatLabel>
                      <StatNumber>{stats?.todo.count}</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        {stats?.todo.newTodos} neue ToDos
                      </StatHelpText>
                    </Stat>
                    <Stat flex={"100%"}>
                      <StatLabel>FlowCharts</StatLabel>
                      <StatNumber>{stats?.flowCharts.count}</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        {stats?.flowCharts.newFlowCharts} neue FlowCharts
                      </StatHelpText>
                    </Stat>
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </AdminLayout>
    </>
  );
}
