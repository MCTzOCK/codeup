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
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link as ChakraLink,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { default as redirect } from "@codeup/util/src/userworkflow/redirect";

export default function Register() {
  const [usernameInvalid, setUsernameInvalid] = React.useState(false);
  const [firstNameInvalid, setFirstNameInvalid] = React.useState(false);
  const [lastNameInvalid, setLastNameInvalid] = React.useState(false);
  const [emailInvalid, setEmailInvalid] = React.useState(false);
  const [passwordInvalid, setPasswordInvalid] = React.useState(false);
  const [passwordConfirmInvalid, setPasswordConfirmInvalid] =
    React.useState(false);

  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] =
    React.useState(false);

  const [username, setUsername] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");

  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState<
    "error" | "info" | "success" | "warning"
  >("error");

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
          <Flex direction={"column"} gap={"2rem"}>
            <Flex
              alignItems={"center"}
              justifyContent={"center"}
              direction={"column"}
            >
              <Heading size={"xl"}>Registrieren</Heading>
              <Text textAlign={"center"} mt={".4rem"}>
                Erstelle ein Konto oder&nbsp;
                <Link href={"/account/login"}>
                  <ChakraLink color={"blue.400"} href={"/account/login"}>
                    melde dich an
                  </ChakraLink>
                </Link>
                .
              </Text>
            </Flex>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (
                  !password.match(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                  )
                ) {
                  setPasswordInvalid(true);
                  return;
                }

                if (password !== passwordConfirm) {
                  setPasswordConfirmInvalid(true);
                  return;
                }

                if (
                  !email.match(
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
                  )
                ) {
                  setEmailInvalid(true);
                  return;
                }

                if (!(firstName.length > 0)) {
                  setFirstNameInvalid(true);
                  return;
                }

                if (!(lastName.length > 0)) {
                  setLastNameInvalid(true);
                  return;
                }

                const body = {
                  email: email,
                  password: password,
                  firstName: firstName,
                  lastName: lastName,
                  username: username,
                };

                fetch("/api/account/register", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(body),
                }).then((res) => {
                  res.json().then((data) => {
                    if (res.status === 200) {
                      setAlertType("success");
                      setAlertMessage(data.message);
                    } else {
                      setAlertType("error");
                      setAlertMessage(data.error);
                    }
                    setAlertVisible(true);
                  });
                });
              }}
            >
              <Flex direction={"column"} gap={"2rem"}>
                <FormControl isInvalid={usernameInvalid}>
                  <FormLabel htmlFor={"username"}>Benutzername</FormLabel>
                  <Input
                    id={"username"}
                    placeholder={"Benutzername"}
                    onChange={(e) => {
                      fetch("/api/account/check-username/" + e.target.value, {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }).then((res) => {
                        if (res.status === 200) {
                          setUsernameInvalid(false);
                          setUsername(e.target.value);
                        } else {
                          setUsernameInvalid(true);
                        }
                      });
                    }}
                  />
                  <FormErrorMessage>
                    Dieser Benutzername ist nicht verfügbar.
                  </FormErrorMessage>
                </FormControl>
                <Flex direction={"row"} gap={"2rem"}>
                  <FormControl isInvalid={firstNameInvalid}>
                    <FormLabel htmlFor={"firstName"}>Vorname</FormLabel>
                    <Input
                      id={"firstName"}
                      placeholder={"Vorname"}
                      onChange={(e) => {
                        if (e.target.value.length > 0) {
                          setFirstNameInvalid(false);
                          setFirstName(e.target.value);
                        } else {
                          setFirstNameInvalid(true);
                        }
                      }}
                    />
                    <FormErrorMessage>
                      Bitte gib deinen Vorname ein.
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={lastNameInvalid}>
                    <FormLabel htmlFor={"lastName"}>Nachname</FormLabel>
                    <Input
                      id={"lastName"}
                      placeholder={"Nachname"}
                      onChange={(e) => {
                        if (e.target.value.length > 0) {
                          setLastNameInvalid(false);
                          setLastName(e.target.value);
                        } else {
                          setLastNameInvalid(true);
                        }
                      }}
                    />
                    <FormErrorMessage>
                      Bitte gib deinen Nachname ein.
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
                <FormControl isInvalid={emailInvalid}>
                  <FormLabel htmlFor={"email"}>E-Mail</FormLabel>
                  <Input
                    id={"email"}
                    placeholder={"E-Mail"}
                    onChange={(e) => {
                      if (
                        e.target.value.match(
                          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        )
                      ) {
                        setEmailInvalid(false);
                        setEmail(e.target.value);
                      } else {
                        setEmailInvalid(true);
                      }
                    }}
                  />
                  <FormErrorMessage>
                    Bitte verwende eine echte E-Mail.
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={passwordInvalid}>
                  <FormLabel htmlFor={"password"}>Passwort</FormLabel>
                  <InputGroup>
                    <Input
                      id={"password"}
                      placeholder={"Passwort"}
                      type={passwordVisible ? "text" : "password"}
                      onChange={(e) => {
                        if (
                          e.target.value.match(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                          )
                        ) {
                          setPasswordInvalid(false);
                          setPassword(e.target.value);
                        } else {
                          setPasswordInvalid(true);
                        }
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
                  <FormErrorMessage>
                    Bitte gib ein Passwort ein, welches aus mindestens 8
                    Buchstaben, einen Großbuchstaben, einen Kleinbuchstaben eine
                    Ziffer und ein Sonderzeichen besteht.
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={passwordConfirmInvalid}>
                  <FormLabel htmlFor={"passwordConfirm"}>
                    Passwort bestätigen
                  </FormLabel>
                  <InputGroup>
                    <Input
                      id={"passwordConfirm"}
                      placeholder={"Confirm Password"}
                      type={passwordConfirmVisible ? "text" : "password"}
                      onChange={(e) => {
                        if (e.target.value === password) {
                          setPasswordConfirmInvalid(false);
                          setPasswordConfirm(e.target.value);
                        } else {
                          setPasswordConfirmInvalid(true);
                        }
                      }}
                    />
                    <InputRightElement
                      cursor={"pointer"}
                      onClick={() => {
                        setPasswordConfirmVisible(!passwordConfirmVisible);
                      }}
                    >
                      {passwordConfirmVisible ? (
                        <AiFillEyeInvisible />
                      ) : (
                        <AiFillEye />
                      )}
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    Die Passwörter stimmen nicht überein.
                  </FormErrorMessage>
                </FormControl>
                <Button variant={"solid"} type={"submit"}>
                  Registrieren
                </Button>
              </Flex>
              <Text textAlign={"center"} mt={"1rem"}>
                Wenn auf &apos;Registrieren&apos; klickst, stimmt du den&nbsp;
                <Link href={"/legal/tos"}>
                  <ChakraLink href={"/legal/tos"} color={"blue.400"}>
                    AGB
                  </ChakraLink>
                </Link>
                &nbsp;und der&nbsp;
                <Link href={"/legal/privacy"}>
                  <ChakraLink href={"/legal/privacy"} color={"blue.400"}>
                    Datenschutzerklärung
                  </ChakraLink>
                </Link>
                &nbsp;zu
              </Text>
            </form>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}
