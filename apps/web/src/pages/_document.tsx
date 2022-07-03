/**
 * src/pages/_document.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import * as React from "react";
import { Head, Html, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";

export default function Document() {
  return (
    <Html lang={"en"}>
      <Head />
      <body>
        <ColorModeScript initialColorMode={"dark"} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
