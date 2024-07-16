/**
 * apps/web/src/pages/dashboard/v2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.07.2024
 *
 */

import * as React from "react";
import Head from "next/head";
import {
  Avatar,
  Box,
  Button,
  chakra,
  Flex,
  Grid,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CHeading } from "@codeup/components/global/CHeading";
import DV2SCourses from "@codeup/components/dashboard/DV2SCourses";
import DV2SCertificates from "@codeup/components/dashboard/DV2SCertificates";
import DV2STasks from "@codeup/components/dashboard/DV2STasks";
import {
  useLoggedIn,
  useUserInfo,
  useUserLoggedInRedirect,
} from "@codeup/hooks";
import router from "next/router";
import { FaCogs } from "react-icons/fa";

export default function DashboardV2() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { userInfo, loggedIn, loaded } = useLoggedIn();

  return (
    <>
      <Head>
        <title>Dashboard - CodeUp</title>
      </Head>
      <Flex direction={"column"} bg={"#000"} h={"fit-content"} minH={"100vh"}>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(1, 1fr)",
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
          ]}
          gap={12}
          p={[6, 12]}
        >
          <Box bg={"gray.900"} rounded={"md"} p={4}>
            <CHeading size={"lg"}>Willkommen {userInfo.firstName}!</CHeading>
            <Stack spacing={4} pt={6}>
              <HStack gap={4}>
                <Avatar
                  bg={"gray.400"}
                  size={"lg"}
                  name={userInfo.username}
                  src={`/api/account/${userInfo.username}/picture`}
                />
                <VStack align={"start"}>
                  <CHeading size={"md"}>
                    {userInfo.firstName} {userInfo.lastName}
                  </CHeading>
                  <CHeading size={"md"} color={"gray.200"}>
                    @{userInfo.username}
                  </CHeading>
                </VStack>
              </HStack>
              <Text color={"gray.200"}>{userInfo.email}</Text>
              <Text>
                Du verfügt über die Rolle{" "}
                {userInfo.role === "admin" ? (
                  <chakra.span color={"red.500"} fontWeight={"bold"}>
                    ADMIN
                  </chakra.span>
                ) : userInfo.role === "editor" ? (
                  <chakra.span color={"blue.500"} fontWeight={"bold"}>
                    Creator
                  </chakra.span>
                ) : (
                  <chakra.span fontWeight={"bold"}>Nutzer</chakra.span>
                )}{" "}
                und das Abonnement{" "}
                {userInfo.subscription === "PRO" ? (
                  <chakra.span color={"brand.500"} fontWeight={"bold"}>
                    PRO
                  </chakra.span>
                ) : (
                  <chakra.span fontWeight={"bold"}>Kostenlos</chakra.span>
                )}
                .
              </Text>
              <Button
                variant={"brand"}
                size={"lg"}
                onClick={() => {
                  router.push("/account/settings");
                }}
                leftIcon={<FaCogs />}
                w={"fit-content"}
              >
                Account verwalten
              </Button>
            </Stack>
          </Box>
          <Box bg={"gray.900"} rounded={"md"} p={4}>
            <DV2SCourses />
          </Box>
          <Box bg={"gray.900"} rounded={"md"} p={4}>
            <DV2SCertificates />
          </Box>
          <Box bg={"gray.900"} rounded={"md"} p={4} overflow={"scroll"}>
            <DV2STasks />
          </Box>
        </Grid>
      </Flex>
    </>
  );
}
