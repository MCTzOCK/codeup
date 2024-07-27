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
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Index() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation("todo");

  const [lists, setLists] = React.useState<
    {
      _id: string;
      name: string;
      tasks: {
        name: string;
        finished: boolean;
        description: string;
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

      if (currentList) {
        setCurrentList(
          res.payload.lists.find((e: any) => e._id === currentList._id)
        );
      }
    } else {
      toast({
        position: "top",
        variant: "solid",
        status: "error",
        title: t("base:control.error"),
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
      description: string;
      uuid: string;
    }[];
  } | null>(null);

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <Heading size={"xl"} textAlign={"center"} mt={"2rem"}>
        {t("title")}
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
                title: t("new.list"),
                helperText: t("new.list.name"),
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
                  title: t("success"),
                  description: t("success.created"),
                  isClosable: true,
                  duration: 6000,
                });
              } else {
                toast({
                  position: "top",
                  variant: "solid",
                  status: "error",
                  title: t("base:control.error"),
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
                  t("items.finished") +
                  " " +
                  list.tasks.filter((task) => task.finished).length +
                  "/" +
                  list.tasks.length,
              },
            ],
            buttonRows: [
              {
                buttons: [
                  {
                    text: t("list.open"),
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
                    text: t("list.delete"),
                    icon: <FaTrash />,
                    colorScheme: "red",
                    onClick: async () => {
                      if (
                        await PopupManager.confirmAsync({
                          title: t("list.delete.p.title"),
                          question: t("list.delete.p.text"),
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
                          title: t("base:control.error"),
                          description:
                            t("list.delete.error") + " " + res.payload.error,
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["todo"])),
  };
}
