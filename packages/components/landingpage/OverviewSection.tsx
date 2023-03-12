/**
 * packages/components/landingpage/HowItWorks.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.03.2023
 * Original: https://templateskart.com
 */

import * as React from "react";
import {
  chakra,
  Container,
  Stack,
  HStack,
  VStack,
  Flex,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import SuperText from "./SuperText";

const overviewList = [
  {
    id: 1,
    label: "Lernen",
    subLabel:
      "Schau dir interaktive Videokurse an und lerne so neue Programmiersprachen.",
  },
  {
    id: 2,
    label: "Planen",
    subLabel: "Erstelle dir einen Plan, um deine Ziele zu erreichen.",
  },
  {
    id: 3,
    label: "Verwirklichen",
    subLabel: "Erstelle dir Projekte und lerne so neue Technologien.",
  },
];

const OverviewSection = () => {
  return (
    <Container maxW="6xl" py={10}>
      <SuperText>Wie funktioniert CodeUp?</SuperText>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 0, md: 3 }}
        justifyContent="center"
        alignItems="center"
      >
        <VStack
          spacing={4}
          alignItems="flex-start"
          mb={{ base: 5, md: 0 }}
          maxW="md"
        >
          {overviewList.map((data) => (
            <Box key={data.id}>
              <HStack spacing={2}>
                <Flex
                  fontWeight="bold"
                  boxShadow="md"
                  bg={"#F7DE1F"}
                  color={"black"}
                  rounded="full"
                  justifyContent="center"
                  alignItems="center"
                  w={10}
                  h={10}
                >
                  {data.id}
                </Flex>
                <Text fontSize="xl">{data.label}</Text>
              </HStack>
              <Text fontSize="md" color="gray.200" ml={12}>
                {data.subLabel}
              </Text>
            </Box>
          ))}
        </VStack>
        <Image
          boxSize={{ base: "auto", md: "lg" }}
          objectFit="contain"
          src="/_static/vectors/home/develop-1.svg"
          rounded="lg"
        />
      </Stack>
    </Container>
  );
};

export default OverviewSection;
