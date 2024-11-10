import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";
import "../styles/globals.scss";
import "../styles/tiptap.css";
import "reactflow/dist/style.css";
import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import useAnalytics from "@codeup/hooks/hooks/useAnalytics";
import { useLoggedIn } from "@codeup/hooks";
import AccountManager from "@codeup/util/dist/AccountManager";
import Tracker from "../special-components/Tracker";
import "../styles/rrweb.custom.css";
import { appWithTranslation } from "next-i18next";
import PopupManager from "../global/PopupManager";
import Provider from "../global/Provider";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [usingMv2, setUsingMv2] = React.useState(false);

  useEffect(() => {
    PopupManager.__reload_raw_translated();
  }, []);

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
        <div id={"__codeup_other_component_render_space_do_not_use"}></div>
        <Provider
          noLayout={
            // @ts-ignore
            Component.noLayout
              ? // @ts-ignore
                Component.noLayout
              : router.query.noLayout === "true"
              ? true
              : usingMv2
          }
        >
          <Component {...pageProps} />
        </Provider>
      </Tracker>
    </>
  );
}

export default appWithTranslation(App);
