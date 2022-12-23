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
  Text,
  useToast,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { useLoggedIn } from "@codeup/hooks";

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

  const reloadMessages = () => {
    REST.Forum.getChatMessagesV2({
      token: localStorage.getItem("token") as string,
      id: props.chatId,
    }).then((r) => {
      if (r.status === 200) {
        setMessages(r.payload.messages);
      } else {
        toast({
          title: "Fehler",
          description: "Beim Laden der Nachrichten ist ein Fehler aufgetreten.",
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
  }, []);

  useEffect(reloadMessages, []);

  const { userInfo, loggedIn, loaded: loadedUserInfo } = useLoggedIn();

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
                  mt={"2rem"}
                  mb={"2rem"}
                  p={"2rem"}
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
                      <Avatar
                        src={"/api/account/" + m.username + "/picture"}
                        size={"sm"}
                      />
                      {m.username}
                    </Flex>
                    <Box
                      bg={
                        userInfo.username === m.username
                          ? "green.100"
                          : "gray.500"
                      }
                      p={4}
                      fontSize={"xl"}
                      rounded={"xl"}
                      shadow={"xl"}
                      // arrow to the top
                      position={"relative"}
                      _after={{
                        content: '""',
                        position: "absolute",
                        top: "-1rem",
                        left:
                          userInfo.username === m.username
                            ? "calc(100% - 3rem)"
                            : "3rem",

                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "1rem solid transparent",
                        borderRight: "1rem solid transparent",
                        borderBottom: "1rem solid",
                        borderBottomColor:
                          userInfo.username === m.username
                            ? "green.100"
                            : "gray.500",
                      }}
                    >
                      {m.content}
                    </Box>
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
                    title: "Fehler",
                    description:
                      "Beim Senden der Nachricht ist ein Fehler aufgetreten.",
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
              <Input type={"text"} placeholder={"Nachricht"} name={"message"} />
              <Button
                leftIcon={<FiSend />}
                type={"submit"}
                colorScheme={"green"}
              >
                Senden
              </Button>
            </Flex>
          </form>
        </Box>
      </Flex>
    </>
  );
}
