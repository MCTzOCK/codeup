/**
 * apps/web/src/pages/account/developer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.2024
 *
 */

import * as React from "react";
import { useLoggedIn, useUserLoggedInRedirect } from "@codeup/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { sProp } from "../../global/i18nstaticProps";
import Head from "next/head";

export default function Developer() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const router = useRouter();
  const { userInfo, loggedIn, loaded } = useLoggedIn();
  const { t } = useTranslation("account");

  return (
    <>
      <Head>
        <title>{t("dev.doc.title")}</title>
      </Head>
      <h1>{t("dev.title")}</h1>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["account"])),
  };
}
