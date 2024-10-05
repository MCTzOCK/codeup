/**
 * apps/web/src/pages/account/developer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.2024
 *
 */

import * as React from "react";
import { useLoggedIn, useUserLoggedInRedirect } from "@codeup/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { sProp } from "../../global/i18nstaticProps";
import Head from "next/head";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { FaLink, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { FaFileLines, FaHashtag } from "react-icons/fa6";
import PopupManager from "../../global/PopupManager";

export default function Developer() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const router = useRouter();
  const { userInfo, loggedIn, loaded } = useLoggedIn();
  const { t } = useTranslation("account");

  const [apps, setApps] = React.useState<
    {
      _id: string;
      name: string;
      description: string;
      redirectUris: string[];
    }[]
  >([]);

  useEffect(() => {
    if (!loaded || !loggedIn) return;
    reloadApps();
  }, [loggedIn, loaded]);

  const reloadApps = async () => {
    const res = await REST.Developer.getApps(AccountManager.getActiveToken());
    if (res.status !== 200) return;
    setApps(res.payload.apps);
  };

  return (
    <>
      <Head>
        <title>{t("dev.doc.title")}</title>
      </Head>
      <Box bg={"#000"} h={"fit-content"} minH={"100vh"}>
        <GridLayoutV2
          pageTitle={t("dev.title")}
          search={{
            show: true,
            fields: true,
          }}
          topButtons={[
            {
              text: t("dev.create"),
              leftIcon: <FaPlus />,
              variant: "brand",
              onClick: async () => {
                await PopupManager.alertAsync({
                  title: t("dev.create"),
                  description: (
                    <>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();

                          const fd = new FormData(e.target as HTMLFormElement);

                          const res = await REST.Developer.createApp(
                            AccountManager.getActiveToken(),
                            {
                              name: fd.get("app-name") as string,
                              description: fd.get("app-desc") as string,
                              redirectUris:
                                fd
                                  .get("app-redirect")
                                  ?.toString()
                                  .split("\n") || [],
                            }
                          );

                          if (res.status === 200) {
                            await reloadApps();
                            PopupManager.removeCurrentPopup();
                          } else {
                            PopupManager.alert({
                              title: t("base:error.error"),
                              description:
                                t("base:control.error.request") +
                                res.payload.error,
                            });
                          }
                        }}
                      >
                        <Stack gap={2}>
                          <FormControl isRequired>
                            <FormLabel>{t("dev.app.name")}</FormLabel>
                            <Input
                              placeholder={t("dev.app.name")}
                              name={"app-name"}
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel>{t("dev.app.desc")}</FormLabel>
                            <Textarea
                              placeholder={t("dev.app.desc")}
                              name={"app-desc"}
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel>{t("dev.app.redirect")}</FormLabel>
                            <Textarea
                              placeholder={t("dev.app.redirect.desc")}
                              name={"app-redirect"}
                            />
                          </FormControl>
                          <Button
                            type={"submit"}
                            variant={"brand"}
                            leftIcon={<FaPlus />}
                          >
                            {t("dev.create")}
                          </Button>
                        </Stack>
                      </form>
                    </>
                  ),
                });
              },
            },
          ]}
          entries={apps.map((app) => ({
            title: app.name,
            buttonRows: [
              [
                {
                  text: t("dev.delete"),
                  colorScheme: "red",
                  leftIcon: <FaTrash />,
                  onClick: async () => {
                    if (
                      !(await PopupManager.confirmAsync({
                        title: t("dev.delete"),
                        question: t("dev.delete.desc"),
                      }))
                    ) {
                      return;
                    }

                    const res = await REST.Developer.deleteApp(
                      AccountManager.getActiveToken(),
                      app._id
                    );

                    if (res.status === 200) {
                      await reloadApps();
                      PopupManager.removeCurrentPopup();
                    } else {
                      PopupManager.alert({
                        title: t("base:error.error"),
                        description:
                          t("base:control.error.request") + res.payload.error,
                      });
                    }
                  },
                },
                {
                  text: t("dev.edit"),
                  variant: "brand",
                  leftIcon: <FaPen />,
                  onClick: async () => {
                    await PopupManager.alertAsync({
                      title: t("dev.edit"),
                      description: (
                        <>
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();

                              const fd = new FormData(
                                e.target as HTMLFormElement
                              );

                              const res = await REST.Developer.updateApp(
                                AccountManager.getActiveToken(),
                                app._id,
                                {
                                  name: fd.get("app-name") as string,
                                  description: fd.get("app-desc") as string,
                                  redirectUris:
                                    fd
                                      .get("app-redirect")
                                      ?.toString()
                                      .split("\n") || [],
                                }
                              );

                              if (res.status === 200) {
                                await reloadApps();
                                PopupManager.removeCurrentPopup();
                              } else {
                                PopupManager.alert({
                                  title: t("base:error.error"),
                                  description:
                                    t("base:control.error.request") +
                                    res.payload.error,
                                });
                              }
                            }}
                          >
                            <Stack gap={2}>
                              <FormControl isRequired>
                                <FormLabel>{t("dev.app.name")}</FormLabel>
                                <Input
                                  placeholder={t("dev.app.name")}
                                  name={"app-name"}
                                  defaultValue={app.name}
                                />
                              </FormControl>
                              <FormControl isRequired>
                                <FormLabel>{t("dev.app.desc")}</FormLabel>
                                <Textarea
                                  placeholder={t("dev.app.desc")}
                                  name={"app-desc"}
                                  defaultValue={app.description}
                                />
                              </FormControl>
                              <FormControl isRequired>
                                <FormLabel>{t("dev.app.redirect")}</FormLabel>
                                <Textarea
                                  placeholder={t("dev.app.redirect.desc")}
                                  name={"app-redirect"}
                                  defaultValue={app.redirectUris.join("\n")}
                                />
                              </FormControl>
                              <Button
                                type={"submit"}
                                variant={"brand"}
                                leftIcon={<FaPen />}
                              >
                                {t("dev.edit")}
                              </Button>
                            </Stack>
                          </form>
                        </>
                      ),
                    });
                  },
                },
              ],
            ],
            fields: [
              {
                icon: <FaHashtag />,
                text: app._id,
              },
              {
                icon: <FaFileLines />,
                text: app.description,
              },
              {
                icon: <FaLink />,
                text: app.redirectUris.join(", "),
              },
            ],
          }))}
        />
      </Box>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["account"])),
  };
}
