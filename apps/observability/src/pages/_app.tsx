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
      <div suppressHydrationWarning>
        {typeof window === "undefined" ? null : (
          <MantineProvider theme={mantineTheme} defaultColorScheme={"dark"}>
            {router.pathname.startsWith("/app") ? (
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            ) : (
              <Component {...pageProps} />
            )}
          </MantineProvider>
        )}
      </div>
    </>
  );
}
