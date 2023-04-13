/**
 * apps/web/src/pages/admin/kids.tsx
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
import { FaEye, FaPen, FaPlus, FaTrash, FaUser } from "react-icons/fa";
import GridLayout from "@codeup/components/dist/global/GridLayout";

export default function Kids() {
  const router = useRouter();
  const [error, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [projects, setProjects] = React.useState<
    {
      _id: string;
      name: string;
      code: string;
      owner: string;
    }[]
  >([]);

  const reload = () => {
    REST.Admin.getKidsProjects(AccountManager.getActiveToken()).then((res) => {
      if (res.status !== 200) {
        setError(true);
        setLoading(false);
        return;
      }

      setLoading(false);
      setProjects(res.payload.projects);
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
            <AuthenticateLoadingIndicator text={"Lade Projekte..."} />
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
                <GridLayout
                  search={{
                    allow: true,
                    searchFields: true,
                  }}
                  specialEntries={[]}
                  entries={projects.map((p) => ({
                    title: p.name,
                    fields: [
                      {
                        text: "Besitzer: " + p.owner,
                        icon: <FaUser />,
                      },
                    ],
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
        )}
      </AdminLayout>
    </>
  );
}
