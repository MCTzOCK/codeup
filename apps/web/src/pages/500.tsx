/**
 * src/pages/505.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.06.2022
 *
 */

import * as React from "react";
import { Flex, Heading } from "@chakra-ui/react";
import Image from "next/image";
import ErrorComponent from "@codeup/components/global/ErrorComponent";
import Head from "next/head";
import { sProp } from "../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function NotFound() {
  const { t } = useTranslation("500");

  return (
    <>
      <Head>
        <title>{t("500.doc.title")}</title>
      </Head>
      <ErrorComponent
        description={t("500.description")}
        title={t("500.title")}
        image={"/_static/vectors/error/500_v2.svg"}
      />
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["500"])),
  };
}
