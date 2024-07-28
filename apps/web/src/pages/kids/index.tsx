/**
 * apps/web/src/pages/kids/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.04.2023
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import GridLayout from "@codeup/components/dist/global/GridLayout";
import REST from "@codeup/rest/src/index";
import AccountManager from "@codeup/util/dist/AccountManager";
import { FaEye, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import PopupManager from "../../global/PopupManager";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import { Box } from "@chakra-ui/react";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function KidsDashboard() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();
  const router = useRouter();
  const { t } = useTranslation("kids");
  const [projects, setProjects] = React.useState<
    {
      _id: string;
      name: string;
      code: string;
      owner: string;
    }[]
  >([]);

  React.useEffect(() => {
    if (loaded && !loggedIn) {
      router.push("/#login");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    } else {
      if (userInfo) {
        reload();
      }
    }
  }, [loggedIn, loaded]);

  const reload = () => {
    REST.Kids.getProjects(AccountManager.getActiveToken()).then((res) => {
      if (res.status !== 200) {
        PopupManager.alertAsync({
          title: t("base:control.error"),
          description: t("control.error.request") + res.payload.error,
        });
        return;
      }

      setProjects(res.payload.projects);
    });
  };

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      {!loggedIn ? (
        <>
          <AuthenticateLoadingIndicator />
        </>
      ) : (
        <>
          <Box pt={4} pb={4} bg={"#000"} h={"fit-content"} minH={"100vh"}>
            <GridLayoutV2
              pageTitle={t("title")}
              entries={projects.map((p) => ({
                title: p.name,
                fields: [
                  {
                    text: "",
                    icon: undefined,
                  },
                ],
                buttonRows: [
                  [
                    {
                      text: t("open"),
                      leftIcon: <FaEye />,
                      onClick: () => {
                        router.push(`/kids/${p._id}`);
                      },
                      variant: "brand",
                    },
                    {
                      text: t("rename"),
                      onClick: async () => {
                        const newName = await PopupManager.promptAsync({
                          title: t("rename.p.title"),
                          inputType: "INPUT",
                          helperText: t("rename.p.helper"),
                        });

                        if (!newName) return;

                        const res = await REST.Kids.updateProject({
                          token: AccountManager.getActiveToken(),
                          name: newName,
                          id: p._id,
                        });

                        if (res.status !== 200) {
                          PopupManager.alertAsync({
                            title: t("base:control.error"),
                            description:
                              t("base:control.error.request") +
                              res.payload.error,
                          });
                          return;
                        }

                        reload();

                        PopupManager.alertAsync({
                          title: t("renamed"),
                          description: t("renamed.text"),
                        });
                      },
                      leftIcon: <FaPen />,
                      variant: "brand",
                    },
                  ],
                  [
                    {
                      text: t("delete"),
                      onClick: async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: t("delete.p.title"),
                            question: t("delete.p.helper"),
                          }))
                        )
                          return;

                        const res = await REST.Kids.deleteProject({
                          token: AccountManager.getActiveToken(),
                          id: p._id,
                        });

                        if (res.status !== 200) {
                          PopupManager.alertAsync({
                            title: t("base:control.error"),
                            description:
                              t("base:control.error.request") +
                              res.payload.error,
                          });
                          return;
                        }

                        reload();
                      },
                      leftIcon: <FaTrash />,
                      colorScheme: "red",
                    },
                  ],
                ],
              }))}
              topButtons={[
                {
                  text: t("new"),
                  leftIcon: <FaPlus />,
                  variant: "brand",
                  onClick: async () => {
                    const name = await PopupManager.promptAsync({
                      title: t("new.p.title"),
                      inputType: "INPUT",
                      helperText: t("new.p.helper"),
                    });

                    if (!name) return;

                    const res = await REST.Kids.createProject({
                      name,
                      token: AccountManager.getActiveToken(),
                    });
                    if (res.status !== 200) {
                      PopupManager.alertAsync({
                        title: t("base:control.error"),
                        description:
                          t("base:control.error.request") + res.payload.error,
                      });
                      return;
                    }

                    reload();
                  },
                },
              ]}
              search={{
                show: true,
                fields: true,
              }}
            />
          </Box>
        </>
      )}
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["kids"])),
  };
}
