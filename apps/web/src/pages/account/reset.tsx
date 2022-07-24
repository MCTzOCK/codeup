/**
 * src/pages/account/reset-password.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import * as React from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link as ChakraLink,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import REST from "@codeup/rest";

export default function Reset() {
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState<
    "error" | "info" | "success" | "warning"
  >("error");

  const [emailInvalid, setEmailInvalid] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  const [forceDisable, setForceDisable] = React.useState(false);

  return (
    <>
      {alertVisible ? (
        <Alert status={alertType} variant={"top-accent"}>
          <AlertIcon />
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      ) : null}
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        minW={"100%"}
        minH={"100vh"}
        padding={"1.2rem"}
      >
        <Box
          maxW={["100%", "50%"]}
          minW={["100%", "50%"]}
          bgColor={useColorModeValue("gray.400", "gray.900")}
          padding={"4rem"}
          rounded={"12px"}
          shadow={"xl"}
        >
          <Flex direction={"column"} gap={"2rem"}>
            <Flex
              alignItems={"center"}
              justifyContent={"center"}
              direction={"column"}
            >
              <Heading size={"xl"}>Passwort zurücksetzen</Heading>
              <Text textAlign={"center"} mt={".4rem"}>
                Gib deine E-Mail Adresse ein, damit wir dir einen Link senden,
                oder
                <Link href={"/account/login"}>
                  <ChakraLink href={"/account/login"} color={"blue.400"}>
                    logge
                  </ChakraLink>
                </Link>
                dich ein.
              </Text>
            </Flex>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                const res = await REST.Account.reset(
                  // @ts-ignore
                  e.target.elements.email.value as string
                );

                setLoading(false);
                if (res.status === 200) {
                  setAlertVisible(true);
                  setAlertMessage(res.payload.message);
                  setAlertType("success");
                  setForceDisable(true);
                } else {
                  setAlertVisible(true);
                  setAlertMessage(res.payload.error);
                  setAlertType("error");
                }
              }}
            >
              <FormControl isInvalid={emailInvalid}>
                <FormLabel htmlFor={"email"}>E-Mail</FormLabel>
                <Input
                  id={"email"}
                  placeholder={"E-Mail"}
                  onChange={(e) => {}}
                />
                <FormErrorMessage>{emailError}</FormErrorMessage>
              </FormControl>
              <Button
                variant={"solid"}
                type={"button"}
                isLoading={loading}
                disabled={forceDisable || loading}
                w={"100%"}
                mt={"2rem"}
              >
                Link erhalten
              </Button>
            </form>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}
