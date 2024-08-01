/**
 * apps/game/src/scenes/UIMainMenu.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */

import * as React from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  ListItem,
  OrderedList,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Constants } from "../util/constants";
import {
  FaMinus,
  FaPlus,
  FaUpRightAndDownLeftFromCenter,
  FaWindowMinimize,
} from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { ReactTyped } from "react-typed";
import { useEffect } from "react";

export default function UIMainMenu() {
  const [asciiLoading, setAsciiLoading] = React.useState(false);
  const [asciiLoader, setAsciiLoader] = React.useState("");
  const [phase, setPhase] = React.useState(0);

  return (
    <>
      <Box w={"100vw"} h={"100vh"} p={8}>
        <Image
          src={"/assets/menu_background.png"}
          width={"100%"}
          height={"100vh"}
          objectFit={"cover"}
          top={0}
          left={0}
          position={"absolute"}
          zIndex={-1}
          filter={"blur(10px)"}
          alt={""}
        />
        <HStack justifyContent={"space-between"}>
          <Image src={"/assets/codeup.png"} alt={"CodeUp Logo"} w={"64px"} />
          <Text color={"white"} fontWeight={600} fontSize={"xl"}>
            {Constants.GAME_AUTHOR}
          </Text>
        </HStack>
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          w={"100%"}
          mt={16}
        >
          <Box w={"100%"} maxW={"50%"} bg={"#000"} rounded={"md"} p={4}>
            <HStack gap={2}>
              <Box p={1.5} rounded={"full"} bg={"#FF0000"}>
                <FaTimes color={"#000"} size={14} />
              </Box>
              <Box p={1.5} rounded={"full"} bg={"#FFFF00"}>
                <FaMinus color={"#000"} size={14} />
              </Box>
              <Box p={1.5} rounded={"full"} bg={"#00FF00"}>
                <FaUpRightAndDownLeftFromCenter color={"#000"} size={14} />
              </Box>
              <Text pl={4} fontSize={"2xl"}>
                {Constants.GAME_NAME}
              </Text>
            </HStack>
            <Box mt={6} color={"#20C20E"} fontSize={"xl"}>
              <span>root@codeup:~# </span>
              <ReactTyped
                strings={["/bin/codeup/game/boot"]}
                typeSpeed={40}
                showCursor={false}
                onComplete={() => {
                  setAsciiLoading(true);

                  const i = setInterval(() => {
                    setAsciiLoader((prev) => {
                      if (prev.length >= 100) {
                        return "";
                      }
                      return prev + "█";
                    });
                  }, 100);

                  const t = setTimeout(() => {
                    clearInterval(i);
                    setAsciiLoading(false);
                    setPhase(1);
                  }, 2500);
                }}
              />
              {asciiLoading && (
                <>
                  <br />
                  {asciiLoader}
                </>
              )}
              {phase >= 1 && (
                <>
                  <br />
                  <ReactTyped
                    strings={[
                      "<span>Connecting to mainframe @ 127.0.0.1 ...</span>" +
                        "<br />" +
                        "<span>Warning: Authentication required: Trying bruteforce</span>" +
                        "<br />" +
                        "<span>Successfully connected to mainframe!</span>" +
                        "<br />" +
                        "<span>Breaking security...</span>" +
                        "<br />" +
                        "<span>Attempting to start game</span>" +
                        "<br />" +
                        "<span>Game started!</span>" +
                        "<br />" +
                        "<br />" +
                        "<span>[CodeUp] Willkommen, Magier. Du bist der Auserwählte, der die Welt " +
                        "vor der künstlichen Intelligenz retten soll. Die Welt ist in " +
                        "Gefahr und braucht deine Hilfe. Bist du bereit?</span>",
                    ]}
                    contentType={"html"}
                    typeSpeed={10}
                    showCursor={false}
                    onComplete={() => {
                      setPhase(2);
                    }}
                  />
                </>
              )}
              {phase >= 2 && (
                <>
                  <br />
                  <br />
                  <OrderedList>
                    <ListItem textDecoration={"underline"}>Spielen</ListItem>
                    <ListItem textDecoration={"underline"}>Tutorial</ListItem>
                    <ListItem textDecoration={"underline"}>
                      Einstellungen
                    </ListItem>
                    <ListItem textDecoration={"underline"}>Über</ListItem>
                  </OrderedList>
                </>
              )}
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
