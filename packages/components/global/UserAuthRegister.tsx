/**
 * packages/components/global/UserAuthRegister.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import * as React from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Link as ChakraLink,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import checkPassword from "@codeup/util/src/checkPassword";
import Link from "next/link";
import { useTranslation } from "next-i18next";

export default function UserAuthRegister() {
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

  const [loading, setLoading] = React.useState(false);

  const { t } = useTranslation("auth");

  return (
    <>
      {alertVisible ? (
        <Alert status={alertType} variant={"top-accent"} mb={"1.2rem"}>
          <AlertIcon />
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      ) : null}
      <Flex direction={"column"} gap={"2rem"}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (!checkPassword(password)) {
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

            setLoading(true);
            const body = {
              email: email,
              password: password,
              firstName: firstName,
              lastName: lastName,
              username: username,
            };

            const res = await REST.Account.register({
              email,
              username,
              password,
              firstName,
              lastName,
            });

            if (res.status === 200) {
              setAlertType("success");
              setAlertMessage(res.payload.message);
            } else {
              setAlertType("error");
              setAlertMessage(res.payload.error);
            }
            setAlertVisible(true);

            setLoading(false);
          }}
        >
          <Flex direction={"column"} gap={"2rem"}>
            <FormControl isInvalid={usernameInvalid}>
              <FormLabel htmlFor={"username"}>{t("username")}</FormLabel>
              <Input
                id={"username"}
                placeholder={t("username")}
                onChange={async (e) => {
                  const res = await REST.Account.checkUsername(e.target.value);

                  if (res.status === 200) {
                    setUsernameInvalid(false);
                    setUsername(e.target.value);
                  } else {
                    setUsernameInvalid(true);
                  }
                }}
              />
              <FormErrorMessage>{t("username.na")}</FormErrorMessage>
            </FormControl>
            <Flex direction={"row"} gap={"2rem"}>
              <FormControl isInvalid={firstNameInvalid}>
                <FormLabel htmlFor={"firstName"}>{t("firstname")}</FormLabel>
                <Input
                  id={"firstName"}
                  placeholder={t("firstname")}
                  onChange={(e) => {
                    if (e.target.value.length > 0) {
                      setFirstNameInvalid(false);
                      setFirstName(e.target.value);
                    } else {
                      setFirstNameInvalid(true);
                    }
                  }}
                />
                <FormErrorMessage>{t("enter.firstname")}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={lastNameInvalid}>
                <FormLabel htmlFor={"lastName"}>{t("lastname")}</FormLabel>
                <Input
                  id={"lastName"}
                  placeholder={t("lastname")}
                  onChange={(e) => {
                    if (e.target.value.length > 0) {
                      setLastNameInvalid(false);
                      setLastName(e.target.value);
                    } else {
                      setLastNameInvalid(true);
                    }
                  }}
                />
                <FormErrorMessage>{t("enter.lastname")}</FormErrorMessage>
              </FormControl>
            </Flex>
            <FormControl isInvalid={emailInvalid}>
              <FormLabel htmlFor={"email"}>{t("email")}</FormLabel>
              <Input
                id={"email"}
                placeholder={t("email")}
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
              <FormErrorMessage>{t("enter.email")}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={passwordInvalid}>
              <FormLabel htmlFor={"password"}>{t("password")}</FormLabel>
              <InputGroup>
                <Input
                  id={"password"}
                  placeholder={t("password")}
                  type={passwordVisible ? "text" : "password"}
                  onChange={(e) => {
                    if (
                      // @ts-ignore
                      checkPassword(e.target.value)
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
              <FormErrorMessage>{t("password.requirement")}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={passwordConfirmInvalid}>
              <FormLabel htmlFor={"passwordConfirm"}>
                {t("password.confirm")}
              </FormLabel>
              <InputGroup>
                <Input
                  id={"passwordConfirm"}
                  placeholder={t("password.confirm")}
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
              <FormErrorMessage>{t("passwords.not.match")}</FormErrorMessage>
            </FormControl>
            <Button variant={"brand"} type={"submit"} isLoading={loading}>
              {t("register")}
            </Button>
          </Flex>
          <Text mt={"1rem"}>
            {t("register.disclaimer")}
            <UnorderedList>
              <ListItem>
                <ChakraLink
                  href={"/legal/privacy"}
                  color={"brand.500"}
                  target={"_blank"}
                  textAlign={"left"}
                >
                  {t("documents.privacy")}
                </ChakraLink>
              </ListItem>
            </UnorderedList>
          </Text>
        </form>
      </Flex>
    </>
  );
}
