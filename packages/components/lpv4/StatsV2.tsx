/**
 * packages/components/lpv4/StatsV2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.07.2024
 *
 */

import * as React from "react";
import { ReactNode, useEffect } from "react";
import {
  Box,
  chakra,
  Flex,
  Grid,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaUser, FaVideo } from "react-icons/fa";
import { FaBox, FaSchool } from "react-icons/fa6";
import { useTranslation } from "next-i18next";

interface StatData {
  id: number;
  label: string;
  score: string | ReactNode;
}
export default function StatsV2() {
  const { t } = useTranslation("home");

  const [statData, setStatData] = React.useState<StatData[]>([]);
  useEffect(() => {
    fetch("/api/stats").then((res) => {
      res.json().then((data) => {
        setStatData([
          {
            id: 1,
            label: t("stats.users"),
            score: data.users,
          },
          {
            id: 2,
            label: t("stats.projects"),
            score: data.projects,
          },
          {
            id: 3,
            label: t("stats.lessons"),
            score: data.lessons,
          },
          {
            id: 4,
            label: t("stats.orgs"),
            score: data.orgs,
          },
        ]);
      });
    });
  }, []);

  return (
    <>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        direction={{
          base: "column",
          lg: "row",
        }}
        w={"100%"}
        paddingInline={{
          base: 2,
          lg: 24,
        }}
      >
        <Flex
          w={{
            base: "100%",
            sm: "90%",
            xl: "60%",
          }}
          alignItems={"center"}
          direction={{
            base: "column",
            lg: "row",
          }}
          gap={4}
        >
          <Box
            w={{
              base: "100%",
              sm: "90%",
              xl: "60%",
            }}
            flex={1}
          >
            <Flex gap={4} direction={"column"}>
              <Heading
                size={"xl"}
                color={"white"}
                fontFamily={"Inter"}
                wordBreak={"break-word"}
                fontWeight={600}
                lineHeight={1.3}
              >
                {t("stats.title")}
              </Heading>
              <Text color={"gray.200"} fontSize={"lg"}>
                {t("stats.text")}
              </Text>
            </Flex>
          </Box>
          <Grid
            templateColumns={"repeat(2, 1fr)"}
            w={{
              base: "100%",
              sm: "90%",
              xl: "60%",
            }}
            flex={1}
            gap={4}
          >
            {statData.map((data) => (
              <HStack
                key={data.id}
                bg={"gray.700"}
                p={5}
                rounded={"3xl"}
                textAlign={"center"}
                justifyContent={"space-between"}
              >
                <chakra.span fontSize={"4xl"} color={"brand.500"}>
                  {data.label === t("stats.users") ? (
                    <>
                      <FaUser />
                    </>
                  ) : data.label === t("stats.projects") ? (
                    <>
                      <FaBox />
                    </>
                  ) : data.label === t("stats.lessons") ? (
                    <>
                      <FaVideo />
                    </>
                  ) : (
                    <FaSchool />
                  )}
                </chakra.span>
                <Box>
                  <Text
                    fontWeight="extrabold"
                    fontSize="xx-large"
                    color={"brand.500"}
                    fontFamily={"Jetbrains Mono ExtraBold"}
                  >
                    {data.score}
                  </Text>
                  <Text fontSize="sm">{data.label}</Text>
                </Box>
              </HStack>
            ))}
          </Grid>
        </Flex>
      </Flex>
    </>
  );
}
