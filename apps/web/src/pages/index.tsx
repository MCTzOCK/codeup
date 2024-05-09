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
  Box,
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
import BrandStats from "@codeup/components/landingpagev2/BrandStats";
import Testimonials from "@codeup/components/landingpagev2/Testimonials";
import Milestones from "@codeup/components/landingpagev2/Milestones";

export default function Home() {
  const { loggedIn } = useLoggedIn();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>CodeUp - Einfach Programmieren lernen</title>
      </Head>
      <Box bg={"#000"}>
        <Flex w={"100%"} minH={"100vh"} h={"fit-content"} bg={"#000"}>
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
        <Testimonials />
        <BrandStats />
        <Milestones
          title={"Geschichte"}
          milestones={[
            {
              date: "Mai 2022",
              title: "Ideenfindung",
              description: `Die Idee für das Projekt wurde geboren. Es sollte eine Plattform werden, die es Einsteigern ermöglicht programmieren zu lernen.`,
            },
            {
              date: "6. Juni 2022",
              title: "Erster Commit",
              description: `Der erste Commit wurde auf GitHub gemacht. Das Projekt wurde von Ben Siebert ins Leben gerufen.`,
            },
            {
              date: "4. Juli 2022",
              title: "Umstieg auf Turborepo",
              description:
                "Das Projekt wurde auf Turborepo umgestellt, um die Entwicklung zu vereinfachen.",
            },
            {
              date: "16. Oktober 2022",
              title: "Admin Panel",
              description:
                "Fertigstellung der ersten Version des Admin Panels.",
            },
            {
              date: "27. November 2022",
              title: "Zertifikate",
              description:
                "Die Idee für das Erlangen von Zertifikaten wurde in die Realität umgesetzt.",
            },
            {
              date: "24. Feburar 2023",
              title: "Regionalwettbewerb",
              description:
                "CodeUp erhielt den ersten Preis beim Regionalwettbewerb Jugend Forscht der IHK in Münster in der Sparte Arbeitswelt.",
            },
            {
              date: "29. März 2023",
              title: "Landeswettbewerb",
              description:
                "CodeUp erhielt den ersten Preis beim Landeswettbewerb Jugend Forscht im Bundesland NRW in der Sparte Arbeitswelt.",
            },
            {
              date: "18. Mai 2023",
              title: "Bundeswettbewerb",
              description:
                "Beim 58. Bundeswettbewerb von Jugend forscht durfte CodeUp in der Sparte Arbeitswelt antreten.",
            },
            {
              date: "01. Juli 2023",
              title: "StartupTeens",
              description:
                "Bei der Bundesweiten Businessplan Challenge StartupTeens erhielt CodeUp den zweiten Preis in der Kategorie Education.",
            },
            {
              date: "06. Mai 2024",
              title: "Wiederaufnahme",
              description:
                "Am 06. Mai 2024 ging die Entwicklung von CodeUp nach einer längeren Pause wieder weiter.",
            },
          ]}
        />
      </Box>
    </>
  );
}
