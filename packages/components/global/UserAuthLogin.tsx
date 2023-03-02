/**
 * packages/components/global/UserAuthLogin.tsx
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
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  PinInput,
  PinInputField,
  Text,
} from "@chakra-ui/react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import REST from "@codeup/rest";
import { IResponse } from "@codeup/rest/src/types/IResponse";
import AccountManager, { Account } from "@codeup/util/src/AccountManager";

export default function UserAuthLogin(props: { onClose: () => void }) {
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

  return (
    <>
      {alertVisible ? (
        <Alert status={alertType} variant={"top-accent"} mb={"1.2rem"}>
          <AlertIcon />
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      ) : null}
      {!_2fa ? (
        <>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBtnDisabled(true);
              setAlertVisible(false);

              let res: IResponse;

              if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                res = await REST.Account.login({
                  email,
                  password,
                });
              } else {
                res = await REST.Account.loginWithUsername({
                  username: email,
                  password,
                });
              }

              if (res.status !== 200) {
                setAlertType("error");
                setAlertMessage(res.payload.error);
                setAlertVisible(true);
                setBtnDisabled(false);
              } else {
                if (res.payload.token) {
                  localStorage.setItem("token", res.payload.token);
                  if (
                    AccountManager.getAccounts().find(
                      (a) => a.username === email || a.email === email
                    ) !== undefined
                  ) {
                    AccountManager.removeAccount(
                      AccountManager.getAccounts().find(
                        (a) => a.username === email || a.email === email
                      ) as Account
                    );
                  }

                  props.onClose();
                } else {
                  set2fa(true);
                }
              }
            }}
          >
            <Flex direction={"column"} gap={"2rem"}>
              <FormControl>
                <FormLabel htmlFor={"email"}>
                  E-Mail oder Benutzername
                </FormLabel>
                <Input
                  id={"email"}
                  placeholder={"E-Mail oder Benutzername"}
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
                type={"submit"}
                isLoading={btnDisabled}
                disabled={btnDisabled}
              >
                Login
              </Button>
            </Flex>
          </form>
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
                Bitte gib den Code aus deiner Authentifizierungs-App ein.
              </Text>
            </Flex>
            <HStack alignItems={"center"} justifyContent={"center"}>
              <PinInput
                size="lg"
                onComplete={async (code) => {
                  let res: IResponse | null;

                  if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                    res = await REST.Account.login({
                      email,
                      password,
                      code,
                    });
                  } else {
                    res = await REST.Account.loginWithUsername({
                      username: email,
                      password,
                      code,
                    });
                  }

                  if (res.status !== 200) {
                    setAlertType("error");
                    setAlertMessage(res.payload.error);
                    setAlertVisible(true);
                  } else {
                    localStorage.setItem("token", res.payload.token);
                    if (
                      AccountManager.getAccounts().find(
                        (a) => a.username === email || a.email === email
                      ) !== undefined
                    ) {
                      AccountManager.removeAccount(
                        AccountManager.getAccounts().find(
                          (a) => a.username === email || a.email === email
                        ) as Account
                      );
                    }
                    props.onClose();
                  }
                }}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </Flex>
        </>
      )}
    </>
  );
}
