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
  Text,
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
      <Flex w={"100%"} minH={"100vh"} h={"fit-content"} bg={"#000"}>
        <div
          id={"bg-image-home-wrapper-01"}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: -1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            background: "black",
            filter: "blur(5px)",
          }}
        >
          <Image
            src={"/_static/images/hyperspace.png"}
            w={"100%"}
            h={"100%"}
            minH={"100vh"}
            overflow={"hidden"}
            objectFit={"cover"}
          />
        </div>
        <Flex
          w={"100%"}
          h={"fit-content"}
          p={[5, 10, 20]}
          direction={["column", "column", "row"]}
          alignItems={"center"}
          minH={"100vh"}
          zIndex={2}
        >
          <Flex
            flex={["100%", "100%", "100%"]}
            alignItems={"center"}
            w={"100%"}
            justifyContent={"center"}
          >
            <Flex gap={2} pt={10} direction={"column"}>
              <Heading
                as={"h3"}
                fontSize={["2xl", "3xl", "4xl"]}
                color={"gray.300"}
                fontWeight={1000}
                letterSpacing={-2}
              >
                CodeUp
              </Heading>
              <Heading
                as={"h1"}
                fontSize={["4xl", "5xl", "8xl"]}
                fontWeight={900}
                letterSpacing={-2}
                fontFamily={"Jetbrains Mono ExtraBold"}
                color={"brand.500"}
              >
                Programmieren lernen
              </Heading>
              <Text fontWeight={100} fontSize={["xl", "2xl", "4xl"]}>
                Lerne mit interaktiven Videokursen.
                <br />
                Plane anstehende Projekte bis ins Detail.
                <br />
                Tausche dich mit anderen Entwicklern aus.
                <br />
                Setze deine Ideen in die Tat um.
                <br />
                Erhalte Feedback der Community.
              </Text>
              <ButtonGroup spacing={4} mt={2}>
                <Button
                  rounded={"md"}
                  variant={"brand"}
                  fontSize={"xl"}
                  size={"lg"}
                  color={"black"}
                  onClick={() => {
                    if (loggedIn) {
                      router.push("/dashboard");
                    } else {
                      window.dispatchEvent(
                        new CustomEvent("codeup::open_login")
                      );
                    }
                  }}
                >
                  {loggedIn ? "Dashboard" : "Jetzt starten"}
                </Button>
              </ButtonGroup>
            </Flex>
          </Flex>
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            w={"100%"}
            h={"100%"}
          >
            <Image
              src={"/_static/images/software-developer-6521720_1920.jpg"}
              alt={"Software Developer"}
              w={"100%"}
              h={"100%"}
              objectFit={"cover"}
              objectPosition={"center"}
              borderRadius={"lg"}
              maxW={["400px", "500px", "1000px"]}
              shadow={"xl"}
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
