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
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import SuperText from "./SuperText";
import { CHeading } from "../global/CHeading";

const Milestones = (props: {
  title: string;
  milestones: {
    date: string;
    title: string;
    description: string;
    [key: string]: any;
  }[];
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const ms: {
    id: number;
    date: string;
    title: string;
    description: string;
    [key: string]: any;
  }[] = props.milestones.map((m) => {
    return {
      id: props.milestones.indexOf(m),
      ...m,
    };
  });

  return (
    <Container maxWidth="7xl" p={{ base: 2, sm: 10 }}>
      <Box mb={8} textAlign={"center"}>
        <CHeading size={"xl"}>{props.title}</CHeading>
      </Box>
      {ms.map((milestone) => (
        <Flex key={milestone.id} mb="10px">
          {isDesktop && milestone.id % 2 === 0 && (
            <>
              <EmptyCard />
              <LineWithDot icon={milestone.lwdIcon} />
              <Card {...milestone} />
            </>
          )}

          {/* Mobile view */}
          {isMobile && (
            <>
              <LineWithDot icon={milestone.lwdIcon} />
              <Card {...milestone} />
            </>
          )}

          {/* Desktop view(right card) */}
          {isDesktop && milestone.id % 2 !== 0 && (
            <>
              <Card {...milestone} />

              <LineWithDot icon={milestone.lwdIcon} />
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
  [key: string]: any;
}

const Card = ({ id, title, description, date, ...rest }: CardProps) => {
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
      <Box
        // add all other props from rest
        {...rest}
      >
        <Text fontSize="lg" color={"brand.500"}>
          {date}
        </Text>

        <Stack spacing={2} mb={3} textAlign="left">
          <CHeading size={"lg"}>{title}</CHeading>
          <Text fontSize="md">{description}</Text>
        </Stack>
      </Box>
    </HStack>
  );
};

const LineWithDot = (props: { icon?: any }) => {
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
      <Box pos="relative" p="15px">
        <Flex
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
          bg={"brand.600"}
          borderRadius="100px"
          backgroundImage="none"
          opacity={1}
          color={"black"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {props.icon ? props.icon : undefined}
        </Flex>
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
