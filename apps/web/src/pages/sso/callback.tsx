/**
 * apps/web/src/pages/sso/callback.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.09.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import Head from "next/head";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    if (window) {
      const urlSearchParams = new URLSearchParams(window.location.search);

      const params = Object.fromEntries(urlSearchParams.entries());

      if (params.token) {
        localStorage.setItem("token", params.token);
        router.push("/");
      } else {
        router.push("/error?error=Kein Token erhalten.");
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Laden...</title>
      </Head>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        w={"100%"}
        h={"100vh"}
        bg={"#000"}
      >
        <Spinner size={"xl"} />
      </Flex>
    </>
  );
}
