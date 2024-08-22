/**
 * apps/web/src/pages/codeventure/levels/my.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.08.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { FaClock, FaEye, FaPlus } from "react-icons/fa";
import router from "next/router";

export default function My() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
    redirectToLogin: true,
  });

  const [levels, setLevels] = useState<
    {
      createdAt: string;
      name: string;
      _id: string;
      user: string;
      content: string;
    }[]
  >([]);

  const reloadLevels = async () => {
    const res = await REST.Game.myLevels(AccountManager.getActiveToken());
    if (res.status === 200) {
      setLevels(res.payload.levels);
    } else {
      await PopupManager.alertAsync({
        title: t("base:control.error"),
        description: t("base:control.error.request") + res.payload.error,
      });
    }
  };

  useEffect(() => {
    reloadLevels();
  }, []);

  const { t } = useTranslation("game");

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <Box w={"100%"} h={"fit-content"} minH={"100vh"} bg={"#000"} p={4}>
        <GridLayoutV2
          pageTitle={t("title")}
          search={{
            show: true,
            fields: true,
          }}
          topButtons={[
            {
              text: t("level.new"),
              leftIcon: <FaPlus />,
              variant: "brand",
              onClick: async () => {
                const name = await PopupManager.promptAsync({
                  title: t("level.new"),
                  helperText: t("level.new.helper"),
                });

                if (!name) return;

                const res = await REST.Game.createLevel(
                  AccountManager.getActiveToken(),
                  name
                );

                if (res.status !== 200) {
                  await PopupManager.alertAsync({
                    title: t("base:control.error"),
                    description:
                      t("base:control.error.request") + res.payload.error,
                  });
                  return;
                }
                reloadLevels();
              },
            },
          ]}
          entries={levels.map((l) => ({
            title: l.name,
            fields: [
              {
                icon: <FaClock />,
                text: new Date(l.createdAt).toLocaleString(),
              },
            ],
            buttonRows: [
              [
                {
                  text: t("level.open"),
                  leftIcon: <FaEye />,
                  variant: "brand",
                  onClick: async () => {
                    router.push(`/codeventure/levels/${l._id}`);
                  },
                },
                {
                  text: t("level.delete"),
                  leftIcon: <FaEye />,
                  colorScheme: "red",
                  onClick: async () => {
                    if (
                      !(await PopupManager.confirmAsync({
                        title: t("level.delete"),
                        question: t("level.delete.confirm"),
                      }))
                    ) {
                      return;
                    }

                    const res = await REST.Game.deleteLevel(
                      AccountManager.getActiveToken(),
                      l._id
                    );

                    if (res.status !== 200) {
                      await PopupManager.alertAsync({
                        title: t("base:control.error"),
                        description:
                          t("base:control.error.request") + res.payload.error,
                      });
                      return;
                    }

                    reloadLevels();
                  },
                },
              ],
            ],
          }))}
        />
      </Box>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["game"])),
  };
}
