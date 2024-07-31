/**
 * apps/web/src/pages/projects/[id]/wiki.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.05.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../../types/IProject";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/editorv2/EditorProjectLayout";
import { Box } from "@chakra-ui/react";
import { FaClock, FaEye, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { IWikiPage } from "../../../types/IWikiPage";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function Wiki() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("projects");

  const [project, setProject] = React.useState<IProject | null>(null);
  const [pages, setPages] = React.useState<IWikiPage[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then(async (res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reloadPages();
      } else {
        PopupManager.alertAsync({
          title: t("base:control.error"),
          description: t("project.loading.error") + ": " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const reloadPages = async () => {
    const res = await REST.Projects.wikiPages(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: t("base:control.error"),
        description: t("wiki.loading.error") + ": " + res.payload.error,
      });
      return;
    }

    setPages(res.payload.pages);
  };

  return (
    <>
      <Head>
        <title>{t("wiki.doc.title")}</title>
      </Head>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={2}>
          <GridLayoutV2
            pageTitle={t("wiki.title")}
            search={{
              show: true,
              fields: true,
            }}
            topButtons={[
              {
                text: t("wikie.page.new"),
                leftIcon: <FaPlus />,
                variant: "brand",
                onClick: async () => {
                  const name = await PopupManager.promptAsync({
                    title: t("wikie.page.new"),
                    helperText: t("wiki.page.new.name"),
                  });

                  if (!name) return;

                  const res = await REST.Projects.createWikiPage(
                    AccountManager.getActiveToken(),
                    router.query.id as string,
                    name,
                    "# " + name
                  );

                  if (res.status !== 200) {
                    await PopupManager.alertAsync({
                      title: t("base:control.error"),
                      description:
                        t("wiki.page.new.error") + ": " + res.payload.error,
                    });
                    return;
                  }

                  await reloadPages();
                },
              },
            ]}
            entries={pages.map((page) => {
              return {
                title: page.title,
                buttonRows: [
                  [
                    {
                      text: t("open"),
                      leftIcon: <FaEye />,
                      variant: "brand",
                      onClick: () => {
                        router.push(
                          "/projects/" + router.query.id + "/wiki/" + page._id
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
                            title: t("wiki.page.delete"),
                            question: t("wiki.page.delete.confirm"),
                          }))
                        )
                          return;

                        const res = await REST.Projects.deleteWikiPage(
                          AccountManager.getActiveToken(),
                          router.query.id as string,
                          page._id
                        );

                        if (res.status !== 200) {
                          await PopupManager.alertAsync({
                            title: t("base:control.error"),
                            description:
                              t("wiki.page.delete.error") +
                              ": " +
                              res.payload.error,
                          });
                          return;
                        }

                        await reloadPages();
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
                          helperText: t("wiki.page.rename.name"),
                        });

                        if (!newName) return;
                        const res = await REST.Projects.updateWikiPage(
                          AccountManager.getActiveToken(),
                          router.query.id as string,
                          page._id,
                          newName,
                          page.content
                        );

                        if (res.status !== 200) {
                          await PopupManager.alertAsync({
                            title: t("base:control.error"),
                            description:
                              t("wiki.page.rename.error") +
                              ": " +
                              res.payload.error,
                          });
                          return;
                        }

                        await reloadPages();
                      },
                    },
                  ],
                ],
                fields: [
                  {
                    text:
                      t("wiki.page.created") +
                      ": " +
                      new Date(page.createdAt).toLocaleString(),
                    icon: <FaClock />,
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
