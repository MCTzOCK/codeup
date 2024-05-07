"use client";

/**
 * apps/web/src/pages/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.12.2022
 *
 */

import * as React from "react";

import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Image,
  Stack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Typed from "react-typed";
import { useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import Head from "next/head";
import OverviewSection from "@codeup/components/landingpage/OverviewSection";
import BrandStats from "@codeup/components/landingpage/BrandStats";
import Testimonials from "@codeup/components/landingpage/Testimonials";
import Milestones from "@codeup/components/landingpage/Milestones";

export default function Home() {
  const { loggedIn } = useLoggedIn();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>CodeUp - Einfach Programmieren lernen</title>
      </Head>
      <Flex
        w={"100%"}
        minH={"100vh"}
        h={"fit-content"}
        justifyContent={"center"}
      >
        <Stack mt={32}>
          <Heading
            fontSize={["4xl", "4xl", "8xl"]}
            fontWeight={800}
            fontFamily={"Inter"}
          >
            Lernen.
          </Heading>
          <Heading
            fontSize={["4xl", "4xl", "8xl"]}
            fontWeight={800}
            fontFamily={"Inter"}
          >
            Planen.
          </Heading>
          <Heading
            fontSize={["4xl", "4xl", "8xl"]}
            fontWeight={800}
            fontFamily={"Inter"}
          >
            Umsetzen.
          </Heading>
        </Stack>
      </Flex>
    </>
  );
}
