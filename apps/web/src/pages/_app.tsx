import "../styles/globals.css";
import "../styles/tiptap.css";
import type { AppProps } from "next/app";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { CommunityNavigationBar } from "@codeup/components/community";
import { PostButton } from "@codeup/components/community/post";
import { useUserInfo } from "@codeup/hooks";
import { CourseNavigationBar } from "@codeup/components/course";
import { NavigationBar, Footer } from "@codeup/components/global";

const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "dark",
  },
});

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <DefaultSeo
        description={"SEO description"}
        additionalMetaTags={[
          {
            name: "keywords",
            content: "seo, keywords",
          },
        ]}
        openGraph={{
          type: "website",
          locale: "en_US",
          url: "https://codeup.space/",
          site_name: "CodeUp",
          images: [
            {
              url: "https://ben-siebert.de/assets/brand/cartoon.jpg",
              width: 512,
              height: 512,
              alt: "SEO Image",
              type: "image/jpg",
            },
          ],
        }}
        twitter={{
          handle: "@OfficialMCTzOCK",
          cardType: "summary_large_image",
        }}
      />
      <ChakraProvider theme={theme}>
        <Box minH="100vh" minW="100%">
          <NavigationBar />
          <Box minH={"96vh"}>
            {router.pathname.startsWith("/community") ? (
              <CommunityNavigationBar />
            ) : null}
            {router.pathname.startsWith("/course") ||
            router.pathname.startsWith("/explore") ? (
              <CourseNavigationBar />
            ) : null}
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
