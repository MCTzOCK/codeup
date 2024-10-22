/**
 * apps/observability/src/pages/_app.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.10.2024
 *
 */

import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";
import * as React from "react";
import { mantineTheme } from "@/mantine.theme";
import { MantineProvider } from "@mantine/core";
import { useRouter } from "next/router";
import AppLayout from "@/components/AppLayout";
import { RESTAPI } from "@codeup/rest/dist/makeRequest";
import { ModalsProvider } from "@mantine/modals";
RESTAPI.path_prefix = "https://codeup.space";

export default function App({
  Component,
  pageProps,
}: {
  Component: React.ComponentType<any>;
  pageProps: any;
}) {
  const router = useRouter();

  return (
    <>
      <MantineProvider theme={mantineTheme} defaultColorScheme={"dark"}>
        <ModalsProvider>
          {router.pathname.startsWith("/app") ? (
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}
