/**
 * packages/components/lpv4/OffersV4.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.2024
 *
 */

import * as React from "react";
import { Box, chakra, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import {
  FaBookOpen,
  FaBoxes,
  FaCheck,
  FaCheckSquare,
  FaCode,
  FaFileCode,
  FaLightbulb,
  FaProjectDiagram,
  FaTrophy,
} from "react-icons/fa";
import { FaMessage, FaRobot } from "react-icons/fa6";
import router from "next/router";

interface Offer {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

export default function OffersV4() {
  const offers: Offer[] = [
    {
      icon: <FaBookOpen />,
      title: "Kurse",
      description: "Videokurse zu den wichtigsten Themen für dich!",
      href: "/course",
    },
    {
      icon: <FaCheck />,
      title: "Zertifikate",
      description: "Zertifikate und Abschlüsse um dein Wissen zu bestätigen!",
      href: "/certificates",
    },
    {
      icon: <FaTrophy />,
      title: "Challenges",
      description: "Teste dein Wissen in spannenden Challenges!",
      href: "/challenges",
    },
    {
      icon: <FaCode />,
      title: "Editor",
      description: "Setze deine Projekte in die Tat um!",
      href: "/projects",
    },
    {
      icon: <FaCheckSquare />,
      title: "ToDos",
      description: "Plane deine Projekte bis ins kleinste Detail.",
      href: "/tasks",
    },
    {
      icon: <FaFileCode />,
      title: "Snippets",
      description: "Speichere hilfreiche Snippets.",
      href: "/tasks",
    },
    {
      icon: <FaLightbulb />,
      title: "Ideen",
      description: "Erhalte Ideen für interessante Projekte!",
      href: "/ideas",
    },
    {
      icon: <FaProjectDiagram />,
      title: "Flows",
      description: "Visualisiere Abläufe innerhalb deiner Apps.",
      href: "/planning",
    },
    {
      icon: <FaMessage />,
      title: "Forum",
      description:
        "Tausche dich mit anderen Entwicklern aus und erhalte Hilfe!",
      href: "/forum",
    },
    {
      icon: <FaRobot />,
      title: "KI-Assistent",
      description: "Bitte unseren KI-Assistenten um Hilfe!",
      href: "/ai",
    },
    {
      icon: <FaBoxes />,
      title: "Dashboard",
      description:
        "Behalte den Überblick über deinen Lernprozess und deine Projekte.",
      href: "/dashboard/v2",
    },
  ];

  return (
    <>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        direction={"column"}
      >
        <Text
          textTransform={"uppercase"}
          fontWeight={"bold"}
          color={"gray.200"}
          fontSize={"lg"}
        >
          Voller Funktionen
        </Text>
        <Heading
          size={"xl"}
          color={"white"}
          fontFamily={"Inter"}
          wordBreak={"break-word"}
          fontWeight={600}
          lineHeight={1.3}
          mt={4}
          p={2}
          textAlign={"center"}
        >
          Für dein bestes Erlebnis.
        </Heading>
      </Flex>
      <Flex
        w={"100%"}
        mt={8}
        paddingInline={{
          base: 2,
          lg: 24,
        }}
        justifyContent={"center"}
      >
        <Flex
          w={{
            base: "100%",
            sm: "90%",
            xl: "60%",
          }}
        >
          <Grid
            templateColumns={"repeat(auto-fit, minmax(300px, 1fr));"}
            gap={4}
            w={"100%"}
          >
            {offers.map((offer) => (
              <Box
                p={6}
                rounded={"2xl"}
                bg={"gray.800"}
                border={"1px solid"}
                borderColor={"gray.600"}
                cursor={"pointer"}
                _hover={{
                  borderColor: "gray.400",
                }}
                onClick={() => {
                  router.push(offer.href);
                }}
              >
                <Flex gap={4} direction={"column"}>
                  <Box
                    p={4}
                    backgroundColor={"gray.900"}
                    rounded={"md"}
                    w={"fit-content"}
                  >
                    <chakra.span fontSize={"2xl"} color={"brand.500"}>
                      {offer.icon}
                    </chakra.span>
                  </Box>
                  <Heading
                    size={"lg"}
                    color={"white"}
                    fontFamily={"Inter"}
                    wordBreak={"break-word"}
                    fontWeight={600}
                    lineHeight={1.3}
                  >
                    {offer.title}
                  </Heading>
                  <Text color={"gray.200"} fontSize={"lg"}>
                    {offer.description}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Grid>
        </Flex>
      </Flex>
    </>
  );
}
