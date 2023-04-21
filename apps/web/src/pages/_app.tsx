import "../styles/globals.scss";
import "../styles/tiptap.css";
import "reactflow/dist/style.css";
import type { AppProps } from "next/app";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import React, { useEffect } from "react";
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

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useAnalytics();

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
              url: "https://static.content.ben-siebert.de/api/public/dl/tIMG2cZT?inline=true",
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
      <ChakraProvider theme={theme}>
        <CommandPalette />
        <Box minH="100vh" minW="100%">
          <div id={"__codeup_other_component_render_space_do_not_use"}></div>
          <NavigationBar />
          <Box minH={"96vh"}>
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
          <Footer />
        </Box>
      </ChakraProvider>
    </>
  );
}

export default App;
