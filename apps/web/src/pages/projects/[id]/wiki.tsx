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

export default function Wiki() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

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
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
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
        title: "Fehler",
        description:
          "Die Seiten konnten nicht geladen werden: " + res.payload.error,
      });
      return;
    }

    setPages(res.payload.pages);
  };

  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={2}>
          <GridLayoutV2
            pageTitle={"Wiki"}
            search={{
              show: true,
              fields: true,
            }}
            topButtons={[
              {
                text: "Neue Seite",
                leftIcon: <FaPlus />,
                variant: "brand",
                onClick: async () => {
                  const name = await PopupManager.promptAsync({
                    title: "Neue Seite",
                    helperText: "Bitte gib den Namen der neuen Seite ein.",
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
                      title: "Fehler",
                      description:
                        "Die Seite konnte nicht erstellt werden: " +
                        res.payload.error,
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
                      text: "Öffnen",
                      leftIcon: <FaEye />,
                      variant: "brand",
                      onClick: () => {
                        router.push(
                          "/projects/" + router.query.id + "/wiki/" + page._id
                        );
                      },
                    },
                    {
                      text: "Löschen",
                      leftIcon: <FaTrash />,
                      colorScheme: "red",
                      onClick: async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: "Seite löschen",
                            question:
                              "Willst du diese Seite wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden!",
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
                            title: "Fehler",
                            description:
                              "Die Seite konnte nicht gelöscht werden: " +
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
                      "Erstellt: " + new Date(page.createdAt).toLocaleString(),
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
