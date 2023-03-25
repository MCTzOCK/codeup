/**
 * packages/components/todo/ListItem.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.08.2022
 *
 */

import * as React from "react";
import {
  Box,
  ButtonGroup,
  Checkbox,
  Flex,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { FaPen, FaTrash } from "react-icons/fa";
import { BsCheckCircleFill, BsCircle } from "react-icons/bs";
import REST from "@codeup/rest";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "@codeup/web/src/global/PopupManager";
import { BiRename } from "react-icons/bi";

export default function ListItem(props: {
  name: string;
  uuid: string;
  description: string;
  finished: boolean;
  listId: string;
  currentList: any;
  setCurrentList: (cf: any) => void;
  reloadLists: () => void;
}) {
  const toast = useToast();

  const [name, setName] = React.useState(props.name);
  const [description, setDescription] = React.useState(props.description);

  return (
    <>
      <Flex w={"100%"} alignItems={"center"}>
        <Box flex={"10%"}>
          <IconButton
            aria-label={"check-uncheck"}
            icon={
              props.finished ? (
                <BsCheckCircleFill color={"pink"} />
              ) : (
                <BsCircle color={"pink"} />
              )
            }
            variant={"ghost"}
            onClick={async () => {
              const res = await REST.ToDo.toggleItemFinish({
                token: localStorage.getItem("token") as string,
                listId: props.listId,
                taskUUID: props.uuid,
              });

              props.reloadLists();

              let x = props.currentList;
              (x.tasks as any).find(
                (y: any) => y.uuid === props.uuid
              ).finished = !(x.tasks as any).find(
                (y: any) => y.uuid === props.uuid
              ).finished;
              props.setCurrentList(x);
            }}
          />
        </Box>
        <Box flex={"80%"}>
          <Stack>
            <Text fontSize={"lg"}>{name}</Text>
            <Text>{description}</Text>
          </Stack>
        </Box>
        <Box flex={"10%"}>
          <ButtonGroup>
            <IconButton
              aria-label={"edit-item"}
              variant="ghost"
              color={"blue.300"}
              icon={<BiRename />}
              onClick={async () => {
                const newName = await PopupManager.promptAsync({
                  title: "Gib einen neuen Namen ein",
                  helperText: "Der neue Name der Aufgabe",
                });

                if (!newName) return;

                const res = await REST.ToDo.updateItem({
                  token: AccountManager.getActiveToken(),
                  listId: props.listId,
                  taskUUID: props.uuid,
                  update: {
                    name: newName,
                  },
                });

                if (res.status === 200) {
                  props.reloadLists();

                  setName(newName);
                } else {
                  toast({
                    position: "top",
                    variant: "solid",
                    status: "error",
                    title: "Fehler",
                    description:
                      "Beim Ändern des Namens ist ein Fehler aufgetreten.",
                  });
                }
              }}
            />
            <IconButton
              aria-label={"edit-item"}
              variant="ghost"
              color={"blue.300"}
              icon={<FaPen />}
              onClick={async () => {
                const newDesc = await PopupManager.promptAsync({
                  title: "Gib eine neue Beschreibung ein",
                  helperText: "Der Inhalt der Aufgabe",
                  inputType: "TEXTAREA",
                });

                if (!newDesc) return;

                const res = await REST.ToDo.updateItem({
                  token: AccountManager.getActiveToken(),
                  listId: props.listId,
                  taskUUID: props.uuid,
                  update: {
                    description: newDesc,
                  },
                });

                if (res.status === 200) {
                  props.reloadLists();

                  setDescription(newDesc);
                } else {
                  toast({
                    position: "top",
                    variant: "solid",
                    status: "error",
                    title: "Fehler",
                    description:
                      "Beim Ändern der Beschreibung ist ein Fehler aufgetreten.",
                  });
                }
              }}
            />
            <IconButton
              color={"red.300"}
              variant="ghost"
              aria-label={"delete-item"}
              icon={<FaTrash />}
              onClick={async () => {
                const res = await REST.ToDo.deleteTask({
                  token: localStorage.getItem("token") as string,
                  listId: props.currentList?._id as string,
                  taskUUID: props.uuid,
                });

                if (res.status === 200) {
                  props.reloadLists();
                  let x = props.currentList;
                  (x.tasks as any) = x?.tasks.filter(
                    (y: any) => y.uuid !== props.uuid
                  );
                  props.setCurrentList(x);

                  toast({
                    position: "top",
                    variant: "solid",
                    status: "success",
                    title: "Erfolgreich",
                    description: "Die Aufgabe wurde gelöscht",
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
          </ButtonGroup>
        </Box>
      </Flex>
    </>
  );
}
