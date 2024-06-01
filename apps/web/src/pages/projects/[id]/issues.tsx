/**
 * apps/web/src/pages/projects/[id]/issues.tsx
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
import EditorProjectLayout from "@codeup/components/dist/editorv2/EditorProjectLayout";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { IIssue } from "../../../types/IIssue";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import {
  FaClock,
  FaEye,
  FaPen,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";

export default function Issues() {
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

        reloadIssues();
      } else {
        PopupManager.alertAsync({
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const [issues, setIssues] = React.useState<IIssue[]>([]);

  const reloadIssues = async () => {
    const x = await REST.Projects.getIssues(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (x.status === 200) {
      setIssues(x.payload.issues);
    } else {
      PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die Probleme konnten nicht empfangen werden: " + x.payload.error,
      });
    }
  };
  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={2}>
          <GridLayoutV2
            pageTitle={"Probleme"}
            search={{
              show: true,
              fields: true,
            }}
            topButtons={[
              {
                text: "Neues Problem",
                onClick: async () => {
                  await PopupManager.alertAsync({
                    title: "Neues Problem",
                    description: (
                      <>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();

                            const formD = new FormData(
                              e.target as HTMLFormElement
                            );

                            const title = formD.get("title") as string;
                            const description = formD.get(
                              "description"
                            ) as string;
                            const priority = formD.get("priority") as string;
                            const status = "open";

                            const res = await REST.Projects.createIssue(
                              AccountManager.getActiveToken(),
                              router.query.id as string,
                              title,
                              description,
                              priority,
                              status
                            );

                            if (res.status === 200) {
                              await reloadIssues();
                              PopupManager.removeCurrentPopup();
                            } else {
                              PopupManager.removeCurrentPopup();

                              await PopupManager.alertAsync({
                                title: "Fehler",
                                description:
                                  "Das Problem konnte nicht erstellt werden: " +
                                  res.payload.error,
                              });
                            }
                          }}
                        >
                          <Stack spacing={4}>
                            <FormControl isRequired>
                              <FormLabel>Titel</FormLabel>
                              <Input
                                name={"title"}
                                placeholder={"Mein Problem"}
                              />
                            </FormControl>
                            <FormControl isRequired>
                              <FormLabel>Beschreibung</FormLabel>
                              <Textarea
                                name={"description"}
                                placeholder={
                                  "Beschreibe das Problem (du kannst Markdown verwenden)"
                                }
                              />
                            </FormControl>
                            <FormControl isRequired>
                              <FormLabel>Priorität</FormLabel>
                              <Select
                                name={"priority"}
                                placeholder={"Wähle eine Priorität"}
                              >
                                <option value={"low"}>Niedrig</option>
                                <option value={"medium"}>Mittel</option>
                                <option value={"high"}>Hoch</option>
                              </Select>
                            </FormControl>
                            <Button variant={"brand"} type={"submit"}>
                              Erstellen
                            </Button>
                          </Stack>
                        </form>
                      </>
                    ),
                  });
                },
                variant: "brand",
                leftIcon: <FaPlus />,
              },
            ]}
            entries={issues.map((issue) => {
              return {
                title: issue.title,
                buttonRows: [
                  [
                    {
                      text: "Anzeigen",
                      leftIcon: <FaEye />,
                      variant: "brand",
                      onClick: async () => {
                        await PopupManager.alertAsync({
                          title: issue.title,
                          description: (
                            <>
                              <Box>
                                <b>Beschreibung:</b>
                                <br />
                                {issue.description}
                              </Box>
                              <Box>
                                <b>Erstellt:</b>
                                <br />
                                {new Date(issue.createdAt).toLocaleString()}
                              </Box>
                              <Box>
                                <b>Status:</b>
                                <br />
                                {issue.status === "open"
                                  ? "Offen"
                                  : issue.status === "closed"
                                  ? "Geschlossen"
                                  : "In Bearbeitung"}
                              </Box>
                              <Box>
                                <b>Priorität:</b>
                                <br />
                                {issue.priority === "low"
                                  ? "Niedrig"
                                  : issue.priority === "medium"
                                  ? "Mittel"
                                  : "Hoch"}
                              </Box>
                            </>
                          ),
                        });
                      },
                    },
                    {
                      text: "Schließen",
                      leftIcon: <FaTimesCircle />,
                      colorScheme: "red",
                      onClick: async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: "Schließen",
                            question:
                              "Möchtest du dieses Problem wirklich schließen?",
                          }))
                        )
                          return;

                        const res = await REST.Projects.updateIssue(
                          AccountManager.getActiveToken(),
                          router.query.id as string,
                          issue._id,
                          issue.title,
                          issue.description,
                          issue.priority,
                          "closed"
                        );

                        if (res.status === 200) {
                          await reloadIssues();
                        } else {
                          PopupManager.alertAsync({
                            title: "Fehler",
                            description:
                              "Das Problem konnte nicht geschlossen werden: " +
                              res.payload.error,
                          });
                        }
                      },
                      disabled: issue.status === "closed",
                    },
                  ],
                  [
                    {
                      text: "Bearbeiten",
                      leftIcon: <FaPen />,
                      variant: "brand",
                      onClick: async () => {
                        await PopupManager.alertAsync({
                          title: "Bearbeiten",
                          description: (
                            <>
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();

                                  const formD = new FormData(
                                    e.target as HTMLFormElement
                                  );

                                  const title = formD.get("title") as string;
                                  const description = formD.get(
                                    "description"
                                  ) as string;
                                  const priority = formD.get(
                                    "priority"
                                  ) as string;

                                  const res = await REST.Projects.updateIssue(
                                    AccountManager.getActiveToken(),
                                    router.query.id as string,
                                    issue._id,
                                    title,
                                    description,
                                    priority,
                                    issue.status
                                  );

                                  if (res.status === 200) {
                                    await reloadIssues();
                                    PopupManager.removeCurrentPopup();
                                  } else {
                                    PopupManager.removeCurrentPopup();

                                    await PopupManager.alertAsync({
                                      title: "Fehler",
                                      description:
                                        "Das Problem konnte nicht bearbeitet werden: " +
                                        res.payload.error,
                                    });
                                  }
                                }}
                              >
                                <Stack spacing={4}>
                                  <FormControl isRequired>
                                    <FormLabel>Titel</FormLabel>
                                    <Input
                                      name={"title"}
                                      placeholder={"Mein Problem"}
                                      defaultValue={issue.title}
                                    />
                                  </FormControl>
                                  <FormControl isRequired>
                                    <FormLabel>Beschreibung</FormLabel>
                                    <Textarea
                                      name={"description"}
                                      placeholder={
                                        "Beschreibe das Problem (du kannst Markdown verwenden)"
                                      }
                                      defaultValue={issue.description}
                                    />
                                  </FormControl>
                                  <FormControl isRequired>
                                    <FormLabel>Priorität</FormLabel>
                                    <Select
                                      name={"priority"}
                                      placeholder={"Wähle eine Priorität"}
                                      defaultValue={issue.priority}
                                    >
                                      <option value={"low"}>Niedrig</option>
                                      <option value={"medium"}>Mittel</option>
                                      <option value={"high"}>Hoch</option>
                                    </Select>
                                  </FormControl>
                                  <Button variant={"brand"} type={"submit"}>
                                    Speichern
                                  </Button>
                                </Stack>
                              </form>
                            </>
                          ),
                        });
                      },
                      disabled: issue.status === "closed",
                    },
                    {
                      text: "Löschen",
                      leftIcon: <FaTrash />,
                      colorScheme: "red",
                      onClick: async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: "Löschen",
                            question:
                              "Möchtest du dieses Problem wirklich löschen?",
                          }))
                        )
                          return;

                        const res = await REST.Projects.deleteIssue(
                          AccountManager.getActiveToken(),
                          router.query.id as string,
                          issue._id
                        );

                        if (res.status === 200) {
                          await reloadIssues();
                        } else {
                          PopupManager.alertAsync({
                            title: "Fehler",
                            description:
                              "Das Problem konnte nicht gelöscht werden: " +
                              res.payload.error,
                          });
                        }
                      },
                    },
                  ],
                ],
                fields: [
                  {
                    text:
                      "Erstellt: " + new Date(issue.createdAt).toLocaleString(),
                    icon: <FaClock />,
                  },
                  {
                    text:
                      "Status: " +
                      (issue.status === "open"
                        ? "Offen"
                        : issue.status === "closed"
                        ? "Geschlossen"
                        : "In Bearbeitung"),
                  },
                  {
                    text:
                      "Priorität: " +
                      (issue.priority === "low"
                        ? "Niedrig"
                        : issue.priority === "medium"
                        ? "Mittel"
                        : "Hoch"),
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
