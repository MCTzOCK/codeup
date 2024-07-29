/**
 * apps/web/src/pages/forum/messages/index.tsx
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
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
  useMediaQuery,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  InputGroup,
  InputLeftAddon,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaPlus } from "react-icons/fa";
import { useRouter } from "next/router";
import ChatCardV2 from "@codeup/components/forum/ChatCardV2";
import REST from "@codeup/rest";
import { useLoggedIn, useUserInfo } from "@codeup/hooks";
import ChatViewV2 from "@codeup/components/forum/ChatViewV2";
import Head from "next/head";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function MessageView() {
  const [chats, setChats] = useState<
    {
      id: string;
      users: {
        username: string;
        displayName: string;
        verified: boolean;
      }[];
    }[]
  >([]);
  const { t } = useTranslation("forum");

  const { userInfo, loggedIn, loaded: loadedUserInfo } = useLoggedIn();

  const [loaded, setLoaded] = useState(false);

  const [activeChat, setActiveChat] = useState<string>("");

  const router = useRouter();

  const reloadChats = () => {
    REST.Forum.getChatListV2({
      token: localStorage.getItem("token") as string,
    }).then((r) => {
      if (r.status === 200) {
        setChats(r.payload.chats);
        setLoaded(true);
      }
    });
  };

  useEffect(reloadChats, []);

  useEffect(() => {
    const s = setInterval(() => {
      reloadChats();
    }, 1000);

    return () => {
      clearInterval(s);
    };
  }, []);

  const toast = useToast();

  useEffect(() => {
    // activeChat should be set to the query parameter "chat" if it is not empty

    if (router.query.chat && router.query.chat !== "") {
      setActiveChat(router.query.chat as string);
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>{t("messages.doc.title")}</title>
      </Head>
      <Flex direction={"row"} w={"100%"} h={"80vh"}>
        <Box flex={["100%", "25%"]} shadow={"xl"}>
          <Flex
            direction={"column"}
            w={"100%"}
            h={"fit-content"}
            maxH={"80vh"}
            overflow={"auto"}
          >
            <Box textAlign={"center"} mt={4}>
              <CHeading size={"lg"}>{t("chats")}</CHeading>
            </Box>
            <Divider mt={4} />
            {!loaded ? (
              <Flex
                w={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
                mt={4}
              >
                <Spinner size={"xl"} />
              </Flex>
            ) : null}

            {loaded ? (
              <Flex
                w={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
                mt={4}
                direction={"column"}
              >
                <Popover>
                  {({ isOpen, onClose }) => (
                    <>
                      <PopoverTrigger>
                        <Button
                          variant={"brand"}
                          leftIcon={<FaPlus />}
                          w={"80%"}
                        >
                          {t("chats.new")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent bg={"black"}>
                        <PopoverArrow bg={"black"} />
                        <PopoverCloseButton />
                        <PopoverHeader>{t("chats.new")}</PopoverHeader>
                        <PopoverBody>
                          <InputGroup>
                            <InputLeftAddon>@</InputLeftAddon>
                            <Input
                              id={"forum_msg-new-chat"}
                              placeholder={t("username")}
                            />
                          </InputGroup>
                        </PopoverBody>
                        <PopoverFooter>
                          <Button
                            variant={"brand"}
                            id={"forum_msg-new-chat-btn"}
                            onClick={async () => {
                              const username = document.getElementById(
                                "forum_msg-new-chat"
                              ) as HTMLInputElement;

                              const r = await REST.Forum.createChatV2({
                                token: localStorage.getItem("token") as string,
                                user: username.value,
                              });

                              if (r.status === 200) {
                                reloadChats();
                                setActiveChat(r.payload.chat._id);
                              } else {
                                toast({
                                  title: t("base:control.error"),
                                  description: t("chat.created.error"),
                                  status: "error",
                                  duration: 5000,
                                  isClosable: true,
                                  position: "top",
                                });
                              }
                              username.value = "";
                              onClose();
                            }}
                          >
                            {t("create")}
                          </Button>
                        </PopoverFooter>
                      </PopoverContent>
                    </>
                  )}
                </Popover>
                <Divider mt={4} />
              </Flex>
            ) : null}

            {chats
              ? chats.map((chat) => (
                  <>
                    <ChatCardV2
                      chat={{
                        id: chat.id,
                        displayName:
                          chat.users[0].username === userInfo.username
                            ? chat.users[1].displayName
                            : chat.users[0].displayName,
                        username:
                          chat.users[0].username === userInfo.username
                            ? chat.users[1].username
                            : chat.users[0].username,
                        verified:
                          chat.users[0].username === userInfo.username
                            ? chat.users[1].verified
                            : chat.users[0].verified,
                      }}
                      setActiveChat={setActiveChat}
                      reloadChats={reloadChats}
                    />
                    <Divider />
                  </>
                ))
              : null}
          </Flex>
        </Box>
        <Box flex={[0, "75%"]} display={["none", "initial"]}>
          <Flex
            direction={"column"}
            w={"100%"}
            minH={"100%"}
            maxH={"100%"}
            overflow={"auto"}
          >
            <Box pt={4} textAlign={"center"}>
              <CHeading size={"lg"}>{t("chat")}</CHeading>
            </Box>
            <Divider mt={4} />
            {activeChat ? (
              <>
                <ChatViewV2 chatId={activeChat} setActiveChat={setActiveChat} />
              </>
            ) : (
              <Flex
                w={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
                mt={4}
              >
                <Text>{t("chat.select")}</Text>
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["forum"])),
  };
}
