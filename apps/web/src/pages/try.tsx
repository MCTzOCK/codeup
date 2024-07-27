/**
 * apps/web/src/pages/try.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.12.2022
 *
 */

import React, { useState } from "react";

// import @chakra-ui/react and @chakra-ui/card
import {
  Flex,
  Box,
  Heading,
  Text,
  ButtonGroup,
  Button,
  chakra,
} from "@chakra-ui/react";
import { Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/card";
import REST from "@codeup/rest";
import { CHeading } from "@codeup/components/global/CHeading";
import PopupManager from "../global/PopupManager";
import { sProp } from "../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function Try() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("try");

  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="100%"
        minH="100vh"
        p="2rem"
        bg={"#000"}
      >
        <Box w="100%" maxW="800px">
          <Card
            w={"100%"}
            h={"100%"}
            bgColor={"black"}
            rounded={"xl"}
            boxShadow={"xl"}
            p={5}
          >
            <CardHeader>
              <CHeading size="xl">{t("title")}</CHeading>
            </CardHeader>
            <CardBody mt={"2rem"}>
              <Text>{t("text")}</Text>
              <Text mt={2}>
                <chakra.span
                  color={"red.400"}
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                >
                  {t("warning")}
                </chakra.span>
                &nbsp;{t("warning.text")}
              </Text>
            </CardBody>
            <CardFooter mt={"2rem"}>
              <ButtonGroup
                w={"100%"}
                spacing={4}
                justifyContent={"center"}
                onClick={() => {}}
              >
                <Button
                  variant={"brand"}
                  w={"100%"}
                  onClick={async () => {
                    const r = await REST.Account.createTestAccount();

                    if (r.status === 200) {
                      localStorage.setItem("token", r.payload.token);
                      window.location.assign("/account/settings");
                    } else {
                      await PopupManager.alertAsync({
                        title: t("control.error", { ns: "base" }),
                        description:
                          t("control.error.request", { ns: "base" }) +
                          r.payload.error,
                      });
                    }
                  }}
                  isLoading={loading}
                >
                  {t("cta")}
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        </Box>
      </Flex>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["try"])),
  };
}
