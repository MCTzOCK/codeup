/**
 * apps/web/src/pages/editor/[project_id]/functions/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.01.2023
 *
 */

import * as React from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/router";
import { useLoggedIn } from "@codeup/hooks";
import EditorProjectLayout from "@codeup/components/dist/editor/EditorProjectLayout";
import GridLayout from "@codeup/components/global/GridLayout";
import {
  Button,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  FaCode,
  FaEdit,
  FaHtml5,
  FaLink,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import PopupManager from "../../../../global/PopupManager";
import Head from "next/head";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { sProp } from "../../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function ProjectfunctionsViewer() {
  const router = useRouter();
  const { t } = useTranslation("editor");

  const { loggedIn, loaded, userInfo } = useLoggedIn();

  const [reactSocket, setReactSocket] = React.useState<Socket>();
  let socket: Socket | null = null;

  const [functions, setFunctions] = React.useState<
    {
      _id: string;
      path: string;
    }[]
  >([]);

  const [query, setQuery] = React.useState<string>("");

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
        if (data.authenticated) {
          if (socket) {
            socket.on("editor:projects:functions", (data: any) => {
              if (data.success) {
                setFunctions(data.functions);
              } else {
                PopupManager.alert({
                  title: t("base:control.error"),
                  description: data.error,
                });
              }
            });

            socket.emit("editor:projects:functions", {
              id: router.query.project_id,
            });
          }
        } else {
          router.push("/#login");
          window.dispatchEvent(new CustomEvent("codeup::open_login"));
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
        <title>{t("funcs.doc.title")}</title>
      </Head>
      <EditorProjectLayout>
        <GridLayoutV2
          pageTitle={t("funcs.title")}
          search={{
            show: true,
            fields: true,
          }}
          topButtons={[
            {
              text: t("new"),
              leftIcon: <FaPlus />,
              variant: "brand",
              onClick: async () => {
                const url = await PopupManager.promptAsync({
                  title: t("new.function"),
                  helperText: t("new.function.url"),
                });

                if (reactSocket) {
                  reactSocket.emit("editor:projects:functions:create", {
                    id: router.query.project_id,
                    url: "/" + url,
                  });

                  reactSocket.on(
                    "editor:projects:functions:create",
                    (data: any) => {
                      if (data.success) {
                        setFunctions([
                          ...functions,
                          {
                            _id: data.function._id,
                            path: data.function.path,
                          },
                        ]);
                      } else {
                        PopupManager.alert({
                          title: t("base:control.error"),
                          description: data.error as string,
                        });
                      }
                    }
                  );
                }
              },
            },
          ]}
          entries={functions.map((func) => {
            return {
              title: func.path,
              fields: [
                {
                  text: "",
                  icon: null,
                },
              ],
              buttonRows: [
                [
                  {
                    colorScheme: "red",
                    leftIcon: <FaTrash />,
                    text: t("delete"),
                    onClick: async () => {
                      if (
                        await PopupManager.confirmAsync({
                          title: t("delete.function"),
                          question: t("delete.function.confirm"),
                        })
                      ) {
                        if (reactSocket) {
                          reactSocket.on(
                            "editor:projects:functions:delete",
                            (data: any) => {
                              if (data.success) {
                                setFunctions(
                                  functions.filter((p) => p._id !== func._id)
                                );
                              } else {
                                PopupManager.alert({
                                  title: t("base:control.error"),
                                  description: data.error as string,
                                });
                              }
                            }
                          );

                          reactSocket.emit("editor:projects:functions:delete", {
                            projectId: router.query.project_id,
                            pageId: func._id,
                          });
                        }
                      }
                    },
                  },
                ],
                [
                  {
                    variant: "brand",
                    leftIcon: <FaLink />,
                    text: t("function.change.url"),
                    onClick: async () => {
                      let newUrl = await PopupManager.promptAsync({
                        title: t("function.edit"),
                        helperText: t("function.edit.url"),
                      });

                      if (newUrl) {
                        newUrl = ["/api/", newUrl].join("");

                        if (reactSocket) {
                          reactSocket.on(
                            "editor:projects:functions:rename",
                            (data: any) => {
                              if (data.success) {
                                setFunctions(
                                  functions.map((p) => {
                                    if (p._id === func._id) {
                                      return {
                                        ...p,
                                        path: newUrl,
                                      };
                                    } else {
                                      return p;
                                    }
                                  })
                                );
                              } else {
                                PopupManager.alert({
                                  title: t("base:control.error"),
                                  description: data.error as string,
                                });
                              }
                            }
                          );

                          reactSocket.emit("editor:projects:functions:rename", {
                            projectId: router.query.project_id,
                            pageId: func._id,
                            newUrl,
                          });
                        }
                      }
                    },
                  },
                  {
                    text: t("edit"),
                    variant: "brand",
                    leftIcon: <FaEdit />,
                    onClick: () => {
                      router.push(
                        `/editor/${router.query.project_id}/serverless/${func._id}`
                      );
                    },
                  },
                ],
              ],
            };
          })}
        />
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
