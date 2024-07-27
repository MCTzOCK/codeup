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
import { useRouter } from "next/router";
import ErrorComponent from "@codeup/components/global/ErrorComponent";
import Head from "next/head";
import { sProp } from "../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Error() {
  const router = useRouter();

  const { t } = useTranslation("error");

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <ErrorComponent
        description={router.query.error as string}
        title={t("title")}
        image={"/_static/vectors/error/500_v2.svg"}
      />
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["error"])),
  };
}
