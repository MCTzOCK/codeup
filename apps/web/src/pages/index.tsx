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
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { motion, useScroll } from "framer-motion";
import Typed from "react-typed";
import { useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import Head from "next/head";
import OverviewSection from "@codeup/components/landingpage/OverviewSection";
import BrandStats from "@codeup/components/landingpagev2/BrandStats";
import Testimonials from "@codeup/components/landingpagev2/Testimonials";
import Milestones from "@codeup/components/landingpagev2/Milestones";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Home() {
  const { loggedIn } = useLoggedIn();
  const router = useRouter();

  const { t, i18n } = useTranslation("home");

  const { scrollYProgress } = useScroll();

  return (
    <>
      <Head>
        <title>CodeUp - Einfach Programmieren lernen</title>
      </Head>
      <Flex
        w={"100%"}
        minH={"100vh"}
        h={"fit-content"}
        bg={"transparent"}
        overflow={"hidden"}
      >
        <img
          // src={"/_static/images/software-developer-6521720_1920.jpg"}
          src={"/_static/images/sf-developer.jpg"}
          alt={""}
          className={"index-header-image"}
        />
        <Flex
          w={"100%"}
          h={"fit-content"}
          p={[5, 10, 20]}
          direction={["column", "column", "row"]}
          alignItems={"center"}
          minH={"100vh"}
          overflow={"hidden"}
        >
          <Flex
            flex={["100%", "100%", "100%"]}
            alignItems={"center"}
            w={"100%"}
            justifyContent={"center"}
            zIndex={2}
          >
            <Flex gap={2} pt={10} direction={"column"}>
              <Heading
                as={"h3"}
                fontSize={["2xl", "3xl", "4xl"]}
                color={"gray.300"}
                fontFamily={"Geist Black"}
                fontWeight={1000}
                //letterSpacing={-2}
              >
                CodeUp
              </Heading>
              <Heading
                as={"h1"}
                fontSize={["4xl", "5xl", "8xl"]}
                fontWeight={900}
                //fontFamily={"Jetbrains Mono ExtraBold"}
                color={"brand.500"}
              >
                Programmieren lernen
              </Heading>
              <Text
                fontWeight={[400, 400, 100]}
                fontSize={["xl", "2xl", "4xl"]}
                maxW={["100%", "100%", "60%"]}
              >
                Von der ersten Zeile Code bis zum eigenen Projekt. Wir
                unterstützen dich auf deinem Weg mit allem was du brauchst.
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
                      router.push("/dashboard/v2");
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
        </Flex>
      </Flex>

      <Box
        bg={
          "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95), #000)"
          //"linear-gradient(to bottom, transparent, #000)"
          //"linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.083) 8.33%, rgba(0, 0, 0, 0.167) 16.67%, rgba(0, 0, 0, 0.25) 25%, rgba(0, 0, 0, 0.333) 33.33%, rgba(0, 0, 0, 0.417) 41.67%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.583) 58.33%, rgba(0, 0, 0, 0.667) 66.67%, rgba(0, 0, 0, 0.75) 75%, rgba(0, 0, 0, 0.83) 83.33%, rgba(0, 0, 0, 0.91) 91.67% 100%)"
        }
      >
        <Testimonials />
        <BrandStats />
        <img
          src={"/_static/images/software-developer-6521720_1920.jpg"}
          alt={""}
          className={"index-header-image ihi-rot"}
        />
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "de", [
        "base",
        "navbar",
        "home",
      ])),
    },
  };
}
