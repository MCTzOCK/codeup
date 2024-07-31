/**
 * apps/web/src/pages/projects/[id]/wiki/[pageId].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.05.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../../../types/IProject";
import { IWikiPage } from "../../../../types/IWikiPage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/editorv2/EditorProjectLayout";
import { Box, Flex, IconButton, Link, Textarea } from "@chakra-ui/react";
import { FaPen, FaSave } from "react-icons/fa";
import Markdown from "markdown-to-jsx";
import { defaultMdOpts } from "../../../../global/md/defaultProps";
import { sProp } from "../../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function PageViewer() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("projects");

  const [project, setProject] = React.useState<IProject | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then(async (res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reloadPage();
      } else {
        PopupManager.alertAsync({
          title: t("base:control.error"),
          description: t("project.loading.error") + ": " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const [page, setPage] = React.useState<IWikiPage | null>(null);

  const reloadPage = async () => {
    const res = await REST.Projects.wikiPages(
      AccountManager.getActiveToken(),
      router.query.id as string,
      router.query.pageId as string
    );

    if (res.status !== 200) {
      PopupManager.alertAsync({
        title: t("base:control.error"),
        description: t("wiki.error.loading.page") + ": " + res.payload.error,
      });
      return;
    }

    setPage(res.payload.page);
  };

  const [editMode, setEditMode] = React.useState<boolean>(false);

  if (!project) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>{t("wiki.page.doc.title")}</title>
      </Head>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Flex
          w={"100%"}
          h={"fit-content"}
          minH={"100vh"}
          justifyContent={"center"}
          p={4}
        >
          <Box bg={"black"} rounded={"xl"} w={"100%"} maxW={"800px"} p={4}>
            <Flex w={"100%"} justifyContent={"space-between"}>
              <Link
                color={"brand.500"}
                href={"/projects/" + project._id + "/wiki"}
              >
                {t("back")}
              </Link>
              <IconButton
                aria-label={"Edit"}
                icon={editMode ? <FaSave /> : <FaPen />}
                colorScheme={"brand"}
                onClick={async () => {
                  if (!editMode) {
                    setEditMode(true);
                  } else {
                    const newContent = (
                      document.querySelector(
                        "#proj_wiki-page-content-edit"
                      ) as HTMLTextAreaElement
                    ).value;

                    const res = await REST.Projects.updateWikiPage(
                      AccountManager.getActiveToken(),
                      project._id,
                      page!._id,
                      page!.title,
                      newContent
                    );

                    if (res.status !== 200) {
                      PopupManager.alertAsync({
                        title: t("base:control.error"),
                        description:
                          t("wiki.page.saving.error") +
                          ": " +
                          res.payload.error,
                      });
                      return;
                    }

                    await reloadPage();

                    setEditMode(false);
                  }
                }}
                variant={"ghost"}
              />
            </Flex>
            {!editMode ? (
              <Markdown options={defaultMdOpts}>{page?.content || ""}</Markdown>
            ) : (
              <>
                <Textarea
                  minH={"300px"}
                  placeholder={t("wiki.page.enter.content")}
                  defaultValue={page?.content || ""}
                  id={"proj_wiki-page-content-edit"}
                />
              </>
            )}
          </Box>
        </Flex>
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
