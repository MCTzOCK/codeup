/**
 * src/pages/404.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.06.2022
 *
 */

import * as React from "react";
import { Button, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Flex
        w={"100%"}
        h={"98vh"}
        alignItems={"center"}
        justifyContent={"center"}
        direction={"column"}
        textAlign={"center"}
      >
        <Heading size={"xl"} fontFamily={"monospace"} color={"gray.400"}>
          404
        </Heading>
        <Heading size={"4xl"} color={"red"}>
          Nicht gefunden
        </Heading>
      </Flex>
    </>
  );
}
