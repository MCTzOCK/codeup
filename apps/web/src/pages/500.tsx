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
import { Flex, Heading } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <>
      <Flex
        w={"100%"}
        h={"98vh"}
        alignItems={"center"}
        justifyContent={"center"}
        direction={"column"}
      >
        <Heading size={"xl"} fontFamily={"monospace"} color={"gray.400"}>
          500
        </Heading>
        <Heading size={"4xl"} color={"red"}>
          Interner Server Fehler
        </Heading>
      </Flex>
    </>
  );
}
