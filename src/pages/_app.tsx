import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {Box, ChakraProvider, extendTheme} from '@chakra-ui/react';
import React from 'react';
import {DefaultSeo} from "next-seo";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

const theme = extendTheme({
    config: {
        useSystemColorMode: false,
        initialColorMode: 'dark',
    }
});

function App({Component, pageProps}: AppProps) {

    return (
        <>
            <DefaultSeo
                description={
                    'SEO description'
                }
                additionalMetaTags={[
                    {
                        name: "keywords",
                        content: "seo, keywords"
                    }
                ]}
                openGraph={{
                    type: 'website',
                    locale: 'en_US',
                    url: 'https://codeup.ben-siebert.de/',
                    site_name: 'CodeUp',
                    images: [
                        {
                            url: 'https://ben-siebert.de/assets/brand/cartoon.jpg',
                            width: 512,
                            height: 512,
                            alt: 'SEO Image',
                            type: 'image/jpg',
                        },
                    ],
                }}
                twitter={{
                    handle: '@OfficialMCTzOCK',
                    cardType: 'summary_large_image',
                }}
            />
            <ChakraProvider theme={theme}>
                <Box minH="100vh" minW="100%">
                    <NavigationBar />
                    <Box minH={"96vh"}>
                        <Component {...pageProps} />
                    </Box>
                    <Footer />
                </Box>
            </ChakraProvider>
        </>
    );
}


export default App;