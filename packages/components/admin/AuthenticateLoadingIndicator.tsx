/**
 * packages/components/admin/AuthenticateLoadingIndicator.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.22
 *
 */

import * as React from "react";
import { Flex, CircularProgress, Heading } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

export default function AuthenticateLoadingIndicator(props: {
  text?: string;
  inline?: boolean;
}) {
  const { t } = useTranslation("base");

  return (
    <>
      <Flex
        w={"100%"}
        h={!props.inline ? "100vh" : "fit-content"}
        justifyContent={"center"}
        alignItems={"center"}
        direction={"column"}
        bg={"#000"}
      >
        <CircularProgress size={"80px"} isIndeterminate color="brand.500" />
        <Heading size={"lg"} mt={4}>
          {props.text ? props.text : t("auth:title") + "..."}
        </Heading>
      </Flex>
    </>
  );
}
