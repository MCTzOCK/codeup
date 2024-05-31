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

export default function PageViewer() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

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
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
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
        title: "Fehler",
        description:
          "Die Seite konnte nicht empfangen werden: " + res.payload.error,
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
                Zurück
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
                        title: "Fehler",
                        description:
                          "Die Seite konnte nicht gespeichert werden: " +
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
                  placeholder={"Seiteninhalt eingeben"}
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
