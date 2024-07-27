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
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

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

  const { t } = useTranslation("ai");

  const reloadChats = async () => {
    const res = await REST.AI.getAIChats(AccountManager.getActiveToken());

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: t("control.error", { ns: "base" }),
        description: t("error.loading") + res.payload.error,
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
        title: t("control.error", { ns: "base" }),
        description: t("error.loading.quota") + res.payload.error,
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
        title: t("control.error", { ns: "base" }),
        description: t("error.sending.request") + res.payload.error,
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
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <AppShell
        title={"Chats"}
        sub_pages={[
          {
            onClick: () => {
              setCurrentChat(null);
            },
            text: t("new.chat"),
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
              {t("title")}
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
                    {t("placeholder.text")}
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
                      createMessage(t("templates.project.idea"));
                    }}
                  >
                    <Text fontWeight={"bold"}>
                      {t("templates.project.idea")}
                    </Text>
                  </Box>
                  <Box
                    rounded={"md"}
                    borderWidth={2}
                    borderColor={"brand.500"}
                    p={2}
                    cursor={"pointer"}
                    onClick={() => {
                      createMessage(t("templates.react"));
                    }}
                  >
                    <Text fontWeight={"bold"}>{t("templates.react")}</Text>
                  </Box>
                  <Box
                    rounded={"md"}
                    borderWidth={2}
                    borderColor={"brand.500"}
                    p={2}
                    cursor={"pointer"}
                    onClick={() => {
                      createMessage(t("templates.rest"));
                    }}
                  >
                    <Text fontWeight={"bold"}>{t("templates.rest")}</Text>
                  </Box>
                  <Box
                    rounded={"md"}
                    borderWidth={2}
                    borderColor={"brand.500"}
                    p={2}
                    cursor={"pointer"}
                    onClick={() => {
                      createMessage(t("templates.algo"));
                    }}
                  >
                    <Text fontWeight={"bold"}>{t("templates.algo")}</Text>
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
                      placeholder={t("message")}
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
                    ? `${t("quota.msg.1")} ${quota.available} ${t(
                        "quota.msg.2"
                      )} ${new Date(quota.resetsAt).toLocaleString()} ${t(
                        "quota.msg.3"
                      )}`
                    : t("quota.loading")}
                </Text>
              </VStack>
            </Box>
          </Flex>
        </Flex>
      </AppShell>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["ai"])),
  };
}
