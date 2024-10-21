/**
 * apps/observability/src/pages/auth.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.10.2024
 *
 */

import * as React from "react";
import { Flex, Loader } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Auth() {
  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query) {
      return;
    }

    if (!router.query.token) {
      window.location.href = `https://codeup.space/account/authorize?appId=6716b5aa9fa93e4dc0283868&redirect=${
        window.location.origin + "/auth"
      }`;
    } else {
      localStorage.setItem("token", router.query.token as string);
      window.location.href = "/app";
    }
  }, [router, router.query, router.query.token]);

  return (
    <>
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Loader size={64} />
      </Flex>
    </>
  );
}
