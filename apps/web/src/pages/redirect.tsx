/**
 * apps/web/src/pages/redirect.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.08.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { sProp } from "../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Redirect() {
  const router = useRouter();

  const url = router.query.url;

  React.useEffect(() => {
    if (url) {
      if (typeof url === "string") {
        window.location.href = url;
      }
    }
  }, [url]);

  const { t } = useTranslation("redirect");

  return (
    <>
      <Head>
        <title>{t("redirect")}</title>
      </Head>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["redirect"])),
  };
}
