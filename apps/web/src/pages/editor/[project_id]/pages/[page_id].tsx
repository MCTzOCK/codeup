/**
 * apps/web/src/pages/editor/[project_id]/pages/[page_id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.01.2023
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { useLoggedIn } from "@codeup/hooks";
import { io, Socket } from "socket.io-client";
import PopupManager from "../../../../global/PopupManager";
import AuthenticateLoadingIndicator from "@codeup/components/admin/AuthenticateLoadingIndicator";
import EditorPageSidebar from "@codeup/components/editor/EditorPageSidebar";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useRef, useState } from "react";
import { editor } from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export default function PageEditor() {
  const router = useRouter();

  const { loggedIn, loaded, userInfo } = useLoggedIn();

  const [reactSocket, setReactSocket] = React.useState<Socket>();
  let socket: Socket | null = null;
  const [currentResource, setCurrentResource] = React.useState<string>(
    "codeup.main_resource"
  );

  const [page, setPage] = React.useState<{
    _id: string;
    url: string;
    type: string;
    mainContent: string;
    resources: {
      name: string;
      type: string;
      content: string;
    }[];
  }>();

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
            socket.on("editor:projects:page:content", (data: any) => {
              if (data.success) {
                setPage(data.page);
              } else {
                PopupManager.alertAsync({
                  title: "Fehler",
                  description: data.error,
                }).then(() => {
                  router.push("/editor");
                });
              }
            });

            socket.on("editor:projects:page:content:set", (data: any) => {
              if (!data.success) {
                PopupManager.alert({
                  title: "Speichern fehlgeschlagen",
                  description: data.error,
                });
              }
            });

            socket.emit("editor:projects:page:content", {
              projectId: router.query.project_id,
              pageId: router.query.page_id,
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

  const monaco = useMonaco();
  const [monacoTheme, setMonacoTheme] = useState("vs-dark");
  const [monacoLanguage, setMonacoLanguage] = useState("html");

  const editorRef = useRef<IStandaloneCodeEditor>();

  React.useEffect(() => {
    if (monaco && monaco.editor) {
      monaco.editor.defineTheme("codeup-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#101113",
        },
      });

      setMonacoTheme("codeup-dark");
    }
  }, [monaco]);

  React.useEffect(() => {
    if (editorRef && editorRef.current && page) {
      if (currentResource !== "codeup.main_resource") {
        editorRef.current.setValue(
          page.resources.find((x) => x.name == currentResource)?.content || ""
        );
      } else {
        editorRef.current.setValue(page.mainContent);
      }

      setMonacoLanguage(
        currentResource === "codeup.main_resource"
          ? page.type.toLowerCase() === "html"
            ? "html"
            : "plain"
          : (page.resources
              .find((r) => r.name === currentResource)
              ?.type.toLowerCase() as string)
      );
    }
  }, [currentResource]);

  React.useEffect(() => {
    if (editorRef && editorRef.current) {
      monaco?.editor.setModelLanguage(
        editorRef.current.getModel() as editor.ITextModel,
        monacoLanguage
      );
    }
  }, [monacoLanguage]);

  if (page) {
    return (
      <>
        <Flex w={"100%"} minH={"100vh"} maxW={"100%"} direction={"row"}>
          <Box flex={["30%", "20%", "10%"]} minH={"90vh"}>
            <EditorPageSidebar
              page={page}
              projectId={router.query.project_id as string}
              socket={reactSocket as Socket}
              setPage={setPage}
              setCurrentResource={setCurrentResource}
            />
          </Box>
          <Box
            flex={["70%", "80%", "90%"]}
            minH={"90vh"}
            m={"2rem"}
            boxShadow={"2xl"}
          >
            <Flex direction={"column"} minH={"90vh"} w={"100%"}>
              <Heading
                bgColor={"black"}
                fontFamily={"monospace"}
                size={"xl"}
                p={2}
              >
                {currentResource === "codeup.main_resource"
                  ? "Hauptwebseite (" + page.url + ")"
                  : "Resource (" + currentResource + ")"}
              </Heading>

              <Editor
                defaultLanguage={monacoLanguage}
                defaultValue={
                  currentResource === "codeup.main_resource"
                    ? page.mainContent
                    : (
                        page.resources.find(
                          (r) => r.name === currentResource
                        ) as any
                      ).content
                }
                onMount={(e) => {
                  editorRef.current = e;
                }}
                onChange={(value, ev) => {
                  if (reactSocket) {
                    reactSocket.emit("editor:projects:page:content:set", {
                      projectId: router.query.project_id,
                      pageId: router.query.page_id,
                      content: value,
                      resource: currentResource,
                    });
                    setPage({
                      ...page,
                      mainContent:
                        currentResource === "codeup.main_resource"
                          ? (value as string)
                          : (page.mainContent as string),
                      resources: page.resources.map((r) => {
                        if (r.name === currentResource) {
                          return {
                            ...r,
                            content: value as string,
                          };
                        } else {
                          return r;
                        }
                      }),
                    });
                  }
                }}
                theme={monacoTheme}
                options={{
                  insertSpaces: false,
                  wrappingIndent: "indent",
                  fontSize: 22,
                }}
                height={"90vh"}
              />
            </Flex>
          </Box>
        </Flex>
      </>
    );
  } else {
    return <AuthenticateLoadingIndicator />;
  }
}
