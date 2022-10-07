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

export default function AuthenticateLoadingIndicator() {
  return (
    <>
      <Flex
        w={"100%"}
        h={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        direction={"column"}
      >
        <CircularProgress size={"80px"} isIndeterminate color="red.300" />
        <Heading size={"lg"} mt={4}>
          Authentifiziere...
        </Heading>
      </Flex>
    </>
  );
}
