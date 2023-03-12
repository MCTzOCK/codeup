/**
 * packages/components/landingpage/SuperText.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.03.2023
 *
 */

import * as React from "react";
import { Box, Text } from "@chakra-ui/react";

export default function SuperText(props: { children: React.ReactNode }) {
  return (
    <>
      <Text fontWeight="extrabold" fontSize="4xl" mb={2} textAlign={"center"}>
        <Box as="span" display="inline-block" position="relative">
          {props.children}
          <Box
            as="span"
            display="block"
            position="absolute"
            bg={"blue.600"}
            w={"100%"}
            h={"1px"}
          />
        </Box>
      </Text>
    </>
  );
}
