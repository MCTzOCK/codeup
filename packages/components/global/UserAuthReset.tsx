/**
 * packages/components/global/UserAuthReset.tsx
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
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import { useTranslation } from "next-i18next";

export default function UserAuthReset() {
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState<
    "error" | "info" | "success" | "warning"
  >("error");

  const [emailInvalid, setEmailInvalid] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  const [forceDisable, setForceDisable] = React.useState(false);

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
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          direction={"column"}
        >
          <Text textAlign={"center"} mt={".4rem"}>
            {t("reset.text")}
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
            <FormLabel htmlFor={"email"}>{t("email")}</FormLabel>
            <Input id={"email"} placeholder={t("email")} onChange={(e) => {}} />
            <FormErrorMessage>{emailError}</FormErrorMessage>
          </FormControl>
          <Button
            variant={"brand"}
            type={"submit"}
            isLoading={loading}
            disabled={forceDisable || loading}
            w={"100%"}
            mt={"2rem"}
          >
            {t("reset.get.link")}
          </Button>
        </form>
      </Flex>
    </>
  );
}
