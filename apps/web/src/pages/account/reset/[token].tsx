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
import REST from "@codeup/rest";
import Head from "next/head";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Token() {
  const router = useRouter();

  const { token } = router.query;

  const { t } = useTranslation("reset-password");

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

    REST.Account.checkResetToken(token as string).then((res) => {
      if (res.status !== 200) {
        setAlertVisible(true);
        setAlertMessage(res.payload.error);
        setAlertType("error");
        setDisabled(true);
      }
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
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
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
        bg={"#000"}
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
              <CHeading size={"xl"}>{t("title")}</CHeading>
              <Text textAlign={"center"} mt={".4rem"}>
                {t("text")}
              </Text>
            </Flex>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);

                const res = await REST.Account.resetConfirm({
                  resetToken: token as string,
                  // @ts-ignore
                  password: e.target.elements.password.value,
                });

                setLoading(false);
                if (res.status === 200) {
                  setAlertVisible(true);
                  setAlertMessage(res.payload.message);
                  setAlertType("success");
                  setDisabled(true);
                } else {
                  setAlertVisible(true);
                  setAlertMessage(res.payload.error);
                  setAlertType("error");
                }
              }}
            >
              <FormControl isInvalid={passwordInvalid}>
                <FormLabel htmlFor={"password"}>{t("password")}</FormLabel>
                <InputGroup>
                  <Input
                    id={"password"}
                    placeholder={t("password")}
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
                <FormErrorMessage>{t("password.criteria")}</FormErrorMessage>
              </FormControl>
              <Button
                variant={"brand"}
                type={"submit"}
                isLoading={loading}
                disabled={disabled || loading}
                w={"100%"}
                mt={"2rem"}
              >
                {t("password.reset")}
              </Button>
            </form>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["reset-password"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
