/**
 * apps/web/src/pages/u/[username].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.11.2024
 *
 */

import * as React from "react";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import router from "next/router";
import { Box, Flex } from "@chakra-ui/react";
import REST from "@codeup/rest/src";
import { useEffect } from "react";

export default function UserPage() {
  const { t } = useTranslation("user-page");

  const { username } = router.query;

  const [page, setPage] = React.useState<{
    displayName: string;
    links: string[];
    readme: string;
  } | null>(null);

  useEffect(() => {
    if (!username) return;

    reload();
  }, [username]);

  const reload = async () => {
    const res = await REST.UserPages.getUserPage(
      username as string,
      localStorage.getItem("token") as string
    );

    if (res.status !== 200) {
      return;
    } else {
      setPage(res.payload.data);
    }
  };

  return (
    <>
      <Head>
        <title>
          {username} - {t("page.title")}
        </title>
      </Head>
      <Box w={"100%"} minH={"100vh"} h={"fit-content"} bg={"gray.900"}>
        <Flex justifyContent={"center"} pt={4} minW={"100%"} minH={"100vh"}>
          <Box
            bg={"black"}
            rounded={"lg"}
            p={2}
            minW={"400px"}
            w={{
              base: "100%",
              md: "80%",
              lg: "70%",
              xl: "60%",
            }}
          >
            {username}
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["user-page"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
