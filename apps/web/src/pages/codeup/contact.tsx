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
import REST from "@codeup/rest";

export default function Contact() {
  const [disableButton, setDisableButton] = React.useState(false);

  const { userInfo, loggedIn, loaded: uiLoaded } = useLoggedIn();
  const router = useRouter();

  const toast = useToast();

  return (
    <>
      <Flex align="center" justify="center" w={"100%"} minH={[0, "100vh"]}>
        <VStack
          spacing={8}
          w="100%"
          maxW="800px"
          p={8}
          bgColor={["transparent", "gray.900"]}
          rounded="lg"
          shadow={["none", "xl"]}
        >
          <Heading as="h1" size="2xl" textAlign={["center", "initial"]}>
            Team Kontaktieren
          </Heading>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (!loggedIn) {
                window.dispatchEvent(new CustomEvent("codeup::open_login"));
                return;
              }

              const data = new FormData(e.target as HTMLFormElement);

              const category = data.get("category") as string;
              const title = data.get("title") as string;
              const message = data.get("message") as string;

              const r = await makeRequest({
                token: localStorage.getItem("token") as string,
                method: "POST",
                path: "/api/contact",
                body: {
                  message,
                  category,
                  title,
                },
              });

              if (r.status === 200) {
                toast({
                  title: "Nachricht gesendet",
                  description: "Wir werden uns schnellstmöglich bei dir melden",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                  position: "top",
                });
                setDisableButton(true);
              } else {
                toast({
                  title: "Fehler",
                  description:
                    "Es ist ein Fehler aufgetreten, versuche es später eneut oder wende dich per E-Mail unter hello@ben-siebert.de an uns",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                  position: "top",
                });
              }
            }}
          >
            <Stack spacing={4}>
              <FormControl id="category" isRequired>
                <FormLabel>Kategorie</FormLabel>
                <Select name={"category"}>
                  <option value="sonstiges">Sonstiges</option>
                  <option value="fehler">Fehler melden</option>
                  <option value="feature">Funktion beantragen</option>
                  <option value="creator">Creator Bewerbung</option>
                </Select>
              </FormControl>
              <FormControl id="title" isRequired>
                <FormLabel>Titel</FormLabel>
                <Input name={"title"} placeholder={"Titel"} />
              </FormControl>
              <FormControl id="message" isRequired>
                <FormLabel>Nachricht</FormLabel>
                <Textarea name={"message"} placeholder={"Nachricht ..."} />
              </FormControl>
              <Button type="submit" colorScheme="blue" disabled={disableButton}>
                {loggedIn ? "Absenden" : "Anmelden zum Senden"}
              </Button>
            </Stack>
          </form>
        </VStack>
      </Flex>
    </>
  );
}
