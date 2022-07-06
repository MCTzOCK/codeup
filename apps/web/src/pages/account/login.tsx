/**
 * src/pages/account/register.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2022
 *
 */

import * as React from "react";
import { useEffect } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link as ChakraLink,
  PinInput,
  PinInputField,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { default as redirect } from "@codeup/util/src/userworkflow/redirect";

export default function Register() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const [btnDisabled, setBtnDisabled] = React.useState(false);

  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState<
    "error" | "info" | "success" | "warning"
  >("error");

  const [_2fa, set2fa] = React.useState(false);

  useEffect(() => {
    redirect({
      allowAnonymous: true,
      redirectTo: "/dashboard",
      redirectToLogin: false,
      forceAnonymous: true,
    });
  }, []);

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
          {!_2fa ? (
            <>
              <Flex direction={"column"} gap={"2rem"}>
                <Flex
                  alignItems={"center"}
                  justifyContent={"center"}
                  direction={"column"}
                >
                  <Heading size={"xl"}>Anmelden</Heading>
                  <Text textAlign={"center"} mt={".4rem"}>
                    Melde dich mit einem bestehenden Konto an, oder&nbsp;
                    <Link href={"/account/register"}>
                      <ChakraLink color={"blue.400"} href={"/account/register"}>
                        erstelle
                      </ChakraLink>
                    </Link>
                    &nbsp;ein neues.
                  </Text>
                </Flex>
                <FormControl>
                  <FormLabel htmlFor={"email"}>E-Mail</FormLabel>
                  <Input
                    id={"email"}
                    placeholder={"E-Mail"}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor={"password"}>Passwort</FormLabel>
                  <InputGroup>
                    <Input
                      id={"password"}
                      placeholder={"Passwort"}
                      type={passwordVisible ? "text" : "password"}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <InputRightElement
                      cursor={"pointer"}
                      onClick={() => {
                        setPasswordVisible(!passwordVisible);
                      }}
                    >
                      {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Button
                  variant={"solid"}
                  type={"button"}
                  isLoading={btnDisabled}
                  disabled={btnDisabled}
                  onClick={() => {
                    setBtnDisabled(true);

                    fetch("/api/account/login", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        email,
                        password,
                      }),
                    }).then((res) => {
                      res.json().then((data) => {
                        if (res.status !== 200) {
                          setAlertType("error");
                          setAlertMessage(data.error);
                          setAlertVisible(true);
                          setBtnDisabled(false);
                        } else {
                          if (data.token) {
                            localStorage.setItem("token", data.token);
                            window.location.href = "/dashboard";
                          } else {
                            set2fa(true);
                          }
                        }
                      });
                    });
                  }}
                >
                  Login
                </Button>
                <Text textAlign={"center"} mt={"1rem"}>
                  Passwort vergessen?&nbsp;
                  <Link href={"/account/reset"}>
                    <ChakraLink
                      href={"/account/reset-password"}
                      color={"blue.400"}
                    >
                      Setze es zurück.
                    </ChakraLink>
                  </Link>
                </Text>
              </Flex>
            </>
          ) : (
            <>
              <Flex direction={"column"} gap={"2rem"}>
                <Flex
                  alignItems={"center"}
                  justifyContent={"center"}
                  direction={"column"}
                >
                  <Heading size={"xl"} textAlign={"center"}>
                    2 Faktor Authentifizierung
                  </Heading>
                  <Text textAlign={"center"} mt={".4rem"}>
                    Überprüfe dein E-Mail Postfach für einen 2FA Code
                  </Text>
                </Flex>
                <HStack alignItems={"center"} justifyContent={"center"}>
                  <PinInput
                    size="lg"
                    onComplete={(code) => {
                      fetch("/api/account/login", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          email,
                          password,
                          code,
                        }),
                      }).then((res) => {
                        res.json().then((data) => {
                          if (res.status !== 200) {
                            setAlertType("error");
                            setAlertMessage(data.error);
                            setAlertVisible(true);
                          } else {
                            localStorage.setItem("token", data.token);
                            const redirect = new URLSearchParams(
                              window.location.search
                            ).get("redirect");
                            if (redirect) {
                              window.location.href = redirect;
                            } else {
                              window.location.href = "/dashboard";
                            }
                          }
                        });
                      });
                    }}
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
              </Flex>
            </>
          )}
        </Box>
      </Flex>
    </>
  );
}
