/**
 * apps/game/src/ui/Layout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */

import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";

export default function Layout(props: {
  children: React.ReactElement | React.ReactNode;
}) {
  return (
    <React.StrictMode>
      <ChakraProvider theme={theme}>{props.children}</ChakraProvider>
    </React.StrictMode>
  );
}
