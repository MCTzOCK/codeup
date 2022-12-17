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

export default function Imprint() {
  return (
    <>
      <Head>
        <title>Impressum - CodeUp</title>
      </Head>
      <Flex align="center" justify="center" w={"100%"} minH={[0, "100vh"]}>
        <Stack
          spacing={8}
          w="100%"
          maxW="800px"
          p={8}
          bgColor={["transparent", "gray.900"]}
          rounded="lg"
          shadow={["none", "xl"]}
        >
          <Heading as="h1" size="2xl" textAlign={["center", "initial"]}>
            Impressum
          </Heading>
          <Heading as="h2" size="xl" textAlign={["center", "initial"]}>
            Angaben gemäß § 5 TMG
          </Heading>
          <Text fontSize={"lg"}>
            Ben Siebert
            <br />
            Im Mühlenwinkel 14
            <br />
            45525 Hattingen
          </Text>
          <Heading as="h2" size="xl" textAlign={["center", "initial"]}>
            Kontakt
          </Heading>
          <Text fontSize={"lg"}>
            E-Mail:&nbsp;
            <Link href="mailto:hello@ben-siebert.de" color={"blue.400"}>
              hello@ben-siebert.de
            </Link>
          </Text>
          <Heading as="h2" size="xl" textAlign={["center", "initial"]}>
            Redaktionell Verantwortlicher
          </Heading>
          <Text fontSize={"lg"}>Ben Siebert</Text>
        </Stack>
      </Flex>
    </>
  );
}
