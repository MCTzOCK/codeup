/**
 * apps/observability/src/pages/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.10.2024
 *
 */

import * as React from "react";
import {
  Box,
  Container,
  Flex,
  Text,
  Title,
  factory,
  Button,
  Badge,
  em,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { FaChevronRight } from "react-icons/fa6";

export default function Index() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <>
      <Box
        w={"100%"}
        h={"fit-content"}
        style={{
          minHeight: "100vh",
          backgroundColor: "#02060e",
        }}
      >
        <Flex w={"100%"} align={"center"} justify={"center"} pt={120} pb={60}>
          <Container size={"xl"} flex={"100%"}>
            <Flex align={"center"} justify={"center"}>
              <Badge size={"xl"} mb={"md"} radius={"md"} variant={"gradient"}>
                BETA
              </Badge>
            </Flex>
            <Title
              order={1}
              ta={"center"}
              c={"white"}
              size={isMobile ? 50 : 70}
              fw={900}
            >
              Analytics that{" "}
              <span
                style={{
                  color: "var(--mantine-color-blue-8)",
                }}
              >
                Elevate
              </span>{" "}
              Your Business
            </Title>
            <Container size={"md"}>
              <Text
                ta={"center"}
                c={"gray"}
                style={{
                  fontSize: "1.8rem",
                }}
                mt={"lg"}
              >
                CodeUp Observability provides insights into your web-apps,
                helping your make data-driven decisions. The session replay
                feature allows you to see exactly what your users are doing on
                your website.
              </Text>
            </Container>
            <Flex align={"center"} justify={"center"} gap={"md"} mt={"xl"}>
              <Button
                color={"blue"}
                radius={"md"}
                size={"lg"}
                rightSection={<FaChevronRight />}
                component={"a"}
                href={"/app"}
              >
                Start now
              </Button>
              <Button
                color={"blue"}
                radius={"md"}
                variant={"outline"}
                size={"lg"}
              >
                Demo
              </Button>
            </Flex>
          </Container>
        </Flex>
        <Flex
          w={"100%"}
          p={"xl"}
          direction={isMobile ? "column" : "row"}
          align={"center"}
          justify={"center"}
          gap={"xl"}
          style={{
            backgroundColor: "#0a0f1e",
            color: "white",
          }}
        >
          <Box>
            <Title order={2} size={isMobile ? 40 : 50} fw={800}>
              Powerful Dashboard
            </Title>
            <Text
              style={{
                fontSize: "1.8rem",
              }}
              mt={"lg"}
            >
              Our dashboard provides you with a complete overview of your
              website. You can see the number of visitors, the most visited
              pages and much more.
            </Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
