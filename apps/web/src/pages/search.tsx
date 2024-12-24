/**
 * apps/web/src/pages/search.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.12.2024
 *
 */

import * as React from "react";
import { sProp } from "../global/i18nstaticProps";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function Search() {
  const { t } = useTranslation("search");

  return (
    <>
      <Head>
        <title>{t("page.title")}</title>
      </Head>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["search"])),
  };
}
