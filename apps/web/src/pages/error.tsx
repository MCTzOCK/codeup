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

export default function Error() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Fehler - CodeUp</title>
      </Head>
      <ErrorComponent
        description={router.query.error as string}
        title={"Fehler"}
        image={"/_static/vectors/error/500_v2.svg"}
      />
    </>
  );
}
