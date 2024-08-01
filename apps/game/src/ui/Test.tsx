/**
 * apps/game/src/ui/Test.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */

import * as React from "react";
import { Box, Heading } from "@chakra-ui/react";

export default function Test() {
  return (
    <>
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          height: "50%",
        }}
        background={"gray.800"}
        rounded={"xl"}
        p={4}
      >
        <Heading color={"brand.500"}>Test!</Heading>
      </Box>
    </>
  );
}
