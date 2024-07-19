/**
 * apps/web/src/pages/ai/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.07.2024
 *
 */

import * as React from "react";
import { useLoggedIn, useUserLoggedInRedirect } from "@codeup/hooks";
import AppShell from "@codeup/components/global/AppShell";
import { FaLightbulb, FaPlus } from "react-icons/fa";
import {
  Avatar,
  Box,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CHeading } from "@codeup/components/global/CHeading";
import { FaPaperPlane } from "react-icons/fa6";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../global/PopupManager";
import Markdown from "markdown-to-jsx";
import { defaultMdOpts } from "../../global/md/defaultProps";

type IChat = {
  _id: string;
  user: string;
  messages: {
    role: string;
    content: string;
  }[];
  createdAt: string;
};

export default function Index() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const [quota, setQuota] = React.useState<{
    _id: string;
    user: string;
    available: number;
    resetsAt: string;
  } | null>(null);

  const { userInfo } = useLoggedIn();

  const [loading, setLoading] = React.useState(false);

  const [chats, setChats] = React.useState<IChat[]>([]);

  const [currentChat, setCurrentChat] = React.useState<IChat | null>(null);

  const reloadChats = async () => {
    const res = await REST.AI.getAIChats(AccountManager.getActiveToken());

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die KI-Chats konnten nicht geladen werden: " + res.payload.error,
      });
      return;
    }

    setChats(res.payload.data);

    if (currentChat) {
      setCurrentChat(
        res.payload.data.find((c: IChat) => c._id === currentChat._id)
      );
    }
  };

  const reloadQuota = async () => {
    const res = await REST.AI.getAIQuota(AccountManager.getActiveToken());
    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die KI-Quota konnte nicht geladen werden: " + res.payload.error,
      });
      return;
    }

    setQuota(res.payload.data);
  };

  React.useEffect(() => {
    reloadChats();
    reloadQuota();
  }, []);

  const createMessage = async (msg: string) => {
    setLoading(true);

    const res = await REST.AI.createCompletion({
      message: msg,
      token: AccountManager.getActiveToken(),
      id: currentChat ? currentChat._id : undefined,
    });

    if (res.status !== 200) {
      setLoading(false);
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die Anfrage konnte nicht abgeschickt werden: " + res.payload.error,
      });
      return;
    }

    if (!currentChat) {
      setCurrentChat(res.payload.data);
    }

    await reloadChats();
    await reloadQuota();

    (document.querySelector("input[name=message]") as HTMLInputElement).value =
      "";

    setLoading(false);
  };

  React.useEffect(() => {
    const e = document.getElementById("ai-chat-ctn") as HTMLDivElement;
    if (!e) return;
    e.scrollTop = e.scrollHeight;
  }, [currentChat]);

  return (
    <>
      <AppShell
        title={"Chats"}
        sub_pages={[
          {
            onClick: () => {
              setCurrentChat(null);
            },
            text: "Neuer Chat",
            icon: <FaPlus />,
            top: true,
          },
          ...chats.map((c) => ({
            text: new Date(c.createdAt).toLocaleString(),
            icon: <FaLightbulb />,
            onClick: () => {
              setCurrentChat(c);
            },
          })),
        ]}
      >
        <Flex justifyContent={"center"} h={"100vh"} w={"100%"}>
          <Flex w={["100%", "100%", "60%"]} minH={"100vh"} direction={"column"}>
            <CHeading size={"xl"} textAlign={"center"} flex={0.05}>
              KI-Assistent
            </CHeading>
            <Box
              w={"100%"}
              flex={1}
              overflowY={"scroll"}
              maxH={["50vh", "60vh", "70vh"]}
            >
              {currentChat ? (
                <>
                  <Stack gap={2} p={4} id={"ai-chat-ctn"}>
                    {currentChat.messages.map((m, i) => (
                      <Flex
                        w={"100%"}
                        alignItems={"center"}
                        gap={4}
                        direction={m.role === "user" ? "row-reverse" : "row"}
                      >
                        <Avatar
                          name={
                            m.role === "user"
                              ? "@" + userInfo.username
                              : "CodeUp"
                          }
                          display={["none", "none", "initial"]}
                          background={"transparent"}
                          size={["xs", "sm", "md", "lg"]}
                          src={
                            m.role === "user"
                              ? "/api/account/" + userInfo.username + "/picture"
                              : "/codeup.svg"
                          }
                        />
                        <Flex direction={"column"} maxW={["90%", "70%"]}>
                          <Box
                            key={i}
                            p={3}
                            rounded={"xl"}
                            bg={m.role === "user" ? "brand.500" : "gray.700"}
                            color={m.role === "user" ? "black" : "white"}
                          >
                            {m.role === "assistant" ? (
                              <Markdown options={defaultMdOpts}>
                                {m.content || ""}
                              </Markdown>
                            ) : (
                              <Text fontWeight={"bold"}>{m.content}</Text>
                            )}
                          </Box>
                          <Text fontSize={"sm"} color={"gray.500"}>
                            {new Date(currentChat.createdAt).toLocaleString()}
                          </Text>
                        </Flex>
                      </Flex>
                    ))}
                  </Stack>
                </>
              ) : (
                <>
                  <Text fontSize={"lg"} textAlign={"center"} p={4}>
                    Wähle einen Chat aus oder starte einen neuen, indem du eine
                    Nachricht schreibst!
                  </Text>
                </>
              )}
            </Box>
            <Box flex={0.05} h={"fit-content"} p={4}>
              <VStack gap={2} pt={4}>
                <Grid
                  templateColumns={"repeat(2, 1fr)"}
                  gap={4}
                  maxW={["100%", "100%", "50%"]}
                >
                  <Box
                    rounded={"md"}
                    borderWidth={2}
                    borderColor={"brand.500"}
                    p={2}
                    cursor={"pointer"}
                    onClick={() => {
                      createMessage("Gib mir eine Projektidee!");
                    }}
                  >
                    <Text fontWeight={"bold"}>Gib mir eine Projektidee!</Text>
                  </Box>
                  <Box
                    rounded={"md"}
                    borderWidth={2}
                    borderColor={"brand.500"}
                    p={2}
                    cursor={"pointer"}
                    onClick={() => {
                      createMessage("Was ist React?");
                    }}
                  >
                    <Text fontWeight={"bold"}>Was ist React?</Text>
                  </Box>
                  <Box
                    rounded={"md"}
                    borderWidth={2}
                    borderColor={"brand.500"}
                    p={2}
                    cursor={"pointer"}
                    onClick={() => {
                      createMessage("Gib mir die Definition einer REST-API.");
                    }}
                  >
                    <Text fontWeight={"bold"}>
                      Gib mir die Definition einer REST-API.
                    </Text>
                  </Box>
                  <Box
                    rounded={"md"}
                    borderWidth={2}
                    borderColor={"brand.500"}
                    p={2}
                    cursor={"pointer"}
                    onClick={() => {
                      createMessage(
                        "Welche Eigenschaften hat ein Algorithmus?"
                      );
                    }}
                  >
                    <Text fontWeight={"bold"}>
                      Welche Eigenschaften hat ein Algorithmus?
                    </Text>
                  </Box>
                </Grid>
                <form
                  onSubmit={async (e) => {
                    if (loading) return;
                    e.preventDefault();
                    const fd = new FormData(e.target as HTMLFormElement);

                    const msg = fd.get("message") as string;

                    if (!msg) return;

                    createMessage(msg);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HStack w={["100%", "75%"]} gap={2}>
                    <Input
                      placeholder={"Nachricht"}
                      flex={1}
                      variant={"filled"}
                      name={"message"}
                    />
                    <IconButton
                      type={"submit"}
                      icon={<FaPaperPlane />}
                      variant={"brand"}
                      aria-label={"Send"}
                      isLoading={loading}
                    />
                  </HStack>
                </form>
                <Text fontSize={"sm"} color={"gray.400"}>
                  {quota
                    ? `Du hast noch ${
                        quota.available
                      } Anfragen übrig. Du bekommst am ${new Date(
                        quota.resetsAt
                      ).toLocaleString()} 10 weitere Anfragen!`
                    : "Lade..."}
                </Text>
              </VStack>
            </Box>
          </Flex>
        </Flex>
      </AppShell>
    </>
  );
}
