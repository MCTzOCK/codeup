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
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function ErrorComponent(props: {
  title?: string;
  description: string;
  image?: string;
}) {
  const router = useRouter();
  return (
    <>
      <Flex
        w={"100%"}
        gap="2rem"
        direction={["column", "row", "row"]}
        p={8}
        pt={"4rem"}
        pb={"4rem"}
        h={"fit-content"}
        minH={"100vh"}
        bg={"#000"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Flex gap={4} direction={"column"}>
          <Heading
            as={"h1"}
            fontSize={["4xl", "5xl", "6xl"]}
            fontWeight={900}
            letterSpacing={-2}
            fontFamily={"Jetbrains Mono ExtraBold"}
            color={"brand.500"}
            w={"100%"}
          >
            {props.title || "Fehler"}
          </Heading>
          <Heading size={"lg"} fontFamily={"Jetbrains Mono ExtraBold"}>
            {props.description}
          </Heading>
          <Button
            variant={"brand"}
            size={"lg"}
            w={"fit-content"}
            onClick={() => {
              router.push("/");
            }}
          >
            Home
          </Button>
        </Flex>
        <Image
          src={props.image ?? "/_static/vectors/error/warning.svg"}
          width={"512"}
          height={"512"}
          alt={""}
        />
      </Flex>
    </>
  );
}
