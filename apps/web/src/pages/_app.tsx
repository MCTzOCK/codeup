import "../styles/globals.scss";
import "../styles/tiptap.css";
import "reactflow/dist/style.css";
import type { AppProps } from "next/app";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { CommunityNavigationBar } from "@codeup/components/community";
import { PostButton } from "@codeup/components/community/post";
import { Footer, NavigationBar } from "@codeup/components/global";
import ForumNavigationBar from "@codeup/components/forum/ForumNavigationBar";
import CommandPalette from "@codeup/components/global/CommandPalette";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import { GoogleAnalytics } from "nextjs-google-analytics";
import REST from "@codeup/rest";
import useAnalytics from "@codeup/hooks/hooks/useAnalytics";
import theme from "../global/theme";
import { useLoggedIn } from "@codeup/hooks";
import AccountManager from "@codeup/util/dist/AccountManager";
import Tracker from "../special-components/Tracker";
import "../styles/rrweb.custom.css";
/*
// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== "undefined") {
  // @ts-ignore
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    // @ts-ignore
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
    autocapture: true,
  });
}*/

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const [usingMv2, setUsingMv2] = React.useState(false);

  useEffect(() => {}, []);

  useEffect(() => {
    if (loaded && loggedIn) {
      /*
      posthog?.identify(userInfo.email, {
        name: userInfo.firstName + " " + userInfo.lastName,
        email: userInfo.email,
        username: userInfo.username,
      });*/
    }
  }, [loaded, loggedIn]);

  useAnalytics();

  useEffect(() => {
    if (!router || !router.query) return;
    if (router.query.codeup_mv2) {
      localStorage.setItem("using_codeup_mv2", "true");
      setUsingMv2(true);

      const { token } = router.query;
      if (!token) return;
      AccountManager.setActiveToken(token as string);
    } else {
      if (
        ![null, undefined, ""].includes(
          localStorage.getItem("using_codeup_mv2")
        )
      ) {
        setUsingMv2(true);
      }
    }
  }, [router, router.query]);

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => {
      //posthog?.capture("$pageview");
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <>
      <DefaultSeo
        description={
          "CodeUp ist eine Platform, um die Grundlagen der Programmierung mit interaktiven Videokursen zu erlernen."
        }
        additionalMetaTags={[
          {
            name: "keywords",
            content: "seo, keywords",
          },
        ]}
        openGraph={{
          type: "website",
          locale: "de_DE",
          url: "https://codeup.space/",
          site_name: "CodeUp",
          title: "CodeUp - Programmieren lernen",
          description:
            "CodeUp ist eine Platform, um die Grundlagen der Programmierung mit interaktiven Videokursen zu erlernen.",
          images: [
            {
              url: "https://codeup.space/codeup-splash-github.jpg",
              alt: "Splash Image of CodeUp",
              type: "image/jpg",
              width: 1200,
              height: 630,
            },
          ],
        }}
        twitter={{
          handle: "@OfficialMCTzOCK",
          cardType: "summary_large_image",
        }}
      />
      <Tracker>
        <ChakraProvider theme={theme}>
          <CommandPalette />
          <Box minH="100vh" minW="100%">
            <div id={"__codeup_other_component_render_space_do_not_use"}></div>
            {!usingMv2 && (
              <NavigationBar
                disablePricing={
                  process.env.NEXT_PUBLIC_DISABLE_PAYMENTS === "true"
                }
              />
            )}
            <Box
              minH={"96vh"}
              bg={router.pathname.startsWith("/forum") ? "#000" : undefined}
            >
              {router.pathname.startsWith("/community") ? (
                <CommunityNavigationBar />
              ) : null}
              {router.pathname.startsWith("/forum") ? (
                <ForumNavigationBar />
              ) : null}

              <Box id={"__codeup_manual_mount_point"}></Box>

              <Component {...pageProps} />

              {router.pathname.startsWith("/community") ? <PostButton /> : null}
            </Box>
            {!usingMv2 && <Footer />}
          </Box>
        </ChakraProvider>
      </Tracker>
    </>
  );
}

export default App;
