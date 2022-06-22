/**
 * src/components/community/profile/ProfileNotFound.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.06.2022
 *
 */

import * as React from "react";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { BsQuestionSquareFill } from "react-icons/bs";

export default function ProfileNotFound() {
  return (
    <>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        minW={"100%"}
        minH={"99vh"}
      >
        <Heading
          color={"green.300"}
          fontSize={"10rem"}
          textAlign={"center"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          as={"div"}
        >
          <BsQuestionSquareFill />
          <Heading color={"white"} mt={"1.2rem"}>
            Not Found
          </Heading>
          <Text
            color={"white"}
            fontSize={"1.2rem"}
            textDecoration={"none"}
            fontWeight={"normal"}
            mt={"1.2rem"}
          >
            The profile you are looking for does not exist.
          </Text>
        </Heading>
      </Flex>
    </>
  );
}
