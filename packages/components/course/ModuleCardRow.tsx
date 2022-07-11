/**
 * src/components/course/ModuleCardRow.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.07.2022
 *
 */

import * as React from "react";
import { Flex } from "@chakra-ui/react";
import { ReactElement } from "react";

export default function ModuleCardRow(props: { children: any }) {
  return (
    <Flex direction={"row"} gap={"3rem"} key={"0"}>
      {props.children}
    </Flex>
  );
}
