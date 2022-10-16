/**
 * apps/web/src/pages/error.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.10.2022
 *
 */

import * as React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Error() {
  const router = useRouter();

  return (
    <>
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Fehler!</AlertTitle>
        <AlertDescription>{router.query.error}</AlertDescription>
      </Alert>
    </>
  );
}
