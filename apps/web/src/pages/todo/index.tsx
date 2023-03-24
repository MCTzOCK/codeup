/**
 * apps/web/src/pages/todo/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.07.2022
 *
 */

import * as React from "react";
import { useEffect } from "react";
import redirect from "@codeup/util/src/userworkflow/redirect";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FaCheck, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import REST from "@codeup/rest";
import ListViewer from "@codeup/components/todo/ListViewer";
import GridLayout from "@codeup/components/global/GridLayout";
import Head from "next/head";
import PopupManager from "../../global/PopupManager";
import AccountManager from "@codeup/util/dist/AccountManager";

export default function Index() {
  const router = useRouter();
  const toast = useToast();

  const [lists, setLists] = React.useState<
    {
      _id: string;
      name: string;
      tasks: {
        name: string;
        finished: boolean;
        uuid: string;
      }[];
    }[]
  >([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    redirect({
      allowAnonymous: false,
      redirectTo: router.pathname,
      redirectToLogin: true,
      forceAnonymous: false,
    });
  }, [router]);

  useEffect(() => {
    reloadLists();
  }, []);

  async function reloadLists() {
    const res = await REST.ToDo.getMyLists(
      localStorage.getItem("token") as string
    );

    if (res.status === 200) {
      setLists(res.payload.lists);
    } else {
      toast({
        position: "top",
        variant: "solid",
        status: "error",
        title: "Fehler",
        description: res.payload.error,
        isClosable: true,
        duration: 6000,
      });
    }
  }

  const [currentList, setCurrentList] = React.useState<{
    _id: string;
    name: string;
    tasks: {
      name: string;
      finished: boolean;
      uuid: string;
    }[];
  } | null>(null);

  return (
    <>
      <Head>
        <title>ToDo - CodeUp</title>
      </Head>
      <Heading size={"xl"} textAlign={"center"} mt={"2rem"}>
        ToDo
      </Heading>
      <GridLayout
        search={{
          allow: true,
          searchFields: false,
        }}
        specialEntries={[
          {
            icon: <FaPlus />,
            onClick: async () => {
              const name = await PopupManager.promptAsync({
                title: "Neue Liste",
                helperText: "Gib den Namen der Liste ein",
              });

              if (!name) return;

              const res = await REST.ToDo.createList({
                token: localStorage.getItem("token") as string,
                name: name,
              });
              if (res.status === 200) {
                reloadLists();
                toast({
                  position: "top",
                  variant: "solid",
                  status: "success",
                  title: "Erfolgreich",
                  description: "Die Liste wurde erstellt",
                  isClosable: true,
                  duration: 6000,
                });
              } else {
                toast({
                  position: "top",
                  variant: "solid",
                  status: "error",
                  title: "Fehler",
                  description: res.payload.error,
                  isClosable: true,
                  duration: 6000,
                });
              }
            },
          },
        ]}
        entries={lists.map((list) => {
          return {
            title: list.name,
            fields: [
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
              {
                buttons: [
                  {
                    text: "Öffnen",
                    icon: <FaEye />,
                    colorScheme: "blue",
                    onClick: () => {
                      setCurrentList(list);
                      onOpen();
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
                      if (
                        await PopupManager.confirmAsync({
                          title: "Liste löschen",
                          question: "Willst du die Liste wirklich löschen?",
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
              },
            ],
          };
        })}
      />
      <ListViewer
        isOpen={isOpen}
        onClose={onClose}
        currentList={currentList}
        setCurrentList={setCurrentList}
        reloadLists={reloadLists}
      />
    </>
  );
}
