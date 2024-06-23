/**
 * apps/web/src/pages/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.10.2022
 *
 */

import * as React from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
  Link as ChakraLink,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import Typed from "react-typed";
import { motion } from "framer-motion";
import { FaBook, FaCode, FaProjectDiagram } from "react-icons/fa";
import VideoPlayer from "@codeup/components/global/VideoPlayer";

export default function OldLandingV2() {
  const sectionCards = [
    {
      title: "Lernen",
      description:
        "Mit unseren interaktiven Kursen kannst du dich in verschiedensten Bereichen der Programmierung weiterbilden oder neue Programmiersprachen erlernen. Jeder Kurs ist in Lektionen aufgeteilt und verfügt sowohl über eine Text-Version als auch über ein Video.",
      icon: <FaBook />,
      iconColor: "blue.200",
    },
    {
      title: "Entwickeln",
      description:
        "Mit unserer fortschrittlichen Entwicklungsumgebung kannst du deine Projekte direkt im Browser entwickeln. Du kannst zwischen verschiedenen Programmiersprachen wählen und deine Projekte mit anderen teilen.",
      icon: <FaCode />,
      iconColor: "green.200",
    },
    {
      title: "Planen",
      description:
        "Mit unserem Projekt-Management kannst du deine Projekte planen und verwalten.",
      icon: <FaProjectDiagram />,
      iconColor: "yellow.600",
    },
  ];

  return (
    <>
      <Box
        w={"100%"}
        h={"100vh"}
        backgroundImage={"url('/_static/images/codeup_splash_lp.JPG')"}
        backgroundSize={"cover"}
        backgroundPosition={"center"}
        backgroundRepeat={"no-repeat"}
      ></Box>

      <Flex
        w={"100%"}
        minH={"100vh"}
        h="fit-content"
        bg={"gray.900"}
        alignItems="center"
        flexDirection={"column"}
        id="_more"
        pt="2rem"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.5,
            default: {
              duration: 0.3,
              ease: [0, 0.71, 0.2, 1.01],
            },
            scale: {
              type: "spring",
              damping: 5,
              stiffness: 100,
              restDelta: 0.001,
            },
          }}
          viewport={{ once: true }}
        >
          <Heading
            color={"white"}
            fontSize={["2rem", "4rem"]}
            fontFamily={"ARCADE"}
            textAlign={"center"}
            id="landing-title"
          >
            Willkommen bei CodeUp!
          </Heading>
        </motion.div>
        <Grid
          templateColumns={"1fr"}
          maxW={[null, "40%"]}
          gap={"6rem"}
          w={"100%"}
          p={["1rem", "2rem"]}
          mt={["1rem", "2rem"]}
        >
          {sectionCards.map((card, index) => {
            return (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    default: {
                      duration: 0.3,
                      ease: [0, 0.71, 0.2, 1.01],
                    },
                    scale: {
                      type: "spring",
                      damping: 5,
                      stiffness: 100,
                      restDelta: 0.001,
                    },
                  }}
                  viewport={{ once: true }}
                >
                  <Box
                    bg={"gray.800"}
                    w={"100%"}
                    h={"100%"}
                    p={"1rem"}
                    borderRadius={"10px"}
                    boxShadow={"0px 0px 10px 0px rgba(0,0,0,0.75)"}
                  >
                    <Flex gap="2rem" justifyContent="center">
                      <Box
                        bg={card.iconColor}
                        p={"1rem"}
                        w={"fit-content"}
                        color={"white"}
                        fontSize={"2rem"}
                        mb={"1rem"}
                        borderRadius={"10px"}
                        boxShadow={"0px 0px 10px 0px rgba(0,0,0,0.75)"}
                      >
                        {card.icon}
                      </Box>

                      <Heading
                        color={"white"}
                        fontSize={["1rem", "2rem"]}
                        fontFamily={"ARCADE"}
                        textAlign={"center"}
                        mt={"1rem"}
                      >
                        {card.title}
                      </Heading>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      flexDirection={"column"}
                    >
                      <Text
                        color={"white"}
                        fontSize={["1.5rem"]}
                        textAlign={"center"}
                        mt={"1rem"}
                      >
                        {card.description}
                      </Text>
                    </Flex>
                  </Box>
                </motion.div>
              </>
            );
          })}
        </Grid>
        <Divider mt="4rem" />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.5,
            default: {
              duration: 0.3,
              ease: [0, 0.71, 0.2, 1.01],
            },
            scale: {
              type: "spring",
              damping: 5,
              stiffness: 100,
              restDelta: 0.001,
            },
          }}
          viewport={{ once: true }}
        >
          <Heading
            mt={"4rem"}
            mb={"4rem"}
            color={"white"}
            fontSize={["2rem", "4rem"]}
            fontFamily={"ARCADE"}
            textAlign={"center"}
            id="landing-title"
          >
            CodeUp in 100 Sekunden
          </Heading>
        </motion.div>
        <Box
          w={"100%"}
          mt={8}
          mb={8}
          maxW={["100%", "40%"]}
          h={"fit-content"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          p={4}
          bg={"#000000"}
          borderRadius={"md"}
          boxShadow={"2xl"}
        >
          <VideoPlayer url={"https://www.youtube.com/watch?v=iElczHdHUVs"} />
        </Box>
      </Flex>
    </>
  );
}
