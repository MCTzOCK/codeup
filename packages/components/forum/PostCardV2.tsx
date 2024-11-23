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
  Stack,
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
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("forum");

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
        bg: isFullScreen ? "black" : "gray.800",
      }}
      rounded={"xl"}
      p={2}
      onClick={
        isFullScreen
          ? undefined
          : () => router.push(`/forum/post/${props.post._id}`)
      }
    >
      <Link
        onClick={() => {
          router.push("/u/" + props.profile.username);
        }}
      >
        <Flex direction={"row"} gap={"1rem"} alignItems={"flex-start"} mb={4}>
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
              color={"brand.500"}
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
          {t("answer")}
        </Badge>
      ) : null}

      <Text mt={2}>{props.post.content}</Text>

      {
        // @ts-ignore
        props.post.embeds.map((e) => {
          if (e.type === "link") {
            return (
              <>
                <Box mt={2} p={4} bg={"gray.800"} borderRadius={"md"}>
                  <Stack>
                    {e.site_name && <Text>{e.site_name}</Text>}
                    {e.title && (
                      <Heading
                        size={"md"}
                        color={"brand.500"}
                        cursor={"pointer"}
                        as={"a"}
                        href={e.url}
                        target={"_blank"}
                      >
                        {e.title}
                      </Heading>
                    )}
                    {e.description && <Text mt={2}>{e.description}</Text>}
                    {e.image && <img src={e.image} alt={e.image || ""} />}
                  </Stack>
                </Box>
              </>
            );
          } else if (e.type === "image") {
            return (
              <>
                <Box mt={2} p={4} bg={"gray.800"} borderRadius={"md"}>
                  <img src={e.url} alt={e.url || ""} />
                </Box>
              </>
            );
          } else if (e.type === "video") {
            return (
              <>
                <Box mt={2} p={4} bg={"gray.800"} borderRadius={"md"}>
                  <video src={e.url} controls />
                </Box>
              </>
            );
          } else if (e.type === "file") {
            return (
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
                    <Text>{e.url.split("/").pop()}</Text>
                  </Flex>
                  <IconButton
                    as={"a"}
                    href={e.url}
                    target={"_blank"}
                    rel={"noreferrer"}
                    colorScheme={"blue"}
                    icon={<FiDownload />}
                    aria-label={"Download"}
                  />
                </Flex>
              </>
            );
          }
        })
      }

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
                title: t("base:control.error"),
                description: t("like.post.error"),
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
            }
          }}
          alignItems={"center"}
        >{`${props.post.likes.length} ${
          props.post.likes.length === 1 ? t("like") : t("likes")
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
                {t("answer.verb")}
              </Button>
            </PopoverTrigger>
            <PopoverContent bg={"black"} textAlign={"left"}>
              <PopoverArrow bg={"black"} />
              <PopoverHeader>{t("answer.verb")}</PopoverHeader>
              <PopoverBody>
                <Textarea id={post_ta_id} placeholder={t("content")} />
              </PopoverBody>
              <PopoverFooter>
                <Button
                  variant={"brand"}
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
                        title: t("base:control.error"),
                        description: t("post.upload.error"),
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                    }
                  }}
                >
                  {t("post.publish")}
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
                  title: t("post.deleted"),
                  description: t("post.deleted.text"),
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                props.reloadPosts();
              } else {
                toast({
                  title: t("base:control.error"),
                  description: t("post.deleted.failed"),
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
