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

export default function ThankYou() {
  return (
    <>
      <Flex
        w={"100%"}
        h={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        direction={"column"}
        bg={"#000"}
      >
        <Heading fontSize={"16rem"} color={"brand.500"}>
          <FaCheck />
        </Heading>
        <Heading fontSize={["2rem", "4rem", "5rem"]} color={"brand.500"} p={4}>
          Vielen Dank für deinen Kauf
        </Heading>
      </Flex>
    </>
  );
}
