/**
 * apps/web/src/pages/creator/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.11.2022
 *
 */

import * as React from "react";
import CreatorStudioLayout from "@codeup/components/creator/studio/CreatorStudioLayout";
import {
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

export default function Index() {
  return (
    <>
      <Flex
        w={"100%"}
        minH={"100vh"}
        h={"fit-content"}
        direction={"column"}
        alignItems={"center"}
        bgPosition={"center"}
        bgRepeat={"no-repeat"}
        bgSize={"cover"}
        bgImage={"url(/_static/images/creator/worker.jpg)"}
      >
        <Heading
          mt={"4rem"}
          fontSize={["3xl", "6xl"]}
          color={"white"}
          textAlign={"center"}
          fontWeight={"bold"}
          fontFamily={"Seymour One"}
          maxW={["75%", "50%"]}
          textShadow={"0px 10px 50px #000000"}
        >
          Werde ein Creator auf CodeUp
        </Heading>
      </Flex>
    </>
  );
}
