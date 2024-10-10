/**
 * apps/web/src/global/Provider.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.2024
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { MantineProvider } from "@mantine/core";
import { mantineTheme } from "./mantine.theme";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import CommandPalette from "@codeup/components/dist/global/CommandPalette";
import { Footer, NavigationBar } from "@codeup/components/dist/global";
import { CommunityNavigationBar } from "@codeup/components/dist/community";
import ForumNavigationBar from "@codeup/components/dist/forum/ForumNavigationBar";
import { PostButton } from "@codeup/components/dist/community/post";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

export default function Provider(props: {
  children: React.ReactNode;
  noLayout: boolean;
}) {
  const router = useRouter();

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <div id={"__codeup_manual_mount_point"} />
      <ChakraProvider theme={theme}>
        <MantineProvider theme={mantineTheme} defaultColorScheme={"dark"}>
          {isClient && (
            <>
              {router.pathname.startsWith("/admin-v2") ? (
                <>
                  <ApolloProvider
                    client={
                      new ApolloClient({
                        uri: "https://gql.codeup.space",
                        cache: new InMemoryCache(),
                        headers: {
                          authorization: localStorage.getItem(
                            "token"
                          ) as string,
                        },
                      })
                    }
                  >
                    <ChakraChildren usingMv2={props.noLayout}>
                      {props.children}
                    </ChakraChildren>
                  </ApolloProvider>
                </>
              ) : (
                <ChakraChildren usingMv2={props.noLayout}>
                  {props.children}
                </ChakraChildren>
              )}
            </>
          )}
        </MantineProvider>
      </ChakraProvider>
    </>
  );
}

function ChakraChildren(props: {
  children: React.ReactNode;
  usingMv2: boolean;
}) {
  const router = useRouter();
  return (
    <>
      <CommandPalette />
      <Box minH="100vh" minW="100%">
        {!props.usingMv2 && (
          <NavigationBar
            disablePricing={
              //process.env.NEXT_PUBLIC_DISABLE_PAYMENTS === "true"
              true
            }
            transparent={["/", "/home.v4"].includes(router.pathname as string)}
          />
        )}
        <Box
          minH={"96vh"}
          bg={router.pathname.startsWith("/forum") ? "#000" : undefined}
        >
          {router.pathname.startsWith("/forum") ? <ForumNavigationBar /> : null}

          <Box id={"__codeup_manual_mount_point"}></Box>

          {props.children}
        </Box>
        {!props.usingMv2 && (
          <Footer
            transparent={["/", "/home.v4"].includes(router.pathname as string)}
          />
        )}
      </Box>
    </>
  );
}
