/**
 * apps/web/src/pages/sso/error.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.09.2022
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
import Head from "next/head";

export default function Error() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Login Fehlgeschlagen - CodeUp</title>
      </Head>
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Fehler beim Anmelden!</AlertTitle>
        <AlertDescription>{router.query.error}</AlertDescription>
      </Alert>
    </>
  );
}
