import '../styles/globals.css';
import "../styles/tiptap.css";
import type {AppProps} from 'next/app';
import {Box, ChakraProvider, extendTheme} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {DefaultSeo} from "next-seo";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import {useRouter} from "next/router";
import PostButton from "../components/community/post/PostButton";
import useUserInfo from "../hooks/useUserInfo";
import CommunityNavigationBar from "../components/community/CommunityNavigationBar";
import {appWithTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const theme = extendTheme({
    config: {
        useSystemColorMode: false,
        initialColorMode: 'dark',
    }
});

function App({Component, pageProps}: AppProps) {

    const router = useRouter();

    const [showPostButton, setShowPostButton] = useState(false);

    const userInfo = useUserInfo();

    useEffect(() => {
        if(userInfo.id !== "") {
            setShowPostButton(true);
        }
    }, [userInfo])

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
                    <NavigationBar/>
                    <Box minH={"96vh"}>
                        {
                            router.pathname.startsWith("/community") ?
                                <CommunityNavigationBar />
                                : null
                        }
                        <Component {...pageProps} />
                        {
                            router.pathname.startsWith("/community") && showPostButton ?
                                <PostButton/>
                                : null
                        }
                    </Box>
                    <Footer/>
                </Box>
            </ChakraProvider>
        </>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'account', 'navbar']),
        }
    }
}


export default appWithTranslation(App);