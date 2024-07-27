/**
 * packages/components/global/DividerWithText.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.10.22
 *
 */

import { Divider, Flex, Text } from "@chakra-ui/react";
import * as React from "react";
import { useTranslation } from "next-i18next";

export default function DividerWithText(props: {
  text?: string;
  color?: string;
}) {
  const { t } = useTranslation("base");
  return (
    <>
      <Flex align="center">
        <Divider />
        <Text
          padding="2"
          color={props.color ? props.color : "white"}
          textTransform={"uppercase"}
        >
          {props.text ? props.text.toUpperCase() : t("or")}
        </Text>
        <Divider />
      </Flex>
    </>
  );
}
