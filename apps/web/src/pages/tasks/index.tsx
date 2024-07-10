/**
 * apps/web/src/pages/tasks/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.07.2024
 *
 */

import * as React from "react";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../global/PopupManager";
import { Box, useDisclosure } from "@chakra-ui/react";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { FaClock, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { FaCube } from "react-icons/fa6";
import { useRouter } from "next/router";
import TaskListViewer from "@codeup/components/tasks/TaskListViewer";
import Head from "next/head";

export default function Tasks() {
  const router = useRouter();
  const [lists, setLists] = React.useState<
    {
      _id: string;
      name: string;
      owner: string;
      createdAt: string;
      items: any[];
    }[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  React.useEffect(() => {
    reloadLists();
  }, []);

  const reloadLists = async () => {
    const res = await REST.ToDo.V2.getMyLists(AccountManager.getActiveToken());

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "ToDo-Listen konnten nicht geladen werden: " + res.payload.error,
      });
      return;
    }

    setLists(res.payload.lists);
    setLoading(false);

    if (currentList) {
      const newList = res.payload.lists.find(
        (l: any) => l._id === currentList._id
      );
      if (newList) {
        setCurrentList(newList);
      }
    }
  };

  const [currentList, setCurrentList] = React.useState<
    | {
        _id: string;
        name: string;
        owner: string;
        createdAt: string;
        items: {
          createdAt: string;
          _id: string;
          name: string;
          done: boolean;
          description: string;
          list: string;
        }[];
      }
    | undefined
  >(undefined);

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (loading) {
    return (
      <>
        <AuthenticateLoadingIndicator text={"Laden..."} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Tasks - CodeUp</title>
      </Head>
      <Box w={"100%"} bg={"#000"} minH={"100vh"} h={"fit-content"}>
        <GridLayoutV2
          pageTitle={"Aufgaben"}
          search={{
            show: true,
            fields: true,
          }}
          topButtons={[
            {
              variant: "brand",
              leftIcon: <FaPlus />,
              onClick: async () => {
                const name = await PopupManager.promptAsync({
                  title: "Neue Liste",
                  helperText: "Bitte gib den Namen der neuen Liste ein",
                });

                if (!name) return;

                const res = await REST.ToDo.V2.createList(
                  AccountManager.getActiveToken(),
                  name
                );

                if (res.status !== 200) {
                  await PopupManager.alertAsync({
                    title: "Fehler",
                    description:
                      "Die Liste konnte nicht erstellt werden: " +
                      res.payload.error,
                  });
                  return;
                }

                await reloadLists();
              },
              text: "Neu",
            },
          ]}
          entries={lists.map((l) => {
            return {
              title: l.name,
              fields: [
                {
                  icon: <FaClock />,
                  text: new Date(l.createdAt).toLocaleString(),
                },
                {
                  icon: <FaCube />,
                  text: l.items.length + " Einträge",
                },
              ],
              buttonRows: [
                [
                  {
                    text: "Öffnen",
                    variant: "brand",
                    leftIcon: <FaEye />,
                    onClick: () => {
                      setCurrentList(l);
                      onOpen();
                    },
                  },
                  {
                    text: "Löschen",
                    colorScheme: "red",
                    leftIcon: <FaTrash />,
                    onClick: async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: "Löschen",
                          question: "Möchtest du die Liste wirklich löschen?",
                        }))
                      )
                        return;

                      const res = await REST.ToDo.V2.deleteList(
                        AccountManager.getActiveToken(),
                        l._id
                      );

                      if (res.status !== 200) {
                        await PopupManager.alertAsync({
                          title: "Fehler",
                          description:
                            "Die Liste konnte nicht gelöscht werden: " +
                            res.payload.error,
                        });
                        return;
                      }

                      await reloadLists();
                    },
                  },
                ],
              ],
            };
          })}
        />
      </Box>
      <TaskListViewer
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
        list={currentList}
        reloadLists={reloadLists}
      />
    </>
  );
}
