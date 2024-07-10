/**
 * packages/components/tasks/TaskListViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.07.2024
 *
 */

import * as React from "react";
import CodeUpModal from "../codeup/CodeUpModal";
import { CHeading } from "../global/CHeading";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaPen,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import PopupManager from "@codeup/web/src/global/PopupManager";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";

export default function TaskListViewer(props: {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  list?: {
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
  };
  reloadLists: () => void;
}) {
  if (!props.list) return <></>;

  return (
    <>
      <CodeUpModal
        onOpen={props.onOpen}
        onClose={props.onClose}
        isOpen={props.isOpen}
        title={props.list.name}
      >
        <Button
          leftIcon={<FaPlus />}
          variant={"brand"}
          onClick={async () => {
            if (!props.list) return;
            const name = await PopupManager.promptAsync({
              title: "Neue Aufgabe",
              helperText: "Bitte gib den Namen der neuen Aufgabe ein!",
            });

            if (!name) return;

            const description = await PopupManager.promptAsync({
              title: "Neue Aufgabe",
              inputType: "TEXTAREA",
              helperText:
                "Bitte gib eine Beschreibung für die neue Aufgabe ein!",
            });

            if (!description) return;

            const res = await REST.ToDo.V2.createListItem(
              AccountManager.getActiveToken(),
              props.list._id,
              name,
              description
            );

            if (res.status !== 200) {
              await PopupManager.alertAsync({
                title: "Fehler",
                description: "Es ist ein Fehler aufgetreten.",
              });
              return;
            }

            props.reloadLists();
          }}
        >
          Neue Aufgabe
        </Button>
        <Box p={2}>
          <CHeading size={"md"}>Zu erledigen</CHeading>
          <Stack pt={2} pb={2}>
            {props.list.items
              .filter((item) => !item.done)
              .map((item) => (
                <>
                  <HStack
                    justifyContent={"space-between"}
                    p={2}
                    bg={"gray.900"}
                    rounded={"md"}
                  >
                    <VStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                    >
                      <CHeading size={"md"}>{item.name}</CHeading>
                      <Text>{item.description}</Text>
                    </VStack>
                    <ButtonGroup>
                      <IconButton
                        aria-label={"Edit"}
                        icon={<FaPen />}
                        variant={"brand"}
                        onClick={async () => {
                          await PopupManager.alertAsync({
                            title: "Aufgabe bearbeiten",
                            description: (
                              <>
                                <form
                                  onSubmit={async (e) => {
                                    if (!props.list) return;
                                    e.preventDefault();
                                    const fd = new FormData(e.target as any);

                                    const name = fd.get("name") as string;
                                    const description = fd.get(
                                      "description"
                                    ) as string;

                                    const res =
                                      await REST.ToDo.V2.updateListItem(
                                        AccountManager.getActiveToken(),
                                        props.list._id,
                                        item._id,
                                        name,
                                        description,
                                        item.done
                                      );

                                    if (res.status !== 200) {
                                      await PopupManager.alertAsync({
                                        title: "Fehler",
                                        description:
                                          "Die Aufgabe konnte nicht bearbeitet werden.",
                                      });
                                      return;
                                    }

                                    props.reloadLists();

                                    PopupManager.removeCurrentPopup();
                                  }}
                                >
                                  <Stack gap={2}>
                                    <FormControl isRequired>
                                      <FormLabel>Name</FormLabel>
                                      <Input
                                        type={"text"}
                                        defaultValue={item.name}
                                        placeholder={"Name"}
                                        name={"name"}
                                      />
                                      <FormHelperText>
                                        Ein Name, der die Aufgabe bestmöglich
                                        beschreibt.
                                      </FormHelperText>
                                    </FormControl>
                                    <FormControl isRequired>
                                      <FormLabel>Beschreibung</FormLabel>
                                      <Textarea
                                        defaultValue={item.description}
                                        placeholder={"Beschreibung"}
                                        name={"description"}
                                      />
                                      <FormHelperText>
                                        Eine möglichst genaue Beschreibung der
                                        Aufgabe.
                                      </FormHelperText>
                                    </FormControl>
                                    <Button
                                      variant={"brand"}
                                      type={"submit"}
                                      leftIcon={<FaSave />}
                                    >
                                      Speichern
                                    </Button>
                                  </Stack>
                                </form>
                              </>
                            ),
                          });
                        }}
                      />
                      <IconButton
                        aria-label={"Check"}
                        icon={<FaCheck />}
                        variant={"brand"}
                        onClick={async () => {
                          if (!props.list) return;
                          const res = await REST.ToDo.V2.updateListItem(
                            AccountManager.getActiveToken(),
                            props.list._id,
                            item._id,
                            item.name,
                            item.description,
                            true
                          );

                          if (res.status !== 200) {
                            await PopupManager.alertAsync({
                              title: "Fehler",
                              description:
                                "Die Aufgabe konnte nicht als erledigt markiert werden.",
                            });
                            return;
                          }

                          await props.reloadLists();
                        }}
                      />
                      <IconButton
                        aria-label={"Delete"}
                        icon={<FaTrash />}
                        colorScheme={"red"}
                        onClick={async () => {
                          if (!props.list) return;
                          if (
                            !(await PopupManager.confirmAsync({
                              title: "Aufgabe Löschen?",
                              question:
                                "Willst du diese Aufgabe wirklich löschen?",
                            }))
                          )
                            return;

                          const res = await REST.ToDo.V2.deleteListItem(
                            AccountManager.getActiveToken(),
                            props.list._id,
                            item._id
                          );

                          if (res.status !== 200) {
                            await PopupManager.alertAsync({
                              title: "Fehler",
                              description:
                                "Die Aufgabe konnte nicht gelöscht werden: " +
                                res.payload.error,
                            });
                            return;
                          }

                          await props.reloadLists();
                        }}
                      />
                    </ButtonGroup>
                  </HStack>
                </>
              ))}
          </Stack>
          {props.list.items.filter((item) => !item.done).length === 0 && (
            <>
              <Text>Es gibt keine offenen Aufgaben in dieser Liste.</Text>
            </>
          )}
        </Box>
        <Box p={2}>
          <CHeading size={"md"}>Erledigt</CHeading>
          <Stack pt={2} pb={2}>
            {props.list.items
              .filter((item) => item.done)
              .map((item) => (
                <>
                  <HStack
                    justifyContent={"space-between"}
                    p={2}
                    bg={"gray.900"}
                    rounded={"md"}
                  >
                    <VStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                    >
                      <CHeading size={"md"}>{item.name}</CHeading>
                      <Text>{item.description}</Text>
                    </VStack>
                    <ButtonGroup>
                      <IconButton
                        aria-label={"Edit"}
                        icon={<FaPen />}
                        variant={"brand"}
                        onClick={async () => {
                          await PopupManager.alertAsync({
                            title: "Aufgabe bearbeiten",
                            description: (
                              <>
                                <form
                                  onSubmit={async (e) => {
                                    if (!props.list) return;
                                    e.preventDefault();
                                    const fd = new FormData(e.target as any);

                                    const name = fd.get("name") as string;
                                    const description = fd.get(
                                      "description"
                                    ) as string;

                                    const res =
                                      await REST.ToDo.V2.updateListItem(
                                        AccountManager.getActiveToken(),
                                        props.list._id,
                                        item._id,
                                        name,
                                        description,
                                        item.done
                                      );

                                    if (res.status !== 200) {
                                      await PopupManager.alertAsync({
                                        title: "Fehler",
                                        description:
                                          "Die Aufgabe konnte nicht bearbeitet werden.",
                                      });
                                      return;
                                    }

                                    props.reloadLists();

                                    PopupManager.removeCurrentPopup();
                                  }}
                                >
                                  <Stack gap={2}>
                                    <FormControl isRequired>
                                      <FormLabel>Name</FormLabel>
                                      <Input
                                        type={"text"}
                                        defaultValue={item.name}
                                        placeholder={"Name"}
                                        name={"name"}
                                      />
                                      <FormHelperText>
                                        Ein Name, der die Aufgabe bestmöglich
                                        beschreibt.
                                      </FormHelperText>
                                    </FormControl>
                                    <FormControl isRequired>
                                      <FormLabel>Beschreibung</FormLabel>
                                      <Textarea
                                        defaultValue={item.description}
                                        placeholder={"Beschreibung"}
                                        name={"description"}
                                      />
                                      <FormHelperText>
                                        Eine möglichst genaue Beschreibung der
                                        Aufgabe.
                                      </FormHelperText>
                                    </FormControl>
                                    <Button
                                      variant={"brand"}
                                      type={"submit"}
                                      leftIcon={<FaSave />}
                                    >
                                      Speichern
                                    </Button>
                                  </Stack>
                                </form>
                              </>
                            ),
                          });
                        }}
                      />
                      <IconButton
                        aria-label={"Uncheck"}
                        icon={<FaTimes />}
                        variant={"brand"}
                        onClick={async () => {
                          if (!props.list) return;
                          const res = await REST.ToDo.V2.updateListItem(
                            AccountManager.getActiveToken(),
                            props.list._id,
                            item._id,
                            item.name,
                            item.description,
                            false
                          );

                          if (res.status !== 200) {
                            await PopupManager.alertAsync({
                              title: "Fehler",
                              description:
                                "Die Aufgabe konnte nicht als offen markiert werden.",
                            });
                            return;
                          }

                          await props.reloadLists();
                        }}
                      />
                      <IconButton
                        aria-label={"Delete"}
                        icon={<FaTrash />}
                        colorScheme={"red"}
                        onClick={async () => {
                          if (!props.list) return;
                          if (
                            !(await PopupManager.confirmAsync({
                              title: "Aufgabe Löschen?",
                              question:
                                "Willst du diese Aufgabe wirklich löschen?",
                            }))
                          )
                            return;

                          const res = await REST.ToDo.V2.deleteListItem(
                            AccountManager.getActiveToken(),
                            props.list._id,
                            item._id
                          );

                          if (res.status !== 200) {
                            await PopupManager.alertAsync({
                              title: "Fehler",
                              description:
                                "Die Aufgabe konnte nicht gelöscht werden: " +
                                res.payload.error,
                            });
                            return;
                          }

                          await props.reloadLists();
                        }}
                      />
                    </ButtonGroup>
                  </HStack>
                </>
              ))}
          </Stack>
          {props.list.items.filter((item) => item.done).length === 0 && (
            <>
              <Text>
                Es gibt keine abgeschlossenen Aufgaben in dieser Liste.
              </Text>
            </>
          )}
        </Box>
      </CodeUpModal>
    </>
  );
}
