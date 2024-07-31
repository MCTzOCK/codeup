/**
 * apps/web/src/pages/projects/[id]/flows.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.06.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../../types/IProject";
import { IWikiPage } from "../../../types/IWikiPage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/dist/editorv2/EditorProjectLayout";
import { Box } from "@chakra-ui/react";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { FaClock, FaEye, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import byteSize from "byte-size";
import { FaHardDrive } from "react-icons/fa6";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function Flows() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("projects");

  const [project, setProject] = React.useState<IProject | null>(null);
  const [flows, setFlows] = React.useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then(async (res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reloadFlows();
      } else {
        PopupManager.alertAsync({
          title: t("base:control.error"),
          description: t("project.loading.error") + ": " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const reloadFlows = async () => {
    const res = await REST.Projects.getFlows(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: t("base:control.error"),
        description: t("flows.loading.error") + ": " + res.payload.error,
      });
      return;
    }

    setFlows(res.payload.flows);
  };

  return (
    <>
      <Head>
        <title>{t("flows.doc.title")}</title>
      </Head>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={2}>
          <GridLayoutV2
            pageTitle={t("flows.title")}
            search={{
              show: true,
              fields: true,
            }}
            topButtons={[
              {
                text: t("flows.new"),
                leftIcon: <FaPlus />,
                variant: "brand",
                onClick: async () => {
                  const name = await PopupManager.promptAsync({
                    title: t("flows.new"),
                    helperText: t("flows.new.name"),
                  });

                  if (!name) return;

                  const res = await REST.Projects.createFlow(
                    AccountManager.getActiveToken(),
                    router.query.id as string,
                    name
                  );

                  if (res.status !== 200) {
                    await PopupManager.alertAsync({
                      title: t("base:control.error"),
                      description:
                        t("flows.new.error") + ": " + res.payload.error,
                    });
                    return;
                  }

                  await reloadFlows();
                },
              },
            ]}
            entries={flows.map((flow) => {
              return {
                title: flow.name,
                buttonRows: [
                  [
                    {
                      text: t("open"),
                      leftIcon: <FaEye />,
                      variant: "brand",
                      onClick: () => {
                        router.push(
                          "/projects/" + router.query.id + "/flows/" + flow._id
                        );
                      },
                    },
                    {
                      text: t("delete"),
                      leftIcon: <FaTrash />,
                      colorScheme: "red",
                      onClick: async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: t("flows.delete"),
                            question: t("flows.delete.confirm"),
                          }))
                        )
                          return;

                        const res = await REST.Projects.deleteFlow(
                          AccountManager.getActiveToken(),
                          router.query.id as string,
                          flow._id
                        );

                        if (res.status !== 200) {
                          await PopupManager.alertAsync({
                            title: t("base:control.error"),
                            description:
                              t("flows.delete.error") +
                              ": " +
                              res.payload.error,
                          });
                          return;
                        }

                        await reloadFlows();
                      },
                    },
                  ],
                  [
                    {
                      text: t("rename"),
                      variant: "brand",
                      leftIcon: <FaPen />,
                      onClick: async () => {
                        const newName = await PopupManager.promptAsync({
                          title: t("rename"),
                          helperText: t("flows.rename.new.name"),
                        });

                        if (!newName) return;
                        const res = await REST.Projects.updateFlow(
                          AccountManager.getActiveToken(),
                          router.query.id as string,
                          flow._id,
                          newName,
                          flow.saved
                        );

                        if (res.status !== 200) {
                          await PopupManager.alertAsync({
                            title: t("base:control.error"),
                            description:
                              t("flows.rename.error") +
                              ": " +
                              res.payload.error,
                          });
                          return;
                        }

                        await reloadFlows();
                      },
                    },
                  ],
                ],
                fields: [
                  {
                    text:
                      t("flows.created") +
                      ": " +
                      new Date(flow.createdAt).toLocaleString(),
                    icon: <FaClock />,
                  },
                  {
                    text:
                      t("flows.saved.data") +
                      ": " +
                      byteSize(flow.saved).toString(),
                    icon: <FaHardDrive />,
                  },
                ],
              };
            })}
          />
        </Box>
      </EditorProjectLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["projects"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
