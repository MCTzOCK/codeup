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

export default function Flows() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

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
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
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
        title: "Fehler",
        description:
          "Die Flussdiagramme konnten nicht geladen werden: " +
          res.payload.error,
      });
      return;
    }

    setFlows(res.payload.flows);
  };

  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={2}>
          <GridLayoutV2
            pageTitle={"Flussdiagramme"}
            search={{
              show: true,
              fields: true,
            }}
            topButtons={[
              {
                text: "Neues Diagramm",
                leftIcon: <FaPlus />,
                variant: "brand",
                onClick: async () => {
                  const name = await PopupManager.promptAsync({
                    title: "Neues Flussdiagramm",
                    helperText:
                      "Bitte gib den Namen des neuen Flussdiagramms ein.",
                  });

                  if (!name) return;

                  const res = await REST.Projects.createFlow(
                    AccountManager.getActiveToken(),
                    router.query.id as string,
                    name
                  );

                  if (res.status !== 200) {
                    await PopupManager.alertAsync({
                      title: "Fehler",
                      description:
                        "Das Flussdiagramm konnte nicht erstellt werden: " +
                        res.payload.error,
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
                      text: "Öffnen",
                      leftIcon: <FaEye />,
                      variant: "brand",
                      onClick: () => {
                        router.push(
                          "/projects/" + router.query.id + "/flows/" + flow._id
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
                            title: "Flussdiagramm löschen",
                            question:
                              "Willst du dieses Flussdiagramm wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden!",
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
                            title: "Fehler",
                            description:
                              "Das Flussdiagramm konnte nicht gelöscht werden: " +
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
                      text: "Umbenennen",
                      variant: "brand",
                      leftIcon: <FaPen />,
                      onClick: async () => {
                        const newName = await PopupManager.promptAsync({
                          title: "Umbenennen",
                          helperText: "Bitte gib den neuen Namen ein.",
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
                            title: "Fehler",
                            description:
                              "Das Flussdiagramm konnte nicht umbenannt werden: " +
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
                      "Erstellt: " + new Date(flow.createdAt).toLocaleString(),
                    icon: <FaClock />,
                  },
                  {
                    text:
                      "Gespeicherte Daten: " + byteSize(flow.saved).toString(),
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
