/**
 * packages/components/forum/ChatCardV2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2022
 *
 */

import * as React from "react";
import {
  Avatar,
  Button,
  chakra,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import REST from "@codeup/rest";
import { useRouter } from "next/router";

export default function ChatCardV2(props: {
  chat: {
    id: string;
    username: string;
    displayName: string;
    verified: boolean;
  };
  setActiveChat: (i: string) => void;
  reloadChats: () => void;
}) {
  const toast = useToast();

  const router = useRouter();

  return (
    <>
      <Flex
        direction={"row"}
        alignItems={"center"}
        gap={"1rem"}
        p={8}
        key={props.chat.id}
        cursor={"pointer"}
        onClick={() => {
          // check if mobile
          if (window.innerWidth < 768) {
            router.push("/forum/messages/" + props.chat.id);
          } else {
            router.push("/forum/messages/?chat=" + props.chat.id);
          }
        }}
      >
        <Avatar
          size={"md"}
          src={"/api/account/" + props.chat.username + "/picture"}
        />
        <Flex direction={"column"} flex={"100%"}>
          <HStack>
            <Heading size={"md"}>{props.chat.displayName}</Heading>
            {props.chat.verified ? (
              <chakra.span color={"brand.500"} fontSize={"2xl"}>
                <FaCheckCircle />
              </chakra.span>
            ) : null}
          </HStack>
          <Text color={"gray"}>@{props.chat.username}</Text>
        </Flex>
        <Flex flex={"100%"} alignItems={"center"} justifyContent={"flex-end"}>
          <IconButton
            aria-label={"delete_chat"}
            icon={<FaTrash />}
            onClick={() => {
              REST.Forum.deleteChatV2({
                token: localStorage.getItem("token") as string,
                id: props.chat.id,
              }).then((res) => {
                if (res.status === 200) {
                  props.reloadChats();
                  props.setActiveChat("");
                } else {
                  toast({
                    title: "Fehler",
                    description: "Der Chat konnte nicht gelöscht werden.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                  });
                }
              });
            }}
          />
        </Flex>
      </Flex>
    </>
  );
}
