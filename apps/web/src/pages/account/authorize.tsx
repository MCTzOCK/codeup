/**
 * apps/web/src/pages/account/authorize.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.10.2024
 *
 */

import * as React from "react";
import { sProp } from "../../global/i18nstaticProps";
import { useLoggedIn, useUserLoggedInRedirect } from "@codeup/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { Box, Button, chakra, Divider, Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { CHeading } from "@codeup/components/dist/global/CHeading";

export default function Authorize() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const router = useRouter();
  const { userInfo, loggedIn, loaded } = useLoggedIn();
  const { t } = useTranslation("account");

  const { appId, redirect } = router.query;

  const [app, setApp] = React.useState<{
    _id: string;
    name: string;
    description: string;
    redirectUris: string[];
    verified: boolean;
  } | null>(null);

  useEffect(() => {
    if (!appId || !redirect) return;

    reloadApp();
  }, [appId, redirect]);

  const reloadApp = async () => {
    const res = await REST.Developer.getApp(
      AccountManager.getActiveToken(),
      appId as string
    );

    if (res.status !== 200) {
      router.push("/error?error=" + res.payload.error);
      return;
    }

    setApp(res.payload.app);
  };

  return (
    <>
      <Head>
        <title>{t("dev.app.doc.title")}</title>
      </Head>
      <Box bg={"#000"} h={"fit-content"} minH={"100vh"}>
        {!app && (
          <>
            <AuthenticateLoadingIndicator text={t("dev.app.loading")} />
          </>
        )}
        {app && (
          <>
            <Flex
              alignItems={"center"}
              justifyContent={"center"}
              w={"100%"}
              minH={"90vh"}
            >
              <Box
                maxW={["90%", "90%", "40%"]}
                bg={"gray.900"}
                p={4}
                rounded={"xl"}
                minW={["100px", "200px", "400px"]}
              >
                <CHeading size={"lg"} textAlign={"center"}>
                  {t("dev.app.authorize")}
                </CHeading>
                <Text fontSize={"lg"} fontWeight={"bold"} mt={4}>
                  {app.name}
                </Text>
                <Text fontSize={"md"}>{app.description}</Text>
                <Text fontSize={"md"} mt={4}>
                  {t("dev.app.authorize.redirect")}
                </Text>
                <Text fontSize={"md"} fontWeight={"bold"} mt={2}>
                  {redirect}
                </Text>
                <br />
                <Text fontSize={"md"}>{t("dev.app.authorize.text")}</Text>
                <Flex
                  justifyContent={"center"}
                  mt={4}
                  gap={4}
                  direction={["column", "column", "row"]}
                >
                  <Button
                    onClick={async () => {
                      router.push("/account/settings");
                    }}
                  >
                    {t("dev.app.authorize.cancel")}
                  </Button>
                  <Button
                    variant={"brand"}
                    onClick={async () => {
                      window.location.href = `/api/account/authorize?id=${
                        app._id
                      }&token=${AccountManager.getActiveToken()}&redirect=${redirect}`;
                    }}
                  >
                    {t("dev.app.authorize.button")}
                  </Button>
                </Flex>
                <Divider mt={4} mb={4} />
                {app.verified ? (
                  <>
                    <Text fontSize={"md"}>
                      <chakra.b color={"green.500"}>
                        {t("dev.app.authorize.official")}
                      </chakra.b>
                      &nbsp;
                      {t("dev.app.authorize.official.text")}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text fontSize={"md"}>
                      <chakra.b color={"red.500"}>
                        {t("dev.app.authorize.warning")}
                      </chakra.b>
                      &nbsp;
                      {t("dev.app.authorize.warning.text")}
                    </Text>
                  </>
                )}
              </Box>
            </Flex>
          </>
        )}
      </Box>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["account"])),
  };
}
