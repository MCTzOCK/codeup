/**
 * packages/components/global/DividerWithTextV2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.06.2024
 *
 */

import { Divider, Flex, Text } from "@chakra-ui/react";
import * as React from "react";

export default function DividerWithTextV2(props: {
  text?: string;
  color?: string;
}) {
  return (
    <>
      <Flex align="center">
        <Divider />
        <Text
          padding="2"
          color={props.color ? props.color : "brand.500"}
          fontWeight={"bold"}
        >
          {props.text ? props.text : ""}
        </Text>
        <Divider />
      </Flex>
    </>
  );
}
