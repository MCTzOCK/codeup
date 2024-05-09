/**
 * src/pages/505.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.06.2022
 *
 */

import * as React from "react";
import { Flex, Heading } from "@chakra-ui/react";
import Image from "next/image";
import ErrorComponent from "@codeup/components/global/ErrorComponent";
import Head from "next/head";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Interner Server Fehler - CodeUp</title>
      </Head>
      <ErrorComponent
        description={
          "Die Seite kann aufgrund eines Fehlers nicht angezeigt werden."
        }
        title={"Interner Server Fehler"}
        image={"/_static/vectors/error/500_v2.svg"}
      />
    </>
  );
}
