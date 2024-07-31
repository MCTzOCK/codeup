/**
 * apps/web/src/pages/editor/[project_id]/export.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.02.2023
 *
 */

import * as React from "react";
import { useId } from "react";
import { useRouter } from "next/router";
import { useLoggedIn } from "@codeup/hooks";
import { io, Socket } from "socket.io-client";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/dist/editor/EditorProjectLayout";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import JSZip from "jszip";
import Networking from "@codeup/util/dist/Networking";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import Head from "next/head";
import { FaCrown } from "react-icons/fa";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Export() {
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
        <title>{t("export.doc.title")}</title>
      </Head>
      <EditorProjectLayout>
        <Box textAlign={"center"} pt={6}>
          <CHeading size={"xl"}>{t("export.title")}</CHeading>
        </Box>
        {reactSocket ? (
          <>
            <Flex w={"100%"} alignItems={"center"} justifyContent={"center"}>
              <Box w={"50%"} mt={4}>
                <Stack>
                  <HStack color={"brand.500"}>
                    <FaCrown />
                    <Text>
                      {t("export.codeup.pro")} <b>CodeUp PRO</b>
                    </Text>
                  </HStack>
                  <Text fontSize={"lg"}>{t("export.text")}</Text>
                  <StackDivider />
                  <Button
                    variant={"brand"}
                    onClick={async () => {
                      if (userInfo.subscription !== "PRO") {
                        await PopupManager.alertAsync({
                          title: "CodeUp PRO",
                          description: t("export.codeup.pro.text"),
                        });
                        return;
                      }

                      let pages: any[] = [];
                      let staticAssets: any[] = [];
                      let functions: any[] = [];

                      reactSocket.on("editor:projects:pages", (data: any) => {
                        if (data.success) {
                          let realPages: any[] = [];
                          for (const p of data.pages) {
                            reactSocket.on(
                              "editor:projects:page:content",
                              (data: any) => {
                                if (data.success) {
                                  realPages.push(data.page);
                                }
                              }
                            );
                            reactSocket.emit("editor:projects:page:content", {
                              projectId: router.query.project_id,
                              pageId: p._id,
                            });
                          }
                          pages = realPages;

                          reactSocket.on(
                            "editor:projects:static:assets",
                            (data: any) => {
                              if (data.success) {
                                staticAssets = data.files;

                                reactSocket.on(
                                  "editor:projects:functions",
                                  async (data: any) => {
                                    if (data.success) {
                                      functions = data.functions;

                                      const zip = new JSZip();

                                      zip.file(
                                        "project.json",
                                        JSON.stringify(project, null, 2)
                                      );
                                      const pagesFolder = zip.folder(
                                        "pages"
                                      ) as JSZip;
                                      const staticFolder = zip.folder(
                                        "static"
                                      ) as JSZip;
                                      const functionsFolder = zip.folder(
                                        "functions"
                                      ) as JSZip;

                                      for (let page of pages) {
                                        let url = page.url.replace(/\//g, "_");

                                        const pageFolder = pagesFolder.folder(
                                          url
                                        ) as JSZip;
                                        if (page.type === "HTML") {
                                          pageFolder!.file(
                                            "index.html",
                                            page.mainContent
                                          );
                                        } else {
                                          pageFolder!.file(
                                            "index.ic",
                                            page.mainContent
                                          );
                                        }

                                        for (let resource of page.resources) {
                                          pageFolder!.file(
                                            resource.name + "." + resource.type,
                                            resource.content
                                          );
                                        }
                                      }

                                      for (let asset of staticAssets) {
                                        staticFolder!.file(
                                          asset.filename.replace("/", "_") +
                                            ".json",
                                          JSON.stringify(
                                            {
                                              originalName: asset.filename,
                                              downloadUrl:
                                                "https://codeup.space/editor-static/" +
                                                asset.filename,
                                            },
                                            null,
                                            2
                                          )
                                        );
                                      }

                                      for (let func of functions) {
                                        functionsFolder!.file(
                                          func.path.replace(/\//g, "_") + ".js",
                                          func.code
                                        );
                                      }

                                      // download zip
                                      const blob = await zip.generateAsync({
                                        type: "blob",
                                      });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement("a");
                                      a.href = url;
                                      a.download = `${project.name}.zip`;
                                      a.click();
                                      URL.revokeObjectURL(url);
                                    } else {
                                      PopupManager.alert({
                                        title: t("base:control.error"),
                                        description: data.error,
                                      });
                                    }
                                  }
                                );
                                reactSocket.emit("editor:projects:functions", {
                                  id: router.query.project_id,
                                });
                              } else {
                                PopupManager.alert({
                                  title: t("base:control.error"),
                                  description: data.error,
                                });
                              }
                            }
                          );
                          reactSocket.emit("editor:projects:static:assets", {
                            id: router.query.project_id,
                          });
                        } else {
                          PopupManager.alert({
                            title: t("base:control.error"),
                            description: data.error,
                          });
                        }
                      });
                      reactSocket.emit("editor:projects:pages", {
                        id: router.query.project_id,
                      });
                    }}
                  >
                    {t("export.title")}
                  </Button>
                </Stack>
              </Box>
            </Flex>
          </>
        ) : (
          <>
            <AuthenticateLoadingIndicator />
          </>
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
