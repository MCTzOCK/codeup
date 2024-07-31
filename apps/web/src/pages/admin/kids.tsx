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
import { Box } from "@chakra-ui/react";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { sProp } from "../../global/i18nstaticProps";

export default function Kids() {
  const router = useRouter();
  const [error, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [projects, setProjects] = React.useState<
    {
      _id: string;
      name: string;
      code: string;
      owner: {
        username: string;
      };
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
                <GridLayoutV2
                  pageTitle={"Kids Projekte"}
                  search={{
                    show: true,
                    fields: true,
                  }}
                  topButtons={[]}
                  entries={projects.map((p) => ({
                    title: p.name,
                    fields: [
                      {
                        text: "Besitzer: " + p.owner.username,
                        icon: <FaUser />,
                      },
                    ],
                    buttonRows: [
                      [
                        {
                          text: "Öffnen",
                          onClick: () => {
                            router.push(`/kids/${p._id}`);
                          },
                          leftIcon: <FaEye />,
                          variant: "brand",
                          disabled: false,
                        },
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
                          leftIcon: <FaPen />,
                          variant: "brand",
                          disabled: false,
                        },
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
                          leftIcon: <FaTrash />,
                          colorScheme: "red",
                          disabled: false,
                        },
                      ],
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, [])),
  };
}
