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
  Image,
  Anchor,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { FaChevronRight } from "react-icons/fa6";
import { modals } from "@mantine/modals";
import { FaExternalLinkAlt } from "react-icons/fa";

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
        <Flex w={"100%"} align={"center"} justify={"center"} pb={60} pt={60}>
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
          <Box
            flex={"100%"}
            style={{
              maxWidth: isMobile ? "98vw" : "30vw",
            }}
          >
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
              pages and much more. You can even see the screen resolution of
              your users and look at every page view ever registered
              individually.
            </Text>
            <Button
              color={"blue"}
              radius={"md"}
              size={"lg"}
              variant={"filled"}
              rightSection={<FaChevronRight />}
              component={"a"}
              href={"/app"}
              mt={"xl"}
            >
              Start now
            </Button>
          </Box>
          <Box
            flex={"100%"}
            style={{
              maxWidth: isMobile ? "100vw" : "40vw",
            }}
          >
            <Image
              src={"/dashboard_analytics.png"}
              onClick={() => {
                openImageModal(
                  "Analytics Dashboard",
                  "/dashboard_analytics.png"
                );
              }}
              style={{
                cursor: "pointer",
              }}
            />
          </Box>
        </Flex>
        <Flex
          w={"100%"}
          p={"xl"}
          direction={isMobile ? "column" : "row-reverse"}
          align={"center"}
          justify={"center"}
          gap={"xl"}
          style={{
            backgroundColor: "#0a0f1e",
            color: "white",
          }}
        >
          <Box
            flex={"100%"}
            style={{
              maxWidth: isMobile ? "98vw" : "30vw",
            }}
          >
            <Title order={2} size={isMobile ? 40 : 50} fw={800}>
              Session Replay
            </Title>
            <Text
              style={{
                fontSize: "1.8rem",
              }}
              mt={"lg"}
            >
              The session replay feature allows you to see exactly what your
              users are doing on your website. You can see every click, every
              scroll and every input field. This feature is perfect for
              debugging and understanding your users better.
            </Text>
            <Button
              color={"blue"}
              radius={"md"}
              size={"lg"}
              variant={"filled"}
              rightSection={<FaChevronRight />}
              component={"a"}
              href={"/app"}
              mt={"xl"}
            >
              Start now
            </Button>
          </Box>
          <Box
            flex={"100%"}
            style={{
              maxWidth: isMobile ? "100vw" : "40vw",
            }}
          >
            <Image
              src={"/dashboard_sessions.png"}
              onClick={() => {
                openImageModal("Session Replay", "/dashboard_sessions.png");
              }}
              style={{
                cursor: "pointer",
              }}
            />
          </Box>
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
          <Box
            flex={"100%"}
            style={{
              maxWidth: isMobile ? "98vw" : "30vw",
            }}
          >
            <Title order={2} size={isMobile ? 40 : 50} fw={800}>
              GraphQL API
            </Title>
            <Text
              style={{
                fontSize: "1.8rem",
              }}
              mt={"lg"}
            >
              With our GraphQL API you can access all the data you need. You can
              embed the data into your own applications or use it to create
              custom dashboards. The API is fast, secure and easy to use. Just
              remember to add your CodeUp-Access-Token as the Authorization
              Header.
            </Text>
            <Button
              color={"blue"}
              radius={"md"}
              size={"lg"}
              variant={"filled"}
              rightSection={<FaChevronRight />}
              component={"a"}
              href={"/api/graphql"}
              mt={"xl"}
            >
              Start now
            </Button>
          </Box>
          <Box
            flex={"100%"}
            style={{
              maxWidth: isMobile ? "100vw" : "40vw",
            }}
          >
            <Image
              src={"/graphql.png"}
              onClick={() => {
                openImageModal("GraphQL Sandbox", "/graphql.png");
              }}
              style={{
                cursor: "pointer",
              }}
            />
          </Box>
        </Flex>
        <Flex
          w={"100%"}
          p={"md"}
          justify={"space-between"}
          direction={isMobile ? "column" : "row"}
        >
          <Text>
            &copy;&nbsp;
            <Anchor href={"https://codeup.space"} target={"_blank"}>
              CodeUp
            </Anchor>
            . All rights reserved.
          </Text>
          <Text>CodeUp is a service by Ben Siebert.</Text>
        </Flex>
      </Box>
    </>
  );
}

function openImageModal(name: string, src: string) {
  modals.open({
    title: name,
    children: (
      <>
        <Image
          src={src}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
        <Button
          color={"blue"}
          radius={"md"}
          size={"lg"}
          variant={"filled"}
          rightSection={<FaExternalLinkAlt />}
          component={"a"}
          href={src}
          target={"_blank"}
          mt={"xl"}
        >
          Open in new Tab
        </Button>
      </>
    ),
    size: "full",
  });
}
