/**
 * packages/components/forum/ChatView.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import REST from "@codeup/rest";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FiDownload, FiFile, FiMessageSquare, FiSend } from "react-icons/fi";
import { useLoggedIn } from "@codeup/hooks";
import { FaFile, FaImage, FaPlus, FaVideo } from "react-icons/fa";
import { useTranslation } from "next-i18next";

export default function ChatViewV2(props: {
  chatId: string;
  setActiveChat: (i: string) => void;
}) {
  const [messages, setMessages] = useState<
    {
      username: string;
      content: string;
      createdAt: string;
      _id: string;
    }[]
  >([]);

  const toast = useToast();
  const { t } = useTranslation("forum");

  const reloadMessages = () => {
    REST.Forum.getChatMessagesV2({
      token: localStorage.getItem("token") as string,
      id: props.chatId,
    }).then((r) => {
      if (r.status === 200) {
        setMessages(r.payload.messages);
      } else {
        toast({
          title: t("base:control.error"),
          description: t("chat.messages.loading.error"),
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        props.setActiveChat("");
      }
    });
  };

  useEffect(() => {
    const s = setInterval(() => {
      reloadMessages();
    }, 1000);

    return () => {
      clearInterval(s);
    };
  }, [props.chatId]);

  useEffect(reloadMessages, [props.chatId]);

  const { userInfo, loggedIn, loaded: loadedUserInfo } = useLoggedIn();

  function upload(options: {
    prefix: string;
    mimeType: string;
    fileNameAsSuffix: boolean;
  }) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/media/upload";
    const a = document.createElement("input");
    a.type = "file";
    a.accept = options.mimeType;
    a.name = "file";

    form.appendChild(a);

    a.click();

    a.onchange = async () => {
      const formData = new FormData(form);
      const r = await fetch("/media/upload", {
        method: "POST",
        body: formData,
      });

      if (r.status === 200) {
        const json = await r.json();

        const url = await json.data.url;

        await REST.Forum.sendMessageV2({
          token: localStorage.getItem("token") as string,
          id: props.chatId,
          content: `${options.prefix}: ${url} ${
            options.fileNameAsSuffix ? a.files?.[0].name : ""
          }`,
        });
      } else {
        toast({
          title: t("base:control.error"),
          description: t("chat.messages.upload.error"),
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "top",
        });
      }
    };
  }

  return (
    <>
      <Flex
        direction="column"
        flex={"100%"}
        overflowX="hidden"
        h={"90vh"}
        p={8}
        position={"relative"}
      >
        <Box
          maxH={"80vh"}
          minH={"80vh"}
          overflow={"auto"}
          w={"100%"}
          id={"chat_msgs"}
        >
          {messages
            .sort((a, b) => {
              return new Date(a.createdAt).getTime() <
                new Date(b.createdAt).getTime()
                ? 1
                : -1;
            })
            .map((m) => {
              return (
                <Flex
                  w={"100%"}
                  alignItems={"center"}
                  justifyContent={
                    userInfo.username === m.username ? "flex-end" : "flex-start"
                  }
                  pr={"2rem"}
                  mt={8}
                  mb={8}
                >
                  <Box maxW={["100%", "50%"]}>
                    <Flex
                      w={"100%"}
                      alignItems={"center"}
                      justifyContent={
                        userInfo.username === m.username
                          ? "flex-end"
                          : "flex-start"
                      }
                      paddingBlock={4}
                      gap={"1rem"}
                    >
                      <Flex
                        w={"100%"}
                        alignItems={"center"}
                        justifyContent={
                          userInfo.username === m.username
                            ? "flex-end"
                            : "flex-start"
                        }
                        paddingBlock={4}
                        gap={"1rem"}
                        color={"gray"}
                      >
                        {new Date(m.createdAt).toLocaleString()}
                      </Flex>
                      <Avatar
                        src={"/api/account/" + m.username + "/picture"}
                        size={"md"}
                      />
                    </Flex>
                    <Box
                      bg={
                        userInfo.username === m.username
                          ? "brand.600"
                          : "gray.500"
                      }
                      p={3}
                      color={
                        userInfo.username === m.username ? "black" : "white"
                      }
                      fontSize={"xl"}
                      rounded={"xl"}
                      shadow={"xl"}
                    >
                      {m.content.startsWith("image: ") ? (
                        <>
                          <img
                            src={m.content.replace("image: ", "")}
                            style={{
                              maxWidth: "15vw",
                              borderRadius: "var(--chakra-radii-md)",
                            }}
                          />
                        </>
                      ) : m.content.startsWith("video: ") ? (
                        <>
                          <video
                            src={m.content.replace("video: ", "")}
                            controls
                            style={{
                              maxWidth: "15vw",
                            }}
                          />
                        </>
                      ) : m.content.startsWith("file: ") ? (
                        <>
                          <Flex
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            w={"100%"}
                            p={4}
                            rounded={"md"}
                            bg={"gray.800"}
                            shadow={"xl"}
                            gap={4}
                          >
                            <Flex alignItems={"center"} gap={"1rem"}>
                              <FiFile color={"#FAFAFA"} />
                              <Text color={"#FAFAFA"}>
                                {m.content.split(" ")[2]}
                              </Text>
                            </Flex>
                            <IconButton
                              as={"a"}
                              href={m.content.split(" ")[1]}
                              target={"_blank"}
                              rel={"noreferrer"}
                              variant={"brand"}
                              icon={<FiDownload />}
                              aria-label={"Download"}
                            />
                          </Flex>
                        </>
                      ) : (
                        m.content
                      )}
                    </Box>
                  </Box>
                </Flex>
              );
            })}
        </Box>
        <Box position={"absolute"} bottom={"2rem"} left={"5%"} w={"90%"}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const form = e.target as HTMLFormElement;

              const message = form.message.value;

              if (message.trim() !== "") {
                const r = await REST.Forum.sendMessageV2({
                  token: localStorage.getItem("token") as string,
                  id: props.chatId,
                  content: message,
                });

                if (r.status === 200) {
                  form.message.value = "";

                  setMessages(r.payload.messages);
                } else {
                  toast({
                    title: t("base:control.error"),
                    description: t("chat.messages.sending.error"),
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                  });
                }
              }
            }}
          >
            <Flex
              w={"100%"}
              direction={"row"}
              alignItems={"center"}
              gap={"1rem"}
            >
              <Menu>
                <MenuButton as={IconButton} icon={<FaPlus />} />
                <MenuList>
                  <MenuItem
                    icon={<FaImage />}
                    onClick={async () => {
                      upload({
                        fileNameAsSuffix: false,
                        mimeType: "image/*",
                        prefix: "image",
                      });
                    }}
                  >
                    {t("post.media.image")}
                  </MenuItem>
                  <MenuItem
                    icon={<FaVideo />}
                    onClick={async () => {
                      upload({
                        fileNameAsSuffix: false,
                        mimeType: "video/*",
                        prefix: "video",
                      });
                    }}
                  >
                    {t("post.media.video")}
                  </MenuItem>
                  <MenuItem
                    icon={<FaFile />}
                    onClick={async () => {
                      upload({
                        fileNameAsSuffix: true,
                        mimeType: "*",
                        prefix: "file",
                      });
                    }}
                  >
                    {t("post.media.file")}
                  </MenuItem>
                </MenuList>
              </Menu>
              <Input
                type={"text"}
                placeholder={t("chat.message")}
                name={"message"}
              />
              <Button leftIcon={<FiSend />} type={"submit"} variant={"brand"}>
                {t("chat.messages.send")}
              </Button>
            </Flex>
          </form>
        </Box>
      </Flex>
    </>
  );
}
