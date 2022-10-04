/**
 * apps/web/src/pages/codeup/contact.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.22
 *
 */

import * as React from "react";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Select,
  Stack,
  Textarea,
  Tooltip,
  useClipboard,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useLoggedIn } from "@codeup/hooks";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { FaBaby } from "react-icons/fa";
import makeRequest from "@codeup/rest/src/makeRequest";

export default function Contact() {
  const { userInfo, loggedIn, loaded: uiLoaded } = useLoggedIn();
  const router = useRouter();

  const toast = useToast();

  return (
    <>
      <Flex align="center" justify="center" id="contact">
        <Box
          borderRadius="lg"
          m={{ base: 5, md: 16, lg: 10 }}
          p={{ base: 5, lg: 16 }}
        >
          <Box>
            <VStack spacing={{ base: 4, md: 8, lg: 20 }}>
              <Heading
                fontSize={{
                  base: "4xl",
                  md: "5xl",
                }}
              >
                Team kontaktieren
              </Heading>

              <Stack
                spacing={{ base: 4, md: 8, lg: 20 }}
                direction={{ base: "column", md: "row" }}
              >
                <Box
                  bg={useColorModeValue("white", "gray.700")}
                  borderRadius="lg"
                  p={8}
                  color={useColorModeValue("gray.700", "whiteAlpha.900")}
                  shadow="base"
                  style={{ scale: "1.25" }}
                  mt={"4rem"}
                >
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      // @ts-ignore
                      const message = e.target.message.value;
                      // @ts-ignore
                      const priority = e.target.priority.value;

                      const r = await makeRequest({
                        token: localStorage.getItem("token") as string,
                        method: "POST",
                        path: "/api/contact",
                        body: {
                          message,
                          priority,
                        },
                      });

                      if (r.status === 200) {
                        toast({
                          title: "Nachricht gesendet",
                          description:
                            "Wir werden uns schnellstmöglich bei dir melden",
                          status: "success",
                          duration: 5000,
                          isClosable: true,
                          position: "top",
                        });
                      } else {
                        toast({
                          title: "Fehler",
                          description: "Es ist ein Fehler aufgetreten",
                          status: "error",
                          duration: 5000,
                          isClosable: true,
                          position: "top",
                        });
                      }
                    }}
                  >
                    <VStack spacing={5}>
                      <FormControl isRequired>
                        <FormLabel>Nachricht</FormLabel>

                        <Textarea
                          name="message"
                          placeholder="Deine Nachricht"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Priorität</FormLabel>

                        <Select name="priority">
                          <option value="low">Niedrig</option>
                          <option value="medium">Mittel</option>
                          <option value="high">Hoch</option>
                        </Select>
                      </FormControl>

                      <Button
                        id={"contact-form-submit"}
                        type={loggedIn ? "submit" : "button"}
                        colorScheme={"green"}
                        w={"100%"}
                        onClick={
                          !loggedIn
                            ? () => {
                                window.dispatchEvent(
                                  new CustomEvent("codeup::open_login")
                                );
                              }
                            : () => {}
                        }
                      >
                        {loggedIn
                          ? "Nachricht senden"
                          : "Anmelden um zu senden"}
                      </Button>
                    </VStack>
                  </form>
                </Box>
              </Stack>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </>
  );
}
