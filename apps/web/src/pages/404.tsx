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
          src="/_static/vectors/error/404.svg"
          width={"512"}
          height={"512"}
        />
        <Heading size={"xl"} fontFamily={"monospace"} color={"gray.200"}>
          Diese Seite wurde nicht gefunden
        </Heading>
      </Flex>
    </>
  );
}
