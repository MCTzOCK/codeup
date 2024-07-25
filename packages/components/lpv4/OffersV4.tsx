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
import { useTranslation } from "next-i18next";

interface Offer {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

export default function OffersV4() {
  const { t } = useTranslation("home");
  const offers: Offer[] = [
    {
      icon: <FaBookOpen />,
      title: t("functions.courses"),
      description: t("functions.courses.description"),
      href: "/course",
    },
    {
      icon: <FaCheck />,
      title: t("functions.certificates"),
      description: t("functions.certificates.description"),
      href: "/certificates",
    },
    {
      icon: <FaTrophy />,
      title: t("functions.challenges"),
      description: t("functions.challenges.description"),
      href: "/challenges",
    },
    {
      icon: <FaCode />,
      title: t("functions.editor"),
      description: t("functions.editor.description"),
      href: "/projects",
    },
    {
      icon: <FaCheckSquare />,
      title: t("functions.todo"),
      description: t("functions.todo.description"),
      href: "/tasks",
    },
    {
      icon: <FaFileCode />,
      title: t("functions.snippets"),
      description: t("functions.snippets.description"),
      href: "/tasks",
    },
    {
      icon: <FaLightbulb />,
      title: t("functions.ideas"),
      description: t("functions.ideas.description"),
      href: "/ideas",
    },
    {
      icon: <FaProjectDiagram />,
      title: t("functions.flows"),
      description: t("functions.flows.description"),
      href: "/planning",
    },
    {
      icon: <FaMessage />,
      title: t("functions.forum"),
      description: t("functions.forum.description"),
      href: "/forum",
    },
    {
      icon: <FaRobot />,
      title: t("functions.ai"),
      description: t("functions.ai.description"),
      href: "/ai",
    },
    {
      icon: <FaBoxes />,
      title: t("functions.dashboard"),
      description: t("functions.dashboard.description"),
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
          {t("functions")}
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
          {t("functions.title")}
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
