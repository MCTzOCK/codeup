/**
 * packages/vt-desktop/src/system/SystemProvider.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.11.2024
 *
 */

import * as React from "react";
import { Box } from "@chakra-ui/react";

export default function SystemProvider(props: { children: React.ReactNode }) {
  return (
    <Box w={"100%"} h={"100vh"} bgColor={"transparent"} maxH={"100vh"}>
      {props.children}
    </Box>
  );
}
