/**
 * packages/components/ask/PostCardV3.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.06.23
 *
 */
import { IAskPost } from "@codeup/web/src/types/IAskPost";
import React from "react";
import {
  Avatar,
  Box,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AiFillMessage } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import PopupManager from "@codeup/web/src/global/PopupManager";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";

export default function PostCardV3(props: {
  post: IAskPost;
  onClick?: () => void;
  loggedIn?: boolean;
  owner?: boolean;
  setPosts: React.Dispatch<React.SetStateAction<IAskPost[]>>;
}) {
  return (
    <>
      <Box bg={"black"} w={"100%"} h={"fit-content"} minH={"25%"}>
        <HStack
          gap={4}
          h={"80%"}
          _hover={{
            cursor: "pointer",
            backgroundColor: "gray.800",
          }}
          p={8}
          onClick={props.onClick}
        >
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            h={"100%"}
            flex={"30%"}
          >
            <Stack>
              <Avatar
                size={"lg"}
                src={"/api/account/" + props.post.username + "/picture"}
              />
              <Heading size={"md"}>@{props.post.username}</Heading>
              <Text>{new Date(props.post.createdAt).toLocaleString()}</Text>
            </Stack>
          </Flex>
          <Box h={"100%"} flex={"100%"}>
            <Text fontSize={"xl"}>{props.post.content}</Text>
          </Box>
        </HStack>
        <Flex direction={"row"} w={"100%"} gap={0} h={"20%"}>
          <IconButton
            w={"100%"}
            variant={"ghost"}
            aria-label={"Kommentieren"}
            icon={<AiFillMessage />}
            disabled={props.post.parent !== null}
            onClick={async () => {
              if (!props.loggedIn) {
                window.dispatchEvent(new CustomEvent("codeup::open_login"));
                return;
              }

              const content = await PopupManager.promptAsync({
                title: "Kommentieren",
                helperText: "Was möchtest du kommentieren?",
                inputType: "TEXTAREA",
              });

              if (!content) return;

              const res = await REST.Ask.createPost(
                content,
                AccountManager.getActiveToken(),
                props.post._id
              );

              PopupManager.alert({
                title: "Kommentar erstellt",
                description: "Dein Kommentar wurde erfolgreich erstellt.",
              });
            }}
          />
          {props.owner && (
            <IconButton
              w={"100%"}
              variant={"ghost"}
              aria-label={"Löschen"}
              icon={<FaTrash />}
              onClick={async () => {
                if (
                  !(await PopupManager.confirmAsync({
                    title: "Post löschen",
                    question: "Möchtest du diesen Post wirklich löschen?",
                  }))
                )
                  return;

                const res = await REST.Ask.deletePost(
                  props.post._id,
                  AccountManager.getActiveToken()
                );

                props.setPosts((prev) => {
                  return prev.filter((p) => p._id !== props.post._id);
                });
              }}
            />
          )}
        </Flex>
      </Box>
    </>
  );
}
