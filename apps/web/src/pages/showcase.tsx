/**
 * apps/web/src/pages/showcase.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.04.2023
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
  Text,
} from "@chakra-ui/react";
import { useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import { motion, useScroll } from "framer-motion";

export default function Showcase() {
  const { loggedIn } = useLoggedIn();
  const router = useRouter();
  const { scrollYProgress } = useScroll();

  return (
    <>
      <div
        className="position-absolute mx-auto bottom-0 z-n1 top-0 left-0 width-full events-none"
        style={{
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(85, 48, 152, 0.3) 0%, rgba(83, 48, 152, 0.1) 100%)",
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
          position: "absolute",
          zIndex: -1,
        }}
      />
      <Box w={"100%"} minH={"100vh"} h={"fit-content"} p={[4, 6]} mt={16}>
        <Flex w={"100%"} justifyContent={"center"}>
          <Box w={["100%", "45%"]}>
            <MonoHeading>Dein Weg zum Programmierer</MonoHeading>
            <Flex justifyContent={"center"} w={"100%"}>
              <Text
                color={"gray.200"}
                textAlign={"center"}
                mt={4}
                fontSize={"2xl"}
                maxW={["100%", "50%"]}
              >
                CodeUp bietet alle Werkzeuge, die du brauchst, um dich in die
                Welt der Programmierung einzuarbeiten.
              </Text>
            </Flex>
            <Flex justifyContent={"center"} w={"100%"}>
              <Flex gap={4} direction={["column", "row"]} mt={16}>
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
                      window.dispatchEvent(
                        new CustomEvent("codeup::open_login")
                      );
                    }
                  }}
                >
                  {loggedIn ? "Zum Dashboard" : "Jetzt loslegen"}
                </Button>
              </Flex>
            </Flex>
            <Box mt={"20vh"}></Box>
            <Flex direction={["column", "row"]}>
              <Image
                src={"/_static/images/showcase/framed_course.png"}
                maxW={"750px"}
              />
              <Box>
                <MonoHeading textAlign={"left"}>Kurse</MonoHeading>
                <Text
                  color={"gray.200"}
                  textAlign={"left"}
                  mt={4}
                  fontSize={"2xl"}
                  maxW={["100%"]}
                >
                  Unsere Kurse sind für alle Altersgruppen geeignet und bieten
                  dir viele verschiedene Themen. Jedes Thema ist in eine Lektion
                  unterteilt, die du Schritt für Schritt durchlaufen kannst. Am
                  Ende jeder Lektion wirst du mit einem Quiz abgefragt, um
                  sicherzustellen, dass du das Gelernte verstanden hast.
                </Text>
                <Flex w={"100%"} justifyContent={"flex-end"}>
                  <Button
                    colorScheme={"messenger"}
                    mt={4}
                    size={"lg"}
                    onClick={() => {
                      router.push("/course");
                    }}
                  >
                    Kurse ansehen
                  </Button>
                </Flex>
              </Box>
            </Flex>
            <Flex direction={"column"} mt={32}>
              <Box>
                <MonoHeading textAlign={"left"}>Zertifikate</MonoHeading>
                <Text
                  color={"gray.200"}
                  textAlign={"left"}
                  mt={4}
                  fontSize={"2xl"}
                  maxW={["100%"]}
                >
                  Zu jedem Kurs kannst du ein Zertifikat erhalten, wenn du alle
                  Lektionen erfolgreich durchlaufen hast. Für diese Zertifikate
                  musst du einen Test bestehen, damit wir sicherstellen können,
                  dass du das Gelernte verstanden hast.
                </Text>
                <Flex w={"100%"} justifyContent={"flex-end"}>
                  <Button
                    colorScheme={"messenger"}
                    mt={4}
                    size={"lg"}
                    onClick={() => {
                      router.push("/certificates");
                    }}
                  >
                    Zertifikate ansehen
                  </Button>
                </Flex>
              </Box>
              <Image
                src={"/_static/images/showcase/framed_certificates.png"}
                w={"100%"}
              />
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

const MonoHeading = (props: {
  children: React.ReactNode;
  [key: string]: any;
}) => {
  return (
    <>
      <Heading
        textAlign={"center"}
        as="h1"
        fontSize={["4xl", "6xl"]}
        fontFamily={"Jetbrains Mono ExtraBold"}
        {...props}
      >
        {props.children}
      </Heading>
    </>
  );
};
