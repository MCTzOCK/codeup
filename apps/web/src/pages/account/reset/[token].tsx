/**
 * src/pages/account/reset-confirm.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
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
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/router";
import { default as redirect } from "@codeup/util/src/userworkflow/redirect";

export default function Token() {
  const router = useRouter();

  const { token } = router.query;

  const [loading, setLoading] = React.useState(false);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState<
    "error" | "info" | "success" | "warning"
  >("error");

  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] =
    React.useState(false);

  const [passwordInvalid, setPasswordInvalid] = React.useState(false);

  const [password, setPassword] = React.useState("");

  const [disabled, setDisabled] = React.useState(false);

  useEffect(() => {
    if (token === undefined) {
      return;
    }
    fetch("/api/account/check-reset-token?token=" + token, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        if (res.status !== 200) {
          setAlertVisible(true);
          setAlertMessage(data.error);
          setAlertType("error");
          setDisabled(true);
        }
      });
    });
  }, [token]);

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
              <Heading size={"xl"}>Reset Password</Heading>
              <Text textAlign={"center"} mt={".4rem"}>
                Enter your new password below to change it.
              </Text>
            </Flex>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);

                fetch("/api/account/reset-confirm", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    // @ts-ignore
                    password: e.target.elements.password.value,
                    token: token,
                  }),
                }).then((res) => {
                  res.json().then((data) => {
                    setLoading(false);
                    if (res.status === 200) {
                      setAlertVisible(true);
                      setAlertMessage(data.message);
                      setAlertType("success");
                      setDisabled(true);
                    } else {
                      setAlertVisible(true);
                      setAlertMessage(data.error);
                      setAlertType("error");
                    }
                  });
                });
              }}
            >
              <FormControl isInvalid={passwordInvalid}>
                <FormLabel htmlFor={"password"}>Password</FormLabel>
                <InputGroup>
                  <Input
                    id={"password"}
                    placeholder={"Password"}
                    disabled={disabled || loading}
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
                  Please enter a password with at least 8 characters, one
                  uppercase, one lowercase, one number and one special character
                </FormErrorMessage>
              </FormControl>
              <Button
                variant={"solid"}
                type={"submit"}
                isLoading={loading}
                disabled={disabled || loading}
                w={"100%"}
                mt={"2rem"}
              >
                Reset Password
              </Button>
            </form>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}
