/**
 * packages/components/todo/ListView.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.08.2022
 *
 */

import * as React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useToast,
  Button,
  Flex,
  IconButton,
  Tooltip,
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  PopoverArrow,
  PopoverTrigger,
  Input,
  FormControl,
  FormLabel,
  Text,
  ButtonGroup,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import ListItem from "./ListItem";
import REST from "@codeup/rest";
import PopupManager from "@codeup/web/src/global/PopupManager";
import { useTranslation } from "next-i18next";

export default function ListViewer(props: {
  isOpen: boolean;
  onClose: () => void;
  currentList: {
    _id: string;
    name: string;
    tasks: {
      name: string;
      finished: boolean;
      description: string;
      uuid: string;
    }[];
  } | null;
  setCurrentList: (cf: any) => void;
  reloadLists: () => void;
}) {
  const toast = useToast();

  const { t } = useTranslation("todo");

  if (!props.currentList) {
    return <></>;
  }

  return (
    <>
      <Drawer
        isOpen={props.isOpen}
        placement="right"
        size={["full", "lg"]}
        onClose={props.onClose}
      >
        <DrawerOverlay />
        <DrawerContent backgroundColor={"gray.900"}>
          <DrawerCloseButton />
          <DrawerHeader>{props.currentList.name}</DrawerHeader>

          <DrawerBody>
            <Flex w={"100%"} p={"2rem"} direction={"column"} gap={"2rem"}>
              <Flex w={"100%"} alignItems={"center"}>
                <Box flex={"90%"}>
                  <Heading fontSize={"3xl"}>{t("tasks")}</Heading>
                </Box>

                <IconButton
                  colorScheme="green"
                  aria-label={"new-item"}
                  icon={<FaPlus />}
                  onClick={async () => {
                    const name = await PopupManager.promptAsync({
                      title: t("tasks.new"),
                      helperText: t("tasks.new.enter"),
                    });

                    if (!name) return;
                    const description = await PopupManager.promptAsync({
                      title: t("tasks.new"),
                      helperText: t("tasks.new.description"),
                      inputType: "TEXTAREA",
                    });

                    if (!description) return;

                    const res = await REST.ToDo.createTask({
                      token: localStorage.getItem("token") as string,
                      listId: props.currentList?._id as string,
                      task: name,
                    });

                    if (res.status === 200) {
                      const res2 = await REST.ToDo.updateItem({
                        token: localStorage.getItem("token") as string,
                        listId: props.currentList?._id as string,
                        taskUUID: res.payload.task,
                        update: {
                          description,
                        },
                      });

                      props.reloadLists();
                      let x = props.currentList;
                      x?.tasks.push({
                        name,
                        description,
                        finished: false,
                        uuid: res.payload.task,
                      });
                      props.setCurrentList(x);

                      toast({
                        position: "top",
                        variant: "solid",
                        status: "success",
                        title: t("success"),
                        description: t("tasks.created"),
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
                  }}
                />
              </Flex>

              {props.currentList.tasks.map((task) => {
                return (
                  <ListItem
                    listId={props.currentList?._id || ""}
                    name={task.name}
                    uuid={task.uuid}
                    finished={task.finished}
                    description={task.description}
                    currentList={props.currentList}
                    setCurrentList={props.setCurrentList}
                    reloadLists={props.reloadLists}
                  />
                );
              })}
              {props.currentList.tasks.length === 0 ? (
                <Text textAlign={"center"} color={"red.300"} fontSize={"lg"}>
                  {t("tasks.none")}
                </Text>
              ) : (
                <></>
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
