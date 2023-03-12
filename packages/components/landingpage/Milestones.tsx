/**
 * packages/components/landingpage/Milestones.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.03.2023
 * Original: https://templateskart.com
 */

import React from "react";
import {
  Box,
  chakra,
  Container,
  Flex,
  HStack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import SuperText from "./SuperText";

const milestones = [
  {
    id: 0,
    date: "Mai 2022",
    title: "Ideenfindung",
    description: `Die Idee für das Projekt wurde geboren. Es sollte eine Plattform werden, die es Einsteigern ermöglicht programmieren zu lernen.`,
  },
  {
    id: 1,
    date: "6. Juni 2022",
    title: "Erster Commit",
    description: `Der erste Commit wurde auf GitHub gemacht. Das Projekt wurde von Ben Siebert ins Leben gerufen.`,
  },
  {
    id: 2,
    date: "4. Juli 2022",
    title: "Umstieg auf Turborepo",
    description:
      "Das Projekt wurde auf Turborepo umgestellt, um die Entwicklung zu vereinfachen.",
  },
  {
    id: 3,
    date: "16. Oktober 2022",
    title: "Admin Panel",
    description: "Fertigstellung der ersten Version des Admin Panels.",
  },
  {
    id: 4,
    date: "27. November 2022",
    title: "Zertifikate",
    description:
      "Die Idee für das Erlangen von Zertifikaten wurde in die Realität umgesetzt.",
  },
  {
    id: 5,
    date: "24. Feburar 2023",
    title: "Regionalwettbewerb",
    description:
      "CodeUp erhielt den ersten Preis beim Regionalwettbewerb Jugend Forscht der IHK in Münster in der Sparte Arbeitswelt.",
  },
];

const Milestones = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <Container maxWidth="7xl" p={{ base: 2, sm: 10 }}>
      <Box mb={8}>
        <SuperText>Geschichte</SuperText>
      </Box>
      {milestones.map((milestone) => (
        <Flex key={milestone.id} mb="10px">
          {isDesktop && milestone.id % 2 === 0 && (
            <>
              <EmptyCard />
              <LineWithDot />
              <Card {...milestone} />
            </>
          )}

          {/* Mobile view */}
          {isMobile && (
            <>
              <LineWithDot />
              <Card {...milestone} />
            </>
          )}

          {/* Desktop view(right card) */}
          {isDesktop && milestone.id % 2 !== 0 && (
            <>
              <Card {...milestone} />

              <LineWithDot />
              <EmptyCard />
            </>
          )}
        </Flex>
      ))}
    </Container>
  );
};

interface CardProps {
  id: number;
  title: string;
  description: string;
  date: string;
}

const Card = ({ id, title, description, date }: CardProps) => {
  const isEvenId = id % 2 == 0;
  let borderWidthValue = isEvenId ? "15px 15px 15px 0" : "15px 0 15px 15px";
  let leftValue = isEvenId ? "-15px" : "unset";
  let rightValue = isEvenId ? "unset" : "-15px";

  const isMobile = useBreakpointValue({ base: true, md: false });
  if (isMobile) {
    leftValue = "-15px";
    rightValue = "unset";
    borderWidthValue = "15px 15px 15px 0";
  }

  return (
    <HStack
      flex={1}
      p={{ base: 3, sm: 6 }}
      bg={"gray.800"}
      spacing={5}
      rounded="lg"
      alignItems="center"
      pos="relative"
      _before={{
        content: `""`,
        w: "0",
        h: "0",
        borderColor: `transparent #1A1B1E transparent`,
        borderStyle: "solid",
        borderWidth: borderWidthValue,
        position: "absolute",
        left: leftValue,
        right: rightValue,
        display: "block",
      }}
    >
      <Box>
        <Text fontSize="lg" color={isEvenId ? "teal.400" : "blue.400"}>
          {date}
        </Text>

        <VStack spacing={2} mb={3} textAlign="left">
          <chakra.h1 fontSize="2xl" lineHeight={1.2} fontWeight="bold" w="100%">
            {title}
          </chakra.h1>
          <Text fontSize="md">{description}</Text>
        </VStack>
      </Box>
    </HStack>
  );
};

const LineWithDot = () => {
  return (
    <Flex
      pos="relative"
      alignItems="center"
      mr={{ base: "40px", md: "40px" }}
      ml={{ base: "0", md: "40px" }}
    >
      <chakra.span
        position="absolute"
        left="50%"
        height="calc(100% + 10px)"
        border="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        top="0px"
      ></chakra.span>
      <Box pos="relative" p="10px">
        <Box
          pos="absolute"
          top="0"
          left="0"
          bottom="0"
          right="0"
          width="100%"
          height="100%"
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          backgroundPosition="center center"
          bg={"gray.200"}
          borderRadius="100px"
          backgroundImage="none"
          opacity={1}
        ></Box>
      </Box>
    </Flex>
  );
};

const EmptyCard = () => {
  return (
    <Box
      flex={{ base: 0, md: 1 }}
      p={{ base: 0, md: 6 }}
      bg="transparent"
    ></Box>
  );
};

export default Milestones;
