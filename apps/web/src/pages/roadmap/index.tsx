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

export default function Index() {
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
          title: "Fehler",
          description: "Es ist ein Fehler aufgetreten: " + res.payload.error,
        });
      } else {
        setRoadmaps(res.payload.roadmaps);
      }
    });
  };

  return (
    <>
      {!loaded ? (
        <>
          <AuthenticateLoadingIndicator />
        </>
      ) : (
        <>
          <Box mt={4}></Box>
          <SuperText>Roadmaps</SuperText>
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
                    title: "Neue Roadmap",
                    helperText: "Gib einen Namen für die Roadmap ein",
                    inputType: "INPUT",
                  });

                  if (!name) return;

                  const res = await REST.Roadmap.createRoad({
                    token: AccountManager.getActiveToken(),
                    name,
                  });

                  if (res.status !== 200) {
                    PopupManager.alert({
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
            entries={roadmaps.map((r) => {
              return {
                fields: [
                  {
                    icon: <FaLightbulb />,
                    text: "Idee Verlinkt: " + (r.projectIdea ? "Ja" : "Nein"),
                  },
                  {
                    icon: <FaCode />,
                    text:
                      "Projekt Verlinkt: " + (r.linkedProject ? "Ja" : "Nein"),
                  },
                  {
                    icon: <FaBookOpen />,
                    text: "Kurse Verlinkt: " + r.linkedCourses.length,
                  },
                  {
                    icon: <FaProjectDiagram />,
                    text: "Flows Verlinkt: " + r.linkedFlows.length,
                  },
                  {
                    icon: <FaCheck />,
                    text: "Todos Verlinkt: " + r.linkedTodos.length,
                  },
                ],
                title: r.name,
                buttonRows: [
                  {
                    buttons: [
                      {
                        text: "Öffnen",
                        icon: <FaEye />,
                        disabled: false,
                        colorScheme: "blue",
                        onClick: () => {
                          router.push("/roadmap/" + r._id);
                        },
                      },
                    ],
                  },
                  {
                    buttons: [
                      {
                        text: "Löschen",
                        icon: <FaTrash />,
                        disabled: false,
                        colorScheme: "red",
                        onClick: async () => {
                          if (
                            !(await PopupManager.confirmAsync({
                              title: "Löschen",
                              question:
                                "Willst du die Roadmap wirklich löschen?",
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
                              title: "Fehler",
                              description:
                                "Es ist ein Fehler aufgetreten: " +
                                res.payload.error,
                            });
                            return;
                          }

                          reload();
                        },
                      },
                      {
                        text: "Umbenennen",
                        icon: <FaPen />,
                        colorScheme: "green",
                        disabled: false,
                        onClick: async () => {
                          const name = await PopupManager.promptAsync({
                            title: "Umbenennen",
                            helperText:
                              "Gib einen neuen Namen für die Roadmap ein",
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
                              title: "Fehler",
                              description:
                                "Es ist ein Fehler aufgetreten: " +
                                res.payload.error,
                            });
                            return;
                          }

                          reload();
                        },
                      },
                    ],
                  },
                ],
              };
            })}
          />
        </>
      )}
    </>
  );
}
