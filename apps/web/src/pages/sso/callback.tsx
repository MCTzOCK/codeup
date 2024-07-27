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
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Callback() {
  const router = useRouter();

  const { t } = useTranslation("sso");

  useEffect(() => {
    if (window) {
      const urlSearchParams = new URLSearchParams(window.location.search);

      const params = Object.fromEntries(urlSearchParams.entries());

      if (params.token) {
        localStorage.setItem("token", params.token);
        router.push("/");
      } else {
        router.push(`/error?error=${t("error.no.token")}`);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>{t("loading")}</title>
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["sso"])),
  };
}
