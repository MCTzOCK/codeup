/**
 * packages/components/global/ErrorComponent.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.22
 *
 */

import * as React from "react";
import { Flex, Heading, Image } from "@chakra-ui/react";

export default function ErrorComponent(props: {
  title?: string;
  description: string;
}) {
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
          src="/_static/vectors/error/warning.svg"
          width={"512"}
          height={"512"}
          alt={""}
        />

        <Heading size={"lg"}>{props.title || "Fehler"}</Heading>
        <Heading size={"md"}>{props.description}</Heading>
      </Flex>
    </>
  );
}
