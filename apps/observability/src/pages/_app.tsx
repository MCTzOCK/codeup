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
//import "rrweb-player/dist/style.css";
import "../styles/rrweb.custom.css";
import * as React from "react";
import { mantineTheme } from "@/mantine.theme";
import { MantineProvider } from "@mantine/core";
import { useRouter } from "next/router";
import AppLayout from "@/components/AppLayout";
import { RESTAPI } from "@codeup/rest/dist/makeRequest";
import { ModalsProvider } from "@mantine/modals";
import Script from "next/script";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
RESTAPI.path_prefix = "https://codeup.space";

export default function App({
  Component,
  pageProps,
}: {
  Component: React.ComponentType<any>;
  pageProps: any;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Script
        src={
          "http://localhost:3000/api/analytics/script?appId=6717e5bae3386bd4657330d6"
        }
      />
      <MantineProvider theme={mantineTheme} defaultColorScheme={"dark"}>
        <ModalsProvider>
          {isClient && (
            <ApolloProvider
              client={
                new ApolloClient({
                  uri: "/api/graphql",
                  cache: new InMemoryCache(),
                  headers: {
                    authorization: localStorage.getItem("token") as string,
                  },
                })
              }
            >
              {router.pathname.startsWith("/app") ? (
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              ) : (
                <Component {...pageProps} />
              )}
            </ApolloProvider>
          )}
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}
