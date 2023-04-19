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
import { ReactElement, useState } from "react";
import { useLoggedIn } from "@codeup/hooks";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import Head from "next/head";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
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
import {
  FaBook,
  FaBookmark,
  FaBookOpen,
  FaCertificate,
  FaChartBar,
  FaCheck,
  FaChild,
  FaCode,
  FaComment,
  FaLaptopCode,
  FaLink,
  FaNewspaper,
  FaPeopleArrows,
  FaProjectDiagram,
  FaRocket,
  FaSitemap,
  FaUser,
} from "react-icons/fa";

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
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const [views, setViews] = useState<number>(0);

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
      projectFunctions: number;
    };
    forum: {
      profiles: number;
      newProfiles: number;
      posts: number;
      newPosts: number;
    };
    todo: {
      count: number;
    };
    flowCharts: {
      count: number;
    };
    newsletterMembers: number;
    certificates: number;
    kids: number;
    contactMessages: number;
    ideProjects: number;
    roadmaps: number;
    snippets: number;
    courses: number;
    lessons: number;
    shorts: number;
  }>();
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
    REST.Analytics.getSummary(AccountManager.getActiveToken()).then((res) => {
      if (res.status === 200) {
        setViews(res.payload.data.totalViews);
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

  const toast = useToast();

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
          direction={"column"}
          mt={8}
        >
          <SuperText>Dashboard</SuperText>
          <Stack>
            <Heading p={8} pb={0}>
              Generell
            </Heading>

            <Grid
              templateColumns={[
                "repeat(1, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
              ]}
              gap={8}
              p={8}
              maxW={"100%"}
            >
              <DashCard
                icon={<FaChartBar />}
                title={"Aufrufe"}
                number={views!.toString() as string}
                color={"orange.400"}
              />
              <DashCard
                icon={<FaComment />}
                title={"kontaktanfragen"}
                number={stats?.contactMessages!.toString() as string}
                color={"orange.400"}
              />
              <DashCard
                icon={<FaLink />}
                title={"shorts"}
                number={stats?.shorts!.toString() as string}
                color={"orange.400"}
              />
            </Grid>

            <Heading p={8} pb={0}>
              Benutzer
            </Heading>

            <Grid
              templateColumns={[
                "repeat(1, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
              ]}
              gap={8}
              p={8}
              maxW={"100%"}
            >
              <DashCard
                icon={<FaUser />}
                title={"benutzer"}
                number={stats?.users.count!.toString() as string}
                subtitle={`${stats?.users.newUsers} neue Benutzer`}
                color={"green.300"}
              />
              <DashCard
                icon={<FaNewspaper />}
                title={"newsletter"}
                number={stats?.newsletterMembers!.toString() as string}
                color={"green.300"}
              />
              <DashCard
                icon={<FaSitemap />}
                title={"organisationen"}
                number={stats?.orgs.count!.toString() as string}
                subtitle={`${stats?.orgs.newOrgs} neue Organisationen`}
                color={"green.300"} // purple.300
              />
            </Grid>

            <Heading p={8} pb={0}>
              Entwicklung
            </Heading>

            <Grid
              templateColumns={[
                "repeat(1, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
              ]}
              gap={8}
              p={8}
              maxW={"100%"}
            >
              <DashCard
                icon={<FaCode />}
                title={"projekte"}
                number={stats?.projects.count!.toString() as string}
                subtitle={`${stats?.projects.newProjects} neue Projekte`}
                color={"red.300"}
              />
              <DashCard
                icon={<FaCode />}
                title={"projektseiten"}
                number={stats?.projects.projectPages!.toString() as string}
                subtitle={`${stats?.projects.projectFunctions} Funktionen`}
                color={"red.300"}
              />
              <DashCard
                icon={<FaRocket />}
                title={"roadmaps"}
                number={stats?.roadmaps!.toString() as string}
                color={"red.300"}
              />
              <DashCard
                icon={<FaLaptopCode />}
                title={"snippets"}
                number={stats?.snippets!.toString() as string}
                color={"red.300"}
              />
              <DashCard
                icon={<FaChild />}
                title={"kids"}
                number={stats?.kids!.toString() as string}
                color={"red.300"}
              />
              <DashCard
                icon={<FaCode />}
                title={"legacy projekte"}
                number={stats?.ideProjects!.toString() as string}
                color={"red.300"}
              />
            </Grid>

            <Heading p={8} pb={0}>
              Austausch
            </Heading>

            <Grid
              templateColumns={[
                "repeat(1, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
              ]}
              gap={8}
              p={8}
              maxW={"100%"}
            >
              <DashCard
                icon={<FaPeopleArrows />}
                title={"profile"}
                number={stats?.forum.profiles!.toString() as string}
                subtitle={`${stats?.forum.newProfiles} neue Profile`}
                color={"pink.400"}
              />
              <DashCard
                icon={<FaComment />}
                title={"posts"}
                number={stats?.forum.posts!.toString() as string}
                subtitle={`${stats?.forum.newPosts} neue Posts`}
                color={"pink.400"}
              />
            </Grid>

            <Heading p={8} pb={0}>
              Planung
            </Heading>

            <Grid
              templateColumns={[
                "repeat(1, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
              ]}
              gap={8}
              p={8}
              maxW={"100%"}
            >
              <DashCard
                icon={<FaCheck />}
                title={"todos"}
                number={stats?.todo.count!.toString() as string}
                color={"blue.400"}
              />
              <DashCard
                icon={<FaProjectDiagram />}
                title={"flows"}
                number={stats?.flowCharts.count!.toString() as string}
                color={"blue.400"}
              />
            </Grid>

            <Heading p={8} pb={0}>
              Lernen
            </Heading>

            <Grid
              templateColumns={[
                "repeat(1, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
              ]}
              gap={8}
              p={8}
              maxW={"100%"}
            >
              <DashCard
                icon={<FaBook />}
                title={"kurse"}
                number={stats?.courses!.toString() as string}
                color={"teal.600"}
              />
              <DashCard
                icon={<FaBookmark />}
                title={"lektionen"}
                number={stats?.lessons!.toString() as string}
                color={"teal.600"}
              />
              <DashCard
                icon={<FaCertificate />}
                title={"zertifikate"}
                number={stats?.certificates!.toString() as string}
                color={"teal.600"}
              />
            </Grid>
          </Stack>
        </Flex>
      </AdminLayout>
    </>
  );
}

const DashCard = (props: {
  icon: ReactElement;
  title: string;
  number: string;
  subtitle?: string;
  color: string;
}) => {
  return (
    <>
      <Box
        h={"100%"}
        w={"100%"}
        boxShadow={"xl"}
        backgroundColor={props.color}
        rounded={"xl"}
        maxW={"600px"}
        minW={"fit-content"}
      >
        <HStack>
          <Heading size={"2xl"} p={8}>
            {props.icon}
          </Heading>
          <Box borderLeft={"3px dashed black"} pl={8} pt={4} pb={4} pr={4}>
            <Text
              fontSize={"md"}
              textAlign={"left"}
              color={"gray.600"}
              fontWeight={"extrabold"}
            >
              {props.title.toUpperCase()}
            </Text>
            <Heading size={"xl"} color={"white"}>
              {props.number}
            </Heading>

            {props.subtitle && (
              <>
                <Text
                  fontSize={"md"}
                  textAlign={"left"}
                  color={"gray.600"}
                  fontWeight={"extrabold"}
                >
                  {props.subtitle}
                </Text>
              </>
            )}
          </Box>
        </HStack>
      </Box>
    </>
  );
};
