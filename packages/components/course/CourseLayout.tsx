/**
 * src/components/course/Layout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.06.2022
 *
 */

import * as React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { ReactElement } from "react";

export default function CourseLayout(props: {
  children: JSX.Element | JSX.Element[] | ReactElement | ReactElement[];
}) {
  return (
    <>
      <Flex w={"100%"} justifyContent={"center"}>
        <Box maxW={["100%", "65%"]} minW={["100%", "65%"]} padding={"2rem"}>
          {props.children}
        </Box>
      </Flex>
    </>
  );
}
