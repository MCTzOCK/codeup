/**
 * src/pages/404.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.06.2022
 *
 */

import * as React from "react";
import { Button, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import ErrorComponent from "@codeup/components/global/ErrorComponent";

export default function NotFound() {
  return (
    <>
      <ErrorComponent
        description={"Die angeforderte Seite konnte nicht gefunden werden."}
        title={"Seite nicht gefunden"}
        image={"/_static/vectors/error/404.svg"}
      />
    </>
  );
}
