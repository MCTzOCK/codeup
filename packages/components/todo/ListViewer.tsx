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
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import ListItem from "./ListItem";
import REST from "@codeup/rest";

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
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{props.currentList.name}</DrawerHeader>

          <DrawerBody>
            <Flex w={"100%"} p={"2rem"} direction={"column"} gap={"2rem"}>
              <Flex w={"100%"} alignItems={"center"}>
                <Box flex={"90%"}>
                  <Heading fontSize={"3xl"}>Aufgaben</Heading>
                </Box>

                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      colorScheme="whatsapp"
                      aria-label={"new-item"}
                      icon={<FaPlus />}
                      onClick={async () => {}}
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>
                      Neue Aufgabe
                      <PopoverCloseButton></PopoverCloseButton>
                    </PopoverHeader>
                    <PopoverBody>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();

                          const res = await REST.ToDo.createTask({
                            token: localStorage.getItem("token") as string,
                            listId: props.currentList?._id as string,
                            // @ts-ignore
                            task: e.target.elements.taskname.value,
                          });

                          if (res.status === 200) {
                            props.reloadLists();
                            let x = props.currentList;
                            x?.tasks.push({
                              // @ts-ignore
                              name: e.target.elements.taskname.value,
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
                      >
                        <FormControl>
                          <FormLabel>Name</FormLabel>
                          <Input
                            name={"taskname"}
                            id={"taskname"}
                            placeholder={"Name"}
                          />
                        </FormControl>
                        <Button type={"submit"} mt={"1.2rem"}>
                          Erstellen
                        </Button>
                      </form>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
              <Accordion
                allowToggle={true}
                allowMultiple={true}
                borderColor={"gray.700"}
                defaultIndex={[0]}
              >
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <Heading size={"md"}>Zu Erledigen</Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {props.currentList.tasks
                      .filter((t) => !t.finished)
                      .map((task) => {
                        return (
                          <ListItem
                            listId={props.currentList?._id || ""}
                            name={task.name}
                            uuid={task.uuid}
                            finished={task.finished}
                            currentList={props.currentList}
                            setCurrentList={props.setCurrentList}
                          />
                        );
                      })}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={props.onClose}>
              Schließen
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
