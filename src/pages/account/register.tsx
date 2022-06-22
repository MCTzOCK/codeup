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
import redirect from "../../util/userworkflow/redirect";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation();

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
              <Heading size={"xl"}>{t("account:register")}</Heading>
              <Text textAlign={"center"} mt={".4rem"}>
                {t("register:subtitle_start")}&nbsp;
                <Link href={"/account/login"}>
                  <ChakraLink color={"blue.400"} href={"/account/login"}>
                    {t("account:login")}
                  </ChakraLink>
                </Link>
                &nbsp;
                {t("register:subtitle_end")}
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
                  <FormLabel htmlFor={"username"}>
                    {t("account:username")}
                  </FormLabel>
                  <Input
                    id={"username"}
                    placeholder={t("account:username")}
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
                    {t("register:err-username-not-available")}
                  </FormErrorMessage>
                </FormControl>
                <Flex direction={"row"} gap={"2rem"}>
                  <FormControl isInvalid={firstNameInvalid}>
                    <FormLabel htmlFor={"firstName"}>
                      {t("account:first-name")}
                    </FormLabel>
                    <Input
                      id={"firstName"}
                      placeholder={t("account:first-name")}
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
                      {t("register:err-enter-first-name")}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={lastNameInvalid}>
                    <FormLabel htmlFor={"lastName"}>
                      {t("account:last-name")}
                    </FormLabel>
                    <Input
                      id={"lastName"}
                      placeholder={t("account:last-name")}
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
                      {t("register:err-enter-last-name")}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
                <FormControl isInvalid={emailInvalid}>
                  <FormLabel htmlFor={"email"}>Email</FormLabel>
                  <Input
                    id={"email"}
                    placeholder={"Email"}
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
                    {t("register:err-enter-valid-email")}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={passwordInvalid}>
                  <FormLabel htmlFor={"password"}>
                    {t("account:password")}
                  </FormLabel>
                  <InputGroup>
                    <Input
                      id={"password"}
                      placeholder={t("account:Password")}
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
                    {t("register:err-password-not-valid")}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={passwordConfirmInvalid}>
                  <FormLabel htmlFor={"passwordConfirm"}>
                    {t("register:confirm-password")}
                  </FormLabel>
                  <InputGroup>
                    <Input
                      id={"passwordConfirm"}
                      placeholder={t("register:confirm-password")}
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
                    {t("register:err-password-not-match")}
                  </FormErrorMessage>
                </FormControl>
                <Button variant={"solid"} type={"submit"}>
                  {t("account:register")}
                </Button>
              </Flex>
              <Text textAlign={"center"} mt={"1rem"}>
                {t("register:by-registering")}&nbsp;
                <Link href={"/legal/tos"}>
                  <ChakraLink href={"/legal/tos"} color={"blue.400"}>
                    {t("common:terms-of-service")}
                  </ChakraLink>
                </Link>
                &nbsp;
                {t("common:and")}
                &nbsp;
                <Link href={"/legal/privacy"}>
                  <ChakraLink href={"/legal/privacy"} color={"blue.400"}>
                    {t("common:privacy-policy")}
                  </ChakraLink>
                </Link>
              </Text>
            </form>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "account",
        "navbar",
        "footer",
        "register",
      ])),
    },
  };
}
