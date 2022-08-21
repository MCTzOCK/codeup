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
  Checkbox,
  Flex,
  IconButton,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { BsCheckCircleFill, BsCircle } from "react-icons/bs";
import REST from "@codeup/rest";

export default function ListItem(props: {
  name: string;
  uuid: string;
  finished: boolean;
  listId: string;
  currentList: any;
  setCurrentList: (cf: any) => void;
  reloadLists: () => void;
}) {
  const toast = useToast();

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
        <Box flex={"80%"}>{props.name}</Box>
        <Box flex={"10%"}>
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
        </Box>
      </Flex>
    </>
  );
}
