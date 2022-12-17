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
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/card";
import { motion } from "framer-motion";
import Typed from "react-typed";
import { useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import Head from "next/head";
import { Title } from "chart.js";

export default function Index() {
  const { loggedIn } = useLoggedIn();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>CodeUp - Einfach Programmieren lernen</title>
      </Head>
      <Flex
        flexDirection="column"
        height="100vh"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Image
          src={"/_static/images/software-developer-6521720_1920.jpg"}
          width={"100%"}
          height={"100%"}
          objectFit={"cover"}
          position={"absolute"}
          zIndex={-1}
          filter={"blur(10px)"}
          alt={""}
        />

        <Stack textAlign={["center", "left"]} w={"fit-content"} spacing={6}>
          <Heading
            as="h1"
            fontSize={["lg", "2xl"]}
            fontFamily="ARCADE"
            color="white"
            fontStyle="italic"
          >
            <Typed
              strings={["// Willkommen bei"]}
              typeSpeed={40}
              showCursor={false}
            />
          </Heading>
          <Heading
            as="h1"
            fontSize={["4xl", "8xl"]}
            fontFamily="ARCADE"
            color={"#F7DE1F"}
          >
            <Typed
              strings={["CodeUp"]}
              typeSpeed={50}
              startDelay={1500}
              showCursor={false}
            />
          </Heading>
          <Heading
            as="h1"
            fontSize={["lg", "2xl"]}
            fontFamily="ARCADE"
            color="white"
            fontStyle="italic"
          >
            <Typed
              strings={["// Dein Weg zum Programmierer"]}
              typeSpeed={40}
              startDelay={2500}
              showCursor={false}
            />
          </Heading>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5 }}
          >
            <ButtonGroup w={"100%"} justifyContent={["center", "right"]}>
              <Button
                bg={"#F7DE1F"}
                color={"black"}
                _hover={{
                  bg: "#F7DE1F",
                  color: "black",
                }}
                _focus={{
                  bg: "#F7DE1F",
                  color: "black",
                }}
                size={"lg"}
                onClick={() => {
                  if (loggedIn) {
                    router.push("/dashboard");
                  } else {
                    window.dispatchEvent(new CustomEvent("codeup::open_login"));
                  }
                }}
              >
                {loggedIn ? "Zum Dashboard" : "Jetzt loslegen"}
              </Button>
            </ButtonGroup>
          </motion.div>
        </Stack>
      </Flex>
    </>
  );
}
