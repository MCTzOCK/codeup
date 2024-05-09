/**
 * apps/web/src/pages/legal/imprint.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.12.2022
 *
 */

import * as React from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import Head from "next/head";
import makeRequest from "@codeup/rest/dist/makeRequest";
import DividerWithText from "@codeup/components/dist/global/DividerWithText";
import { CHeading } from "@codeup/components/dist/global/CHeading";

export default function Imprint() {
  return (
    <>
      <Head>
        <title>Impressum - CodeUp</title>
      </Head>
      <Flex
        align="center"
        justify="center"
        w={"100%"}
        minH={"100vh"}
        bg={"#000"}
        h={"fit-content"}
      >
        <Stack
          spacing={8}
          w="100%"
          maxW="800px"
          p={8}
          bgColor={"black"}
          rounded="lg"
          shadow={["none", "xl"]}
        >
          <CHeading size={"xl"}>Impressum</CHeading>
          <Heading
            as="h2"
            size="lg"
            textAlign={["center", "initial"]}
            color={"brand.500"}
          >
            Angaben gemäß § 5 TMG
          </Heading>
          <Text fontSize={"lg"}>
            Ben Siebert
            <br />
            Im Mühlenwinkel 14
            <br />
            45525 Hattingen
          </Text>
          <Heading
            as="h2"
            size="lg"
            textAlign={["center", "initial"]}
            color={"brand.500"}
          >
            Kontakt
          </Heading>
          <Text fontSize={"lg"}>
            E-Mail:&nbsp;
            <Link href="mailto:hello@ben-siebert.de" color={"brand.500"}>
              hello@ben-siebert.de
            </Link>
          </Text>
          <Heading
            as="h2"
            size="lg"
            textAlign={["center", "initial"]}
            color={"brand.500"}
          >
            Redaktionell Verantwortlicher
          </Heading>
          <Text fontSize={"lg"}>Ben Siebert</Text>
        </Stack>
      </Flex>
    </>
  );
}
