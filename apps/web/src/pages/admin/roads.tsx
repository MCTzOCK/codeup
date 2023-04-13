/**
 * apps/web/src/pages/admin/roads.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.04.2023
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../global/PopupManager";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
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
  FaUser,
} from "react-icons/fa";
import GridLayout from "@codeup/components/dist/global/GridLayout";
import { Box } from "@chakra-ui/react";
import SuperText from "@codeup/components/dist/landingpage/SuperText";

export default function Kids() {
  const router = useRouter();
  const [error, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
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

  const reload = () => {
    REST.Admin.getRoads(AccountManager.getActiveToken()).then((res) => {
      if (res.status !== 200) {
        setError(true);
        setLoading(false);
        return;
      } else {
        setLoading(false);
        setRoadmaps(res.payload.roads);
      }
    });
  };

  React.useEffect(() => {
    reload();
  }, []);
  return (
    <>
      <AdminLayout>
        {loading ? (
          <>
            <AuthenticateLoadingIndicator text={"Lade Roads..."} />
          </>
        ) : (
          <>
            {error ? (
              <>
                <ErrorComponent
                  description={"Es ist ein Fehler aufgetreten."}
                />
              </>
            ) : (
              <>
                <Box mt={6}></Box>
                <SuperText>Roadmaps</SuperText>
                <GridLayout
                  search={{
                    allow: true,
                    searchFields: true,
                  }}
                  specialEntries={[]}
                  entries={roadmaps.map((r) => {
                    return {
                      fields: [
                        {
                          icon: <FaUser />,
                          text: "Besitzer: " + r.owner,
                        },
                        {
                          icon: <FaLightbulb />,
                          text:
                            "Idee Verlinkt: " + (r.projectIdea ? "Ja" : "Nein"),
                        },
                        {
                          icon: <FaCode />,
                          text:
                            "Projekt Verlinkt: " +
                            (r.linkedProject ? "Ja" : "Nein"),
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
        )}
      </AdminLayout>
    </>
  );
}
