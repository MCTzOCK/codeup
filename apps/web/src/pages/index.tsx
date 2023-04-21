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
          height={"100vh"}
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
            color={"brand"}
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
                bg={"brand"}
                color={"black"}
                _hover={{
                  bg: "brand",
                  color: "black",
                }}
                _focus={{
                  bg: "brand",
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
      <Stack mt={4} bgColor={"black"}>
        <OverviewSection />
        <Flex
          w={"100%"}
          alignItems={"center"}
          bgColor={"transparent"}
          justifyContent={"center"}
        >
          <Testimonials />
        </Flex>
        <Flex w={"100%"} alignItems={"center"} bgColor={"transparent"}>
          <BrandStats />
        </Flex>
        <Flex w={"100%"} alignItems={"center"} bgColor={"transparent"}>
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
            ]}
          />
        </Flex>
      </Stack>
    </>
  );
}
