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
  colors: {
    "gray.100": "#C1C2C5",
    "gray.200": "#A6A7AB",
    "gray.300": "#909296",
    "gray.400": "#5c5f66",
    "gray.500": "#373A40",
    "gray.600": "#2C2E33",
    "gray.700": "#25262b",
    "gray.800": "#1A1B1E",
    "gray.900": "#141517",

    "red.100": "#ffe3e3",
    "red.200": "#ffc9c9",
    "red.300": "#ffa8a8",
    "red.400": "#ff8787",
    "red.500": "#ff6b6b",
    "red.600": "#fa5252",
    "red.700": "#f03e3e",
    "red.800": "#e03131",
    "red.900": "#c92a2a",

    "green.100": "#ebfbee",
    "green.200": "#d3f9d8",
    "green.300": "#b2f2bb",
    "green.400": "#8ce99a",
    "green.500": "#69db7c",
    "green.600": "#51cf66",
    "green.700": "#40c057",
    "green.800": "#37b24d",
    "green.900": "#2f9e44",

    "blue.100": "#d0ebff",
    "blue.200": "#a5d8ff",
    "blue.300": "#74c0fc",
    "blue.400": "#4dabf7",
    "blue.500": "#339af0",
    "blue.600": "#228be6",
    "blue.700": "#1c7ed6",
    "blue.800": "#1971c2",
    "blue.900": "#1864ab",

    "cyan.100": "#c5f6fa",
    "cyan.200": "#99e9f2",
    "cyan.300": "#66d9e8",
    "cyan.400": "#3bc9db",
    "cyan.500": "#22b8cf",
    "cyan.600": "#15aabf",
    "cyan.700": "#1098ad",
    "cyan.800": "#0c8599",
    "cyan.900": "#0b7285",

    "teal.100": "#e6fcf5",
    "teal.200": "#c3fae8",
    "teal.300": "#96f2d7",
    "teal.400": "#63e6be",
    "teal.500": "#38d9a9",
    "teal.600": "#20c997",
    "teal.700": "#12b886",
    "teal.800": "#0ca678",
    "teal.900": "#099268",
    black: "#101113",
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
