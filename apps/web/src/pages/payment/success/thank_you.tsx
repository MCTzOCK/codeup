/**
 * apps/web/src/pages/payment/success/thank_you.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.06.2023
 *
 */

import * as React from "react";
import { Flex, Heading } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

export default function thank_you() {
  return (
    <>
      <Flex w={"100%"} h={"100vh"} justifyContent={"center"} alignItems={"center"} direction={"column"}>
        <Heading fontSize={"16rem"} color={"green.300"}><FaCheck /></Heading>
        <Heading fontSize={"5rem"} color={"green.300"}>Vielen Dank für deinen Kauf</Heading>
      </Flex>
    </>
  );
}