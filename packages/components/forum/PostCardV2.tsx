/**
 * packages/components/forum/PostCardV2.tsx
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
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaClock, FaTrash } from "react-icons/fa";
import REST from "@codeup/rest";

export default function PostCardV2(props: {
  post: {
    _id: string;
    createdAt: string;
    content: string;
  };
  profile: {
    username: string;
    verified: boolean;
  };
  postOwner: boolean;
  reloadPosts: () => void;
}) {
  const toast = useToast();

  return (
    <Box key={props.post._id} mt={4} mb={4} position={"relative"}>
      <Flex direction={"row"} gap={"1rem"} alignItems={"center"} mb={4}>
        <Avatar
          size={"sm"}
          src={`/api/account/${props.profile.username}/picture`}
        />
        <Heading size={"md"}>{props.profile.username}</Heading>
        {props.profile.verified ? (
          <Badge colorScheme={"green"}>Offiziell</Badge>
        ) : null}
        <Flex alignItems={"center"} gap={".6rem"}>
          <FaClock />
          {new Date(props.post.createdAt).toLocaleString()}
        </Flex>
      </Flex>
      <Text mt={2}>{props.post.content}</Text>
      {props.postOwner ? (
        <Box position={"absolute"} top={0} right={0}>
          <IconButton
            aria-label={"delete_post"}
            size={"md"}
            icon={<FaTrash />}
            onClick={async () => {
              const res = await REST.Forum.deletePostV2({
                token: localStorage.getItem("token") as string,
                id: props.post._id,
              });

              if (res.status === 200) {
                toast({
                  title: "Post gelöscht",
                  description: "Der Post wurde erfolgreich gelöscht!",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                props.reloadPosts();
              } else {
                toast({
                  title: "Fehler",
                  description:
                    "Beim Löschen des Beitrags ist ein Fehler aufgetreten.",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                  position: "top",
                });
              }
            }}
          />
        </Box>
      ) : null}
    </Box>
  );
}
