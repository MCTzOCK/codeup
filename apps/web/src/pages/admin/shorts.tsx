/**
 * apps/web/src/pages/admin/shorts.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.04.2023
 *
 */

import * as React from "react";
import AdminLayout from "@codeup/components/dist/admin/AdminLayout";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import { Box } from "@chakra-ui/react";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import GridLayout from "@codeup/components/dist/global/GridLayout";
import { FaLink, FaPlus, FaTrash } from "react-icons/fa";
import PopupManager from "../../global/PopupManager";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { sProp } from "../../global/i18nstaticProps";

export default function Shorts() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<boolean>(false);

  const [shorts, setShorts] = React.useState<
    {
      createdAt: string;
      short: string;
      destination: string;
      _id: string;
    }[]
  >([]);

  React.useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    REST.Admin.getShorts(AccountManager.getActiveToken()).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        setShorts(res.payload as any);
      } else {
        setError(true);
      }
    });
  };

  return (
    <>
      <AdminLayout>
        {loading ? (
          <AuthenticateLoadingIndicator text={"Lade Shorts..."} />
        ) : (
          <>
            {error ? (
              <>
                <ErrorComponent
                  description={
                    "Beim Laden der Shorts ist ein Fehler aufgetreten."
                  }
                />
              </>
            ) : (
              <>
                <GridLayoutV2
                  pageTitle={"Shorts"}
                  search={{
                    show: true,
                    fields: true,
                  }}
                  topButtons={[
                    {
                      text: "Neu",
                      leftIcon: <FaPlus />,
                      variant: "brand",
                      onClick: async () => {
                        const short = await PopupManager.promptAsync({
                          title: "Short erstellen",
                          inputType: "INPUT",
                          helperText: "Die Kurz-URL",
                        });

                        if (!short) return;

                        const destination = await PopupManager.promptAsync({
                          title: "Short erstellen",
                          inputType: "INPUT",
                          helperText: "Die Ziel-URL",
                        });

                        if (!destination) return;

                        const res = await REST.Admin.createShort({
                          token: AccountManager.getActiveToken(),
                          short,
                          dest: destination,
                        });

                        if (res.status === 200) {
                          reload();
                        } else {
                          PopupManager.alert({
                            title: "Fehler",
                            description:
                              "Beim Erstellen des Shorts ist ein Fehler aufgetreten: " +
                              res.payload.error,
                          });
                        }
                      },
                    },
                  ]}
                  entries={shorts.map((s) => ({
                    title: `https://codeup.space/${s.short}`,
                    fields: [
                      {
                        icon: <FaLink />,
                        text: s.destination,
                      },
                    ],
                    buttonRows: [
                      [
                        {
                          text: "Löschen",
                          leftIcon: <FaTrash />,
                          disabled: false,
                          colorScheme: "red",
                          onClick: async () => {
                            if (
                              !(await PopupManager.confirmAsync({
                                title: "Short löschen",
                                question: `Möchtest du den Short https://codeup.space/${s.short} wirklich löschen?`,
                              }))
                            )
                              return;

                            const res = await REST.Admin.deleteShort({
                              token: AccountManager.getActiveToken(),
                              short: s._id,
                            });

                            if (res.status === 200) {
                              reload();
                            } else {
                              PopupManager.alert({
                                title: "Fehler",
                                description:
                                  "Beim Löschen des Shorts ist ein Fehler aufgetreten: " +
                                  res.payload.error,
                              });
                            }
                          },
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
