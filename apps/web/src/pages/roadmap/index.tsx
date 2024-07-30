/**
 * apps/web/src/pages/roadmap/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.04.2023
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../global/PopupManager";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import GridLayout from "@codeup/components/dist/global/GridLayout";
import {
  FaBookOpen,
  FaCheck,
  FaCode,
  FaEye,
  FaLightbulb,
  FaPen,
  FaPlus,
  FaProjectDiagram,
  FaTrash,
} from "react-icons/fa";
import { Box } from "@chakra-ui/react";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function Index() {
  const { t } = useTranslation("roadmap");

  const { loggedIn, loaded, userInfo } = useLoggedIn();
  const [roadmaps, setRoadmaps] = React.useState<
    {
      owner: string;
      _id: string;
      name: string;
      projectIdea: string;
      linkedProject: string;
      linkedCourses: string[];
      linkedFlows: string[];
      linkedTodos: string[];
    }[]
  >([]);
  const router = useRouter();

  React.useEffect(() => {
    if (loaded && !loggedIn) {
      router.push("/#login");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    } else if (loaded && loggedIn) {
      reload();
    }
  }, [loggedIn, loaded, userInfo]);

  const reload = () => {
    REST.Roadmap.getMyRoads(AccountManager.getActiveToken()).then((res) => {
      if (res.status !== 200) {
        PopupManager.alert({
          title: t("base:control.error"),
          description: t("base:control.error.request") + res.payload.error,
        });
      } else {
        setRoadmaps(res.payload.roadmaps);
      }
    });
  };

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      {!loaded ? (
        <>
          <AuthenticateLoadingIndicator />
        </>
      ) : (
        <>
          <Box bg={"#000"} minH={"100vh"} h={"fit-content"}>
            <GridLayoutV2
              pageTitle={t("title")}
              search={{
                show: true,
                fields: true,
              }}
              topButtons={[
                {
                  variant: "brand",
                  text: t("new"),
                  leftIcon: <FaPlus />,
                  onClick: async () => {
                    const name = await PopupManager.promptAsync({
                      title: t("roadmap.new"),
                      helperText: t("roadmap.new.name"),
                      inputType: "INPUT",
                    });

                    if (!name) return;

                    const res = await REST.Roadmap.createRoad({
                      token: AccountManager.getActiveToken(),
                      name,
                    });

                    if (res.status !== 200) {
                      PopupManager.alert({
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
              entries={roadmaps.map((r) => {
                return {
                  fields: [
                    {
                      icon: <FaLightbulb />,
                      text:
                        t("roadmap.linked.idea") +
                        ": " +
                        (r.projectIdea ? t("yes") : t("no")),
                    },
                    {
                      icon: <FaCode />,
                      text:
                        t("roadmap.linked.project") +
                        ": " +
                        (r.linkedProject ? t("yes") : t("no")),
                    },
                    {
                      icon: <FaBookOpen />,
                      text:
                        t("roadmap.linked.courses") +
                        ": " +
                        r.linkedCourses.length,
                    },
                    {
                      icon: <FaProjectDiagram />,
                      text:
                        t("roadmap.linked.flows") + ": " + r.linkedFlows.length,
                    },
                    {
                      icon: <FaCheck />,
                      text:
                        t("roadmap.linked.todos") + ": " + r.linkedTodos.length,
                    },
                  ],
                  title: r.name,
                  buttonRows: [
                    [
                      {
                        text: t("open"),
                        leftIcon: <FaEye />,
                        disabled: false,
                        variant: "brand",
                        onClick: () => {
                          router.push("/roadmap/" + r._id);
                        },
                      },
                    ],
                    [
                      {
                        text: t("delete"),
                        leftIcon: <FaTrash />,
                        disabled: false,
                        colorScheme: "red",
                        onClick: async () => {
                          if (
                            !(await PopupManager.confirmAsync({
                              title: t("delete"),
                              question: t("delete.confirm"),
                            }))
                          ) {
                            return;
                          }

                          const res = await REST.Roadmap.deleteRoad({
                            token: AccountManager.getActiveToken(),
                            id: r._id,
                          });

                          if (res.status !== 200) {
                            PopupManager.alert({
                              title: t("base:control.error"),
                              description:
                                t("base:control.error.request") +
                                res.payload.error,
                            });
                            return;
                          }

                          reload();
                        },
                      },
                      {
                        text: t("rename"),
                        leftIcon: <FaPen />,
                        variant: "brand",
                        disabled: false,
                        onClick: async () => {
                          const name = await PopupManager.promptAsync({
                            title: t("rename"),
                            helperText: t("rename.name"),
                            inputType: "INPUT",
                          });

                          if (!name) return;

                          const res = await REST.Roadmap.updateRoad({
                            token: AccountManager.getActiveToken(),
                            update: {
                              name,
                            },
                            id: r._id,
                          });

                          if (res.status !== 200) {
                            PopupManager.alert({
                              title: t("base:control.error"),
                              description:
                                t("base:control.error.request") +
                                res.payload.error,
                            });
                            return;
                          }

                          reload();
                        },
                      },
                    ],
                  ],
                };
              })}
            />
          </Box>
        </>
      )}
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["roadmap"])),
  };
}
