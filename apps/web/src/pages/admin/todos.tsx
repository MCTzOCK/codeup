/**
 * apps/web/src/pages/admin/todos.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.04.2023
 *
 */

import * as React from "react";
import AdminLayout from "@codeup/components/dist/admin/AdminLayout";
import { useRouter } from "next/router";
import { Box, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import REST from "@codeup/rest/src";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import { FaCheck, FaEye, FaPlus, FaTrash, FaUser } from "react-icons/fa";
import PopupManager from "../../global/PopupManager";
import AccountManager from "@codeup/util/dist/AccountManager";
import GridLayout from "@codeup/components/dist/global/GridLayout";
import ListViewer from "@codeup/components/dist/todo/ListViewer";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { sProp } from "../../global/i18nstaticProps";

export default function Todos() {
  const [error, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const router = useRouter();
  const toast = useToast();

  const [lists, setLists] = React.useState<
    {
      _id: string;
      name: string;
      owner: string;
      tasks: {
        name: string;
        finished: boolean;
        description: string;
        uuid: string;
      }[];
    }[]
  >([]);

  const [currentList, setCurrentList] = React.useState<{
    _id: string;
    name: string;
    owner: string;
    tasks: {
      name: string;
      finished: boolean;
      description: string;
      uuid: string;
    }[];
  } | null>(null);

  useEffect(() => {
    reloadLists();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  async function reloadLists() {
    const res = await REST.Admin.getTodos(
      localStorage.getItem("token") as string
    );

    setLoading(false);
    if (res.status === 200) {
      setLists(res.payload.lists);

      if (currentList) {
        setCurrentList(
          res.payload.lists.find((e: any) => e._id === currentList._id)
        );
      }
    } else {
      setError(true);
    }
  }

  return (
    <>
      <AdminLayout>
        {loading ? (
          <AuthenticateLoadingIndicator text={"Lade Listen..."} />
        ) : (
          <>
            {error ? (
              <>
                <ErrorComponent description={"Fehler beim Laden der Listen."} />
              </>
            ) : (
              <>
                <GridLayoutV2
                  pageTitle={"Todos"}
                  search={{
                    show: true,
                    fields: true,
                  }}
                  topButtons={[]}
                  entries={lists.map((list) => {
                    return {
                      title: list.name,
                      fields: [
                        {
                          icon: <FaUser />,
                          text: "Besitzer: " + (list.owner as any).username,
                        },
                        {
                          icon: <FaCheck />,
                          text:
                            "Erledigt: " +
                            list.tasks.filter((task) => task.finished).length +
                            "/" +
                            list.tasks.length,
                        },
                      ],
                      buttonRows: [
                        [
                          {
                            text: "Öffnen",
                            leftIcon: <FaEye />,
                            variant: "brand",
                            onClick: () => {
                              setCurrentList(list);
                              onOpen();
                            },
                          },
                          {
                            text: "Löschen",
                            leftIcon: <FaTrash />,
                            colorScheme: "red",
                            onClick: async () => {
                              if (
                                await PopupManager.confirmAsync({
                                  title: "Liste löschen",
                                  question:
                                    "Willst du die Liste wirklich löschen?",
                                })
                              ) {
                                const res = await REST.ToDo.deleteList({
                                  token: AccountManager.getActiveToken(),
                                  listId: list._id,
                                });

                                if (res.status === 200) {
                                  reloadLists();
                                  return;
                                }

                                PopupManager.alert({
                                  title: "Fehler",
                                  description:
                                    "Die Liste konnte nicht gelöscht werden: " +
                                    res.payload.error,
                                });
                              }
                            },
                          },
                        ],
                      ],
                    };
                  })}
                />
              </>
            )}
          </>
        )}
        <ListViewer
          isOpen={isOpen}
          onClose={onClose}
          currentList={currentList}
          setCurrentList={setCurrentList}
          reloadLists={reloadLists}
        />
      </AdminLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, [])),
  };
}
