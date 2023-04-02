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

export default function KidsDashboard() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();
  const router = useRouter();
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
          title: "Fehler",
          description: "Es ist ein Fehler aufgetreten: " + res.payload.error,
        });
        return;
      }

      setProjects(res.payload.projects);
    });
  };

  return (
    <>
      {!loggedIn ? (
        <>
          <AuthenticateLoadingIndicator />
        </>
      ) : (
        <>
          <Box mt={4}></Box>
          <SuperText>CodeUp Kids</SuperText>
          <GridLayout
            search={{
              allow: true,
              searchFields: true,
            }}
            specialEntries={[
              {
                icon: <FaPlus />,
                onClick: async () => {
                  const name = await PopupManager.promptAsync({
                    title: "Neues Projekt",
                    inputType: "INPUT",
                    helperText: "Gib einen Namen für dein Projekt ein",
                  });

                  if (!name) return;

                  const res = await REST.Kids.createProject({
                    name,
                    token: AccountManager.getActiveToken(),
                  });
                  if (res.status !== 200) {
                    PopupManager.alertAsync({
                      title: "Fehler",
                      description:
                        "Es ist ein Fehler aufgetreten: " + res.payload.error,
                    });
                    return;
                  }

                  reload();
                },
              },
            ]}
            entries={projects.map((p) => ({
              title: p.name,
              fields: [],
              buttonRows: [
                {
                  buttons: [
                    {
                      text: "Öffnen",
                      onClick: () => {
                        router.push(`/kids/${p._id}`);
                      },
                      icon: <FaEye />,
                      colorScheme: "blue",
                      disabled: false,
                    },
                  ],
                },
                {
                  buttons: [
                    {
                      text: "Umbenennen",
                      onClick: async () => {
                        const newName = await PopupManager.promptAsync({
                          title: "Projekt umbenennen",
                          inputType: "INPUT",
                          helperText:
                            "Gib einen neuen Namen für dein Projekt ein",
                        });

                        if (!newName) return;

                        const res = await REST.Kids.updateProject({
                          token: AccountManager.getActiveToken(),
                          name: newName,
                          id: p._id,
                        });

                        if (res.status !== 200) {
                          PopupManager.alertAsync({
                            title: "Fehler",
                            description:
                              "Es ist ein Fehler aufgetreten: " +
                              res.payload.error,
                          });
                          return;
                        }

                        reload();

                        PopupManager.alertAsync({
                          title: "Projekt umbenannt",
                          description:
                            "Dein Projekt wurde erfolgreich umbenannt.",
                        });
                      },
                      icon: <FaPen />,
                      colorScheme: "green",
                      disabled: false,
                    },
                  ],
                },
                {
                  buttons: [
                    {
                      text: "Löschen",
                      onClick: async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: "Projekt löschen",
                            question:
                              "Bist du dir sicher, dass du das Projekt löschen möchtest?",
                          }))
                        )
                          return;

                        const res = await REST.Kids.deleteProject({
                          token: AccountManager.getActiveToken(),
                          id: p._id,
                        });

                        if (res.status !== 200) {
                          PopupManager.alertAsync({
                            title: "Fehler",
                            description:
                              "Es ist ein Fehler aufgetreten: " +
                              res.payload.error,
                          });
                          return;
                        }

                        reload();
                      },
                      icon: <FaTrash />,
                      colorScheme: "red",
                      disabled: false,
                    },
                  ],
                },
              ],
            }))}
          />
        </>
      )}
    </>
  );
}
