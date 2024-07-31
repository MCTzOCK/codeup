/**
 * apps/web/src/pages/editor/[project_id]/index.tsx
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
import EditorProjectLayout from "@codeup/components/editor/EditorProjectLayout";
import { Heading } from "@chakra-ui/react";
import {
  FaCode,
  FaEdit,
  FaHtml5,
  FaLink,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import PopupManager from "../../../global/PopupManager";
import GridLayout from "@codeup/components/global/GridLayout";
import Head from "next/head";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function ProjectViewer() {
  const router = useRouter();

  const { t } = useTranslation("editor");

  const { loggedIn, loaded, userInfo } = useLoggedIn();

  const [reactSocket, setReactSocket] = React.useState<Socket>();
  let socket: Socket | null = null;

  const [pages, setPages] = React.useState<
    {
      _id: string;
      url: string;
      type: string;
    }[]
  >([]);

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
            socket.on("editor:projects:pages", (data: any) => {
              if (data.success) {
                setPages(data.pages);
              } else {
                PopupManager.alert({
                  title: t("base:control.error"),
                  description: data.error,
                });
              }
            });

            socket.emit("editor:projects:pages", {
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
        <title>{t("pages.doc.title")}</title>
      </Head>
      <EditorProjectLayout>
        <GridLayoutV2
          pageTitle={t("pages.title")}
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
                  title: t("new.page"),
                  helperText: t("new.page.text"),
                });

                const type = await PopupManager.selectAsync({
                  title: t("new.page.type"),
                  helperText: t("new.page.type.helper"),
                  choices: ["HTML", "InCode"],
                });

                if (type) {
                  if (reactSocket) {
                    reactSocket.emit("editor:projects:pages:create", {
                      id: router.query.project_id,
                      url: "/" + url,
                      type: type,
                    });

                    reactSocket.on(
                      "editor:projects:pages:create",
                      (data: any) => {
                        if (data.success) {
                          setPages([
                            ...pages,
                            {
                              _id: data.page._id,
                              url: data.page.url,
                              type: data.page.type,
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
                }
              },
            },
          ]}
          entries={pages.map((page) => {
            return {
              title: page.url === "/" ? t("page.main") + " (/)" : page.url,
              fields: [
                {
                  text: page.type === "HTML" ? "HTML" : "InCode",
                  icon: page.type === "HTML" ? <FaHtml5 /> : <FaCode />,
                },
              ],
              buttonRows: [
                [
                  {
                    text: t("delete"),
                    leftIcon: <FaTrash />,
                    colorScheme: "red",
                    onClick: async () => {
                      if (
                        await PopupManager.confirmAsync({
                          title: t("page.delete"),
                          question: t("page.delete.confirm"),
                        })
                      ) {
                        if (reactSocket) {
                          reactSocket.on(
                            "editor:projects:pages:delete",
                            (data: any) => {
                              if (data.success) {
                                setPages(
                                  pages.filter((p) => p._id !== page._id)
                                );
                              } else {
                                PopupManager.alert({
                                  title: t("base:control.error"),
                                  description: data.error as string,
                                });
                              }
                            }
                          );

                          reactSocket.emit("editor:projects:pages:delete", {
                            projectId: router.query.project_id,
                            pageId: page._id,
                          });
                        }
                      }
                    },
                  },
                  {
                    text: t("page.change.url"),
                    leftIcon: <FaLink />,
                    variant: "brand",
                    onClick: async () => {
                      let newUrl = await PopupManager.promptAsync({
                        title: t("page.edit"),
                        helperText: t("page.change.url.helper"),
                      });

                      if (newUrl) {
                        newUrl = ["/", newUrl].join("");

                        if (reactSocket) {
                          reactSocket.on(
                            "editor:projects:pages:rename",
                            (data: any) => {
                              if (data.success) {
                                setPages(
                                  pages.map((p) => {
                                    if (p._id === page._id) {
                                      return {
                                        ...p,
                                        url: newUrl,
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

                          reactSocket.emit("editor:projects:pages:rename", {
                            projectId: router.query.project_id,
                            pageId: page._id,
                            newUrl,
                          });
                        }
                      }
                    },
                  },
                ],
                [
                  {
                    text: t("edit"),
                    leftIcon: <FaEdit />,
                    variant: "brand",
                    onClick: async () => {
                      router.push(
                        `/editor/${router.query.project_id}/pages/${page._id}`
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
