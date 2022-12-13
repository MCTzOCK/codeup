/**
 * apps/web/src/pages/try.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.12.2022
 *
 */

import React, { useState } from "react";

// import @chakra-ui/react and @chakra-ui/card
import {
  Flex,
  Box,
  Heading,
  Text,
  ButtonGroup,
  Button,
  chakra,
} from "@chakra-ui/react";
import { Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/card";
import REST from "@codeup/rest";

export default function Try() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="100%"
        minH="100vh"
        p="2rem"
      >
        <Box w="100%" maxW="800px">
          <Card
            w={"100%"}
            h={"100%"}
            bgColor={"black"}
            rounded={"xl"}
            boxShadow={"xl"}
            p={5}
          >
            <CardHeader>
              <Heading as="h2" size="lg">
                CodeUp Testen
              </Heading>
            </CardHeader>
            <CardBody mt={"2rem"}>
              <Text>
                Teste CodeUp ganz ohne deine Daten zu hinterlassen. Diese
                Funktion ist nicht für die langfristige Nutzung gedacht.
              </Text>
              <Text mt={2}>
                <chakra.span color={"red.400"} fontWeight={"bold"}>
                  ACHTUNG!
                </chakra.span>
                &nbsp;Test-Konten werden regelmäßig gelöscht und können nicht
                wiederhergestellt werden.
              </Text>
            </CardBody>
            <CardFooter mt={"2rem"}>
              <ButtonGroup
                w={"100%"}
                spacing={4}
                justifyContent={"center"}
                onClick={() => {}}
              >
                <Button
                  colorScheme={"blue"}
                  variant={"solid"}
                  w={"100%"}
                  onClick={async () => {
                    const r = await REST.Account.createTestAccount();

                    if (r.status === 200) {
                      localStorage.setItem("token", r.payload.token);
                      window.location.assign("/account/settings");
                    } else {
                      alert(
                        "Es ist ein Fehler aufgetreten! Bitte versuche es später erneut."
                      );
                    }
                  }}
                  isLoading={loading}
                >
                  Testen
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        </Box>
      </Flex>
    </>
  );
}
