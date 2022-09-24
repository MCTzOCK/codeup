/**
 * src/pages/505.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.06.2022
 *
 */

import * as React from "react";
import { Flex, Heading } from "@chakra-ui/react";
import Image from "next/image";

export default function NotFound() {
  return (
    <>
      <Flex
        mt="4rem"
        w={"100%"}
        gap="2rem"
        direction={"column"}
        textAlign={"center"}
      >
        <Image
          src="/_static/vectors/error/500.svg"
          width={"512"}
          height={"512"}
          alt={""}
        />
        <Heading size={"xl"} fontFamily={"monospace"} color={"gray.200"}>
          Interner Server Fehler
        </Heading>
      </Flex>
    </>
  );
}
