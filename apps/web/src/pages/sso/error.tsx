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
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Error() {
  const router = useRouter();

  const { t } = useTranslation("sso");

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>{t("alert.title")}</AlertTitle>
        <AlertDescription>{router.query.error}</AlertDescription>
      </Alert>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["sso"])),
  };
}
