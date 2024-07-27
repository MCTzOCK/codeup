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
  Heading,
  HStack,
  IconButton,
  Input,
  Progress,
  ProgressLabel,
  Stack,
  Text,
  Textarea,
  Tooltip,
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
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("tasks");
  if (!props.list) return <></>;

  return (
    <>
      <CodeUpModal
        onOpen={props.onOpen}
        onClose={props.onClose}
        isOpen={props.isOpen}
        title={props.list.name}
      >
        <Progress
          variant={"brand"}
          mb={4}
          title={
            t("progress") +
            ": " +
            (
              (props.list.items.filter((i) => i.done).length /
                props.list.items.length) *
              100
            ).toFixed(2) +
            "%"
          }
          max={props.list.items.length}
          value={props.list.items.filter((i) => i.done).length}
          size={"lg"}
          rounded={"md"}
        />
        <CHeading size={"sm"} textAlign={"center"}>
          {(
            (props.list.items.filter((i) => i.done).length /
              props.list.items.length) *
            100
          ).toFixed(2) + "%"}
        </CHeading>
        <Button
          leftIcon={<FaPlus />}
          variant={"brand"}
          onClick={async () => {
            if (!props.list) return;
            const name = await PopupManager.promptAsync({
              title: t("new.task"),
              helperText: t("new.task.name"),
            });

            if (!name) return;

            const description = await PopupManager.promptAsync({
              title: t("new.task"),
              inputType: "TEXTAREA",
              helperText: t("new.task.description"),
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
                title: t("base:control.error"),
                description: t("base:control.error.request"),
              });
              return;
            }

            props.reloadLists();
          }}
        >
          {t("new.task")}
        </Button>
        <Box p={2}>
          <CHeading size={"md"}>{t("tasks.todo")}</CHeading>
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
                            title: t("tasks.edit"),
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
                                        title: t("base:control.error"),
                                        description: t("tasks.edit.error"),
                                      });
                                      return;
                                    }

                                    props.reloadLists();

                                    PopupManager.removeCurrentPopup();
                                  }}
                                >
                                  <Stack gap={2}>
                                    <FormControl isRequired>
                                      <FormLabel>{t("tasks.name")}</FormLabel>
                                      <Input
                                        type={"text"}
                                        defaultValue={item.name}
                                        placeholder={t("tasks.name")}
                                        name={"name"}
                                      />
                                      <FormHelperText>
                                        {t("tasks.name.text")}
                                      </FormHelperText>
                                    </FormControl>
                                    <FormControl isRequired>
                                      <FormLabel>
                                        {t("tasks.description")}
                                      </FormLabel>
                                      <Textarea
                                        defaultValue={item.description}
                                        placeholder={t("tasks.description")}
                                        name={"description"}
                                      />
                                      <FormHelperText>
                                        {t("tasks.description.text")}
                                      </FormHelperText>
                                    </FormControl>
                                    <Button
                                      variant={"brand"}
                                      type={"submit"}
                                      leftIcon={<FaSave />}
                                    >
                                      {t("tasks.save")}
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
                              title: t("base:control.error"),
                              description: t("tasks.mark.finish.error"),
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
                              title: t("tasks.delete"),
                              question: t("tasks.delete.confirm"),
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
                              title: t("base:control.error"),
                              description:
                                t("tasks.delete.error") + res.payload.error,
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
              <Text>{t("tasks.no.open")}</Text>
            </>
          )}
        </Box>
        <Box p={2}>
          <CHeading size={"md"}>{t("tasks.finished")}</CHeading>
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
                            title: t("tasks.edit"),
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
                                        title: t("base:control.error"),
                                        description: t("tasks.edit.error"),
                                      });
                                      return;
                                    }

                                    props.reloadLists();

                                    PopupManager.removeCurrentPopup();
                                  }}
                                >
                                  <Stack gap={2}>
                                    <FormControl isRequired>
                                      <FormLabel>{t("tasks.name")}</FormLabel>
                                      <Input
                                        type={"text"}
                                        defaultValue={item.name}
                                        placeholder={t("tasks.name")}
                                        name={"name"}
                                      />
                                      <FormHelperText>
                                        {t("tasks.name.text")}
                                      </FormHelperText>
                                    </FormControl>
                                    <FormControl isRequired>
                                      <FormLabel>
                                        {t("tasks.description")}
                                      </FormLabel>
                                      <Textarea
                                        defaultValue={item.description}
                                        placeholder={t("tasks.description")}
                                        name={"description"}
                                      />
                                      <FormHelperText>
                                        {t("tasks.description.text")}
                                      </FormHelperText>
                                    </FormControl>
                                    <Button
                                      variant={"brand"}
                                      type={"submit"}
                                      leftIcon={<FaSave />}
                                    >
                                      {t("tasks.save")}
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
                              title: t("base:control.error"),
                              description: t("tasks.mark.unfinish.error"),
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
                              title: t("tasks.delete"),
                              question: t("tasks.delete.confirm"),
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
                              title: t("base:control.error"),
                              description:
                                t("tasks.delete.error") + res.payload.error,
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
              <Text>{t("tasks.no.finished")}</Text>
            </>
          )}
        </Box>
      </CodeUpModal>
    </>
  );
}
