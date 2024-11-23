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
import { Avatar, Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import REST from "@codeup/rest/src";
import { useEffect } from "react";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { useLoggedIn, useUserLoggedInRedirect } from "@codeup/hooks";
import { FaEnvelope } from "react-icons/fa";
import PopupManager from "../../global/PopupManager";

export default function UserPage() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("user-page");

  const { username } = router.query;

  const { userInfo } = useLoggedIn();

  const [page, setPage] = React.useState<{
    username: string;
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
          @{username} - {t("page.title")}
        </title>
      </Head>
      <Box w={"100%"} minH={"100vh"} h={"fit-content"} bg={"gray.900"}>
        <Flex
          justifyContent={"center"}
          pt={4}
          minW={"100%"}
          minH={"100vh"}
          pb={4}
        >
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
            {page ? (
              <>
                <Flex
                  justifyContent={"center"}
                  mb={4}
                  mt={4}
                  direction={{
                    base: "column",
                    md: "row",
                  }}
                  gap={8}
                  alignItems={"center"}
                >
                  <Avatar
                    size={"xl"}
                    name={page.displayName}
                    src={"/api/account/" + page.username + "/picture"}
                  />
                  <Flex direction={"column"} h={"100%"}>
                    <Heading size={"lg"}>{page.displayName}</Heading>
                    <p>@{page.username}</p>
                  </Flex>
                  <Box></Box>
                  <IconButton
                    aria-label={"Message"}
                    display={
                      userInfo && userInfo.username !== page.username
                        ? "flex"
                        : "none"
                    }
                    icon={<FaEnvelope />}
                    onClick={async () => {
                      const r = await REST.Forum.createChatV2({
                        user: page.username,
                        token: localStorage.getItem("token") as string,
                      });

                      if (r.status === 200) {
                        window.open(
                          "/forum/messages/" +
                            r.payload.chat._id +
                            "?noLayout=true",
                          "_blank"
                        );
                      } else {
                        await PopupManager.alertAsync({
                          title: t("base:control.error"),
                          description:
                            t("base:control.error.request") + r.payload.error,
                        });
                      }
                    }}
                    variant={"brand"}
                  />
                </Flex>
              </>
            ) : (
              <>
                <AuthenticateLoadingIndicator text={t("page.loading")} />
              </>
            )}
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
