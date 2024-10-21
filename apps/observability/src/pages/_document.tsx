/**
 * apps/observability/src/pages/_document.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.10.2024
 *
 */
import Document, { Html, Head, Main, NextScript } from "next/document";

export default function Doc() {
  return (
    <Html lang={"en"}>
      <Head>
        <meta charSet={"utf-8"} />
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
