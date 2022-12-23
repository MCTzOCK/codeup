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
  Button,
  ButtonGroup,
  chakra,
  Flex,
  Heading,
  IconButton,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import {
  FaCheckCircle,
  FaClock,
  FaComment,
  FaHeart,
  FaRegHeart,
  FaTrash,
} from "react-icons/fa";
import REST from "@codeup/rest";
import { useEffect, useId } from "react";
import { useRouter } from "next/router";
import { FiDownload, FiFile } from "react-icons/fi";

export default function PostCardV2(props: {
  post: {
    _id: string;
    createdAt: string;
    content: string;
    likes: string[];
    parent: string | null;
  };
  profile: {
    username: string;
    verified: boolean;
    displayName?: string;
  };
  postOwner: boolean;
  reloadPosts: () => void;
  userId: string;
}) {
  const toast = useToast();

  const post_ta_id = useId();

  const [isFullScreen, setIsFullScreen] = React.useState(false);

  useEffect(() => {
    if (window.location.pathname.includes("/post/")) {
      setIsFullScreen(true);
    }
  }, []);

  const router = useRouter();

  return (
    <Box
      key={props.post._id}
      mt={4}
      mb={4}
      position={"relative"}
      cursor={isFullScreen ? "default" : "pointer"}
      _hover={{
        bg: isFullScreen ? "gray.700" : "gray.600",
      }}
      onClick={
        isFullScreen
          ? undefined
          : () => router.push(`/forum/post/${props.post._id}`)
      }
    >
      <Link
        onClick={() => {
          router.push("/forum/" + props.profile.username);
        }}
      >
        <Flex direction={"row"} gap={"1rem"} alignItems={"center"} mb={4}>
          <Avatar
            size={"md"}
            src={`/api/account/${props.profile.username}/picture`}
          />
          {props.profile.displayName ? (
            <>
              <Flex direction={"column"}>
                <Heading size={"md"}>{props.profile.displayName}</Heading>
                <Text color={"gray"}>@{props.profile.username}</Text>
              </Flex>
            </>
          ) : null}
          {!props.profile.displayName ? (
            <Heading size={"md"}>{props.profile.username}</Heading>
          ) : null}
          {props.profile.verified ? (
            <chakra.span
              color={"green.500"}
              fontSize={props.profile.displayName ? "2xl" : "lg"}
            >
              <FaCheckCircle />
            </chakra.span>
          ) : null}
        </Flex>
      </Link>
      <Flex alignItems={"center"} gap={".6rem"}>
        <FaClock />
        {new Date(props.post.createdAt).toLocaleString()}
      </Flex>
      {props.post.parent !== null ? (
        <Badge colorScheme={"pink"} mt={2}>
          Antwort
        </Badge>
      ) : null}
      <Text mt={2}>
        {props.post.content.startsWith("image: ") ? (
          <>
            <img src={props.post.content.replace("image: ", "")} />
          </>
        ) : props.post.content.startsWith("video: ") ? (
          <>
            <video src={props.post.content.replace("video: ", "")} controls />
          </>
        ) : props.post.content.startsWith("file: ") ? (
          <>
            <Flex
              alignItems={"center"}
              justifyContent={"space-between"}
              w={"100%"}
              p={4}
              rounded={"xl"}
              bg={"gray.800"}
              shadow={"xl"}
              gap={4}
            >
              <Flex alignItems={"center"} gap={"1rem"}>
                <FiFile />
                <Text>{props.post.content.split(" ")[2]}</Text>
              </Flex>
              <IconButton
                as={"a"}
                href={props.post.content.split(" ")[1]}
                target={"_blank"}
                rel={"noreferrer"}
                colorScheme={"blue"}
                icon={<FiDownload />}
                aria-label={"Download"}
              />
            </Flex>
          </>
        ) : (
          props.post.content
        )}
      </Text>
      <ButtonGroup isAttached w={"100%"} mt={4}>
        <Button
          disabled={!isFullScreen}
          leftIcon={
            props.post.likes.includes(props.userId) ? (
              <FaHeart />
            ) : (
              <FaRegHeart />
            )
          }
          variant={"ghost"}
          flex={"100%"}
          onClick={async () => {
            const res = await REST.Forum.likePostV2({
              token: localStorage.getItem("token") as string,
              id: props.post._id,
            });

            if (res.status === 200) {
              props.reloadPosts();
            } else {
              toast({
                title: "Fehler",
                description:
                  "Beim Liken des Beitrags ist ein Fehler aufgetreten.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
            }
          }}
          alignItems={"center"}
        >{`${props.post.likes.length} ${
          props.post.likes.length === 1 ? "Like" : "Likes"
        }
        `}</Button>

        {props.post.parent === null ? (
          <Popover>
            <PopoverTrigger>
              <Button
                variant={"ghost"}
                flex={"100%"}
                leftIcon={<FaComment />}
                disabled={!isFullScreen}
              >
                Antworten
              </Button>
            </PopoverTrigger>
            <PopoverContent bg={"black"} textAlign={"left"}>
              <PopoverArrow bg={"black"} />
              <PopoverHeader>Antworten</PopoverHeader>
              <PopoverBody>
                <Textarea id={post_ta_id} placeholder={"Inhalt"} />
              </PopoverBody>
              <PopoverFooter>
                <Button
                  colorScheme={"green"}
                  onClick={async () => {
                    const content = document.getElementById(
                      post_ta_id
                    ) as HTMLInputElement;

                    const r = await REST.Forum.createPostV2({
                      token: localStorage.getItem("token") as string,
                      content: content.value,
                      parent: props.post._id,
                    });

                    if (r.status === 200) {
                      props.reloadPosts();
                      content.value = "";
                    } else {
                      toast({
                        title: "Fehler",
                        description:
                          "Der Beitrag konnte nicht veröffentlicht werden",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                    }
                  }}
                >
                  Veröffentlichen
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        ) : null}
      </ButtonGroup>
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
