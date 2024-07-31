/**
 * apps/web/src/pages/editor/[project_id]/discovery.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.03.2023
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { useLoggedIn } from "@codeup/hooks";
import { io, Socket } from "socket.io-client";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/editor/EditorProjectLayout";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Link,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import Head from "next/head";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Discovery() {
  const router = useRouter();
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const [reactSocket, setReactSocket] = React.useState<Socket | null>(null);
  let socket: Socket | null = null;
  const [project, setProject] = React.useState<any>({});
  const { t } = useTranslation("editor");

  React.useEffect(() => {
    if (loaded) {
      if (!loggedIn) {
        router.push("/#login");
        window.dispatchEvent(new CustomEvent("codeup::open_login"));
      } else {
        if (router.query.project_id) {
          socket = io();
          setReactSocket(socket);
          registerSocket();
        }
      }
    }
  }, [loggedIn, userInfo, loaded, router]);

  const registerSocket = () => {
    if (socket) {
      socket.on("authenticate", (data: any) => {
        if (!data.authenticated) {
          router.push("/#login");
          window.dispatchEvent(new CustomEvent("codeup::open_login"));
        } else {
          socket?.emit("editor:projects:info", { id: router.query.project_id });
        }
      });

      socket.on("editor:projects:info", (data: any) => {
        if (data.success) {
          setProject(data.project);
        } else {
          PopupManager.alert({
            title: t("base:control.error"),
            description: data.error,
          });
        }
      });

      socket.emit("authenticate", localStorage.getItem("token") as string);

      // @ts-ignore
      window.__backup_socket = socket;
    }
  };

  return (
    <>
      <Head>
        <title>{t("discovery.doc.title")}</title>
      </Head>
      <EditorProjectLayout>
        {reactSocket ? (
          <>
            <Box textAlign={"center"} pt={6}>
              <CHeading size={"xl"}>{t("discovery.title")}</CHeading>
            </Box>
            <Flex w={"100%"} alignItems={"center"} justifyContent={"center"}>
              <Box w={"50%"} mt={4}>
                {project && project.customDomain && (
                  <>
                    <Stack>
                      <Text fontSize={"lg"}>{t("discovery.text")}</Text>
                      <Flex fontSize={"lg"}>
                        {project.customDomain.startsWith("disabled:") ? (
                          <Flex color={"red.300"} alignItems={"center"} gap={4}>
                            <FaExclamationTriangle />{" "}
                            {t("discovery.not.linked")}{" "}
                            <Text
                              color={"brand.500"}
                              cursor={"pointer"}
                              _hover={{
                                textDecoration: "underline",
                              }}
                              onClick={() => {
                                router.push(
                                  "/editor/" + project._id + "/deployment"
                                );
                              }}
                            >
                              {t("here")}
                            </Text>
                          </Flex>
                        ) : (
                          <>
                            <Stack>
                              <Flex
                                color={"brand.500"}
                                alignItems={"center"}
                                gap={4}
                              >
                                <FaCheck /> {t("discovery.linked")}:{" "}
                                {project.customDomain}
                              </Flex>
                              {project.discovery ? (
                                <>
                                  <Flex
                                    color={"brand.500"}
                                    alignItems={"center"}
                                    gap={4}
                                  >
                                    <FaCheck /> {t("discovery.visible")}
                                  </Flex>
                                </>
                              ) : (
                                <>
                                  <Flex
                                    color={"red.300"}
                                    alignItems={"center"}
                                    gap={4}
                                  >
                                    <FaExclamationTriangle />{" "}
                                    {t("discovery.not.visible")}
                                  </Flex>
                                </>
                              )}
                              <StackDivider />
                              <Button
                                variant={"brand"}
                                onClick={async () => {
                                  if (project.discovery) {
                                    reactSocket?.emit(
                                      "editor:projects:settings",
                                      {
                                        id: project._id,
                                        update: {
                                          discovery: false,
                                          discoveryDescription: "",
                                        },
                                      }
                                    );

                                    reactSocket?.on(
                                      "editor:projects:settings",
                                      (data: any) => {
                                        if (data.success) {
                                          setProject({
                                            ...project,
                                            discovery: false,
                                            discoveryDescription: "",
                                          });
                                          PopupManager.alert({
                                            title: t("success"),
                                            description: t("discovery.removed"),
                                          });
                                        } else {
                                          PopupManager.alert({
                                            title: t("base:control.error"),
                                            description:
                                              t("discovery.remove.error") +
                                              ": " +
                                              data.error,
                                          });
                                        }
                                      }
                                    );
                                  } else {
                                    const description =
                                      await PopupManager.promptAsync({
                                        title: t("description"),
                                        helperText: t(
                                          "discovery.description.text"
                                        ),
                                        inputType: "TEXTAREA",
                                      });

                                    if (!description) return;
                                    if (description.length > 1000)
                                      return PopupManager.alert({
                                        title: t("base:control.error"),
                                        description: t(
                                          "discovery.description.error.long"
                                        ),
                                      });

                                    if (description.length < 100)
                                      return PopupManager.alert({
                                        title: t("base:control.error"),
                                        description: t(
                                          "discovery.description.error.short"
                                        ),
                                      });

                                    reactSocket?.emit(
                                      "editor:projects:settings",
                                      {
                                        id: project._id,
                                        update: {
                                          discovery: true,
                                          discoveryDescription: description,
                                        },
                                      }
                                    );

                                    reactSocket?.on(
                                      "editor:projects:settings",
                                      (data: any) => {
                                        if (data.success) {
                                          setProject({
                                            ...project,
                                            discovery: true,
                                            discoveryDescription: description,
                                          });
                                          PopupManager.alert({
                                            title: t("success"),
                                            description: t(
                                              "discovery.published"
                                            ),
                                          });
                                        } else {
                                          PopupManager.alert({
                                            title: t("base:control.error"),
                                            description:
                                              t("discovery.publish.error") +
                                              ": " +
                                              data.error,
                                          });
                                        }
                                      }
                                    );
                                  }
                                }}
                              >
                                {project.discovery
                                  ? t("discovery.deactivate")
                                  : t("discovery.activate")}
                              </Button>
                              <StackDivider />
                              <Heading size={"xl"}>
                                {t("discovery.comments")}
                              </Heading>
                              {project.discoveryComments.length === 0 && (
                                <>
                                  <Text color={"red.300"}>
                                    {t("discovery.no.comments")}
                                  </Text>
                                </>
                              )}

                              <Accordion allowToggle allowMultiple>
                                {project.discoveryComments
                                  .sort(
                                    (a: any, b: any) =>
                                      new Date(b.created_at).getTime() -
                                      new Date(a.created_at).getTime()
                                  )
                                  .map((comment: any) => {
                                    return (
                                      <>
                                        <AccordionItem>
                                          <h2>
                                            <AccordionButton>
                                              <Box
                                                as={"span"}
                                                flex={1}
                                                textAlign={"left"}
                                              >
                                                {new Date(
                                                  comment.created_at
                                                ).toLocaleString() +
                                                  " - " +
                                                  comment.username}
                                              </Box>
                                              <AccordionIcon />
                                            </AccordionButton>
                                            <AccordionPanel pb={4}>
                                              {comment.comment}
                                            </AccordionPanel>
                                          </h2>
                                        </AccordionItem>
                                      </>
                                    );
                                  })}
                              </Accordion>
                            </Stack>
                          </>
                        )}
                      </Flex>
                    </Stack>
                  </>
                )}
              </Box>
            </Flex>
          </>
        ) : (
          <AuthenticateLoadingIndicator />
        )}
      </EditorProjectLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["editor"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
