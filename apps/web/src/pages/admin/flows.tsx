/**
 * apps/web/src/pages/admin/flows.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.04.2023
 *
 */

import * as React from "react";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import REST from "@codeup/rest/src";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import { Box, useToast } from "@chakra-ui/react";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import { FaEye, FaPlus, FaTrash, FaUser } from "react-icons/fa";
import PopupManager from "../../global/PopupManager";
import GridLayout from "@codeup/components/dist/global/GridLayout";
import { useRouter } from "next/router";

export default function Flows() {
  const [flows, setFlows] = React.useState<any[]>([]);
  const [error, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  const reload = () => {
    REST.Admin.getFlows(localStorage.getItem("token") as string).then((res) => {
      if (res.status === 200) {
        setFlows(res.payload.flows);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  };

  React.useEffect(() => {
    reload();
  }, []);

  const router = useRouter();
  const toast = useToast();

  return (
    <>
      <AdminLayout>
        {loading ? (
          <AuthenticateLoadingIndicator text={"Lade Flows..."} />
        ) : (
          <>
            {error ? (
              <>
                <ErrorComponent
                  description={
                    "Beim Laden der Flows ist ein Fehler aufgetreten."
                  }
                />
              </>
            ) : (
              <>
                <Box mt={6}></Box>
                <SuperText>Flows</SuperText>
                <GridLayout
                  search={{
                    allow: true,
                    searchFields: true,
                  }}
                  specialEntries={[]}
                  entries={flows.map((p) => {
                    return {
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
                              icon: <FaEye />,
                              colorScheme: "blue",
                              onClick: () => {
                                router.push("/planning/" + p._id);
                              },
                            },
                          ],
                        },
                        {
                          buttons: [
                            {
                              text: "Löschen",
                              icon: <FaTrash />,
                              colorScheme: "red",
                              onClick: async () => {
                                REST.ToDo.deleteV2Project({
                                  token: localStorage.getItem(
                                    "token"
                                  ) as string,
                                  id: p._id,
                                }).then((res) => {
                                  if (res.status === 200) {
                                    toast({
                                      position: "bottom-right",
                                      status: "success",
                                      title: "Erfolgreich",
                                      description: "Das Projekt wurde gelöscht",
                                      isClosable: true,
                                      duration: 1500,
                                    });
                                    reload();
                                  } else {
                                    toast({
                                      position: "bottom-right",
                                      status: "error",
                                      title: "Fehler",
                                      description: res.payload.error,
                                      isClosable: true,
                                      duration: 1500,
                                    });
                                  }
                                });
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
