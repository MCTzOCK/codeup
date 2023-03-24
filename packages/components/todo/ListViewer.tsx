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

export default function ListViewer(props: {
  isOpen: boolean;
  onClose: () => void;
  currentList: {
    _id: string;
    name: string;
    tasks: {
      name: string;
      finished: boolean;
      uuid: string;
    }[];
  } | null;
  setCurrentList: (cf: any) => void;
  reloadLists: () => void;
}) {
  const toast = useToast();

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
                  <Heading fontSize={"3xl"}>Aufgaben</Heading>
                </Box>

                <IconButton
                  colorScheme="green"
                  aria-label={"new-item"}
                  icon={<FaPlus />}
                  onClick={async () => {
                    const name = await PopupManager.promptAsync({
                      title: "Neue Aufgabe",
                      helperText: "Gib die neue Aufgabe ein",
                    });

                    if (!name) return;

                    const res = await REST.ToDo.createTask({
                      token: localStorage.getItem("token") as string,
                      listId: props.currentList?._id as string,
                      task: name,
                    });

                    if (res.status === 200) {
                      props.reloadLists();
                      let x = props.currentList;
                      x?.tasks.push({
                        name,
                        finished: false,
                        uuid: res.payload.task,
                      });
                      props.setCurrentList(x);

                      toast({
                        position: "top",
                        variant: "solid",
                        status: "success",
                        title: "Erfolgreich",
                        description: "Die Aufgabe wurde erstellt",
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
                  }}
                />
              </Flex>

              {props.currentList.tasks
                .sort((t, tx) => {
                  return t.finished ? 1 : -1;
                })
                .map((task) => {
                  return (
                    <ListItem
                      listId={props.currentList?._id || ""}
                      name={task.name}
                      uuid={task.uuid}
                      finished={task.finished}
                      currentList={props.currentList}
                      setCurrentList={props.setCurrentList}
                      reloadLists={props.reloadLists}
                    />
                  );
                })}
              {props.currentList.tasks.length === 0 ? (
                <Text textAlign={"center"} color={"red.300"} fontSize={"lg"}>
                  Keine Aufgaben vorhanden
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
