/**
 * apps/web/src/pages/editor/[project_id]/serverless/[page_id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.02.2023
 *
 */

import * as React from "react";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useLoggedIn } from "@codeup/hooks";
import { io, Socket } from "socket.io-client";
import PopupManager from "../../../../global/PopupManager";
import AuthenticateLoadingIndicator from "@codeup/components/admin/AuthenticateLoadingIndicator";
import { Box, Flex } from "@chakra-ui/react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export default function FunctionEditor() {
  const router = useRouter();

  const { loggedIn, loaded, userInfo } = useLoggedIn();

  const [reactSocket, setReactSocket] = React.useState<Socket>();
  let socket: Socket | null = null;

  const [func, setFunc] = React.useState<{
    _id: string;
    path: string;
    code: string;
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
            socket.on("editor:projects:functions:content", (data: any) => {
              if (data.success) {
                setFunc(data.function);
              } else {
                PopupManager.alertAsync({
                  title: "Fehler",
                  description: data.error
                }).then(() => {
                  router.push("/editor");
                });
              }
            });

            socket.on("editor:projects:functions:content:set", (data: any) => {
              if (!data.success) {
                PopupManager.alert({
                  title: "Speichern fehlgeschlagen",
                  description: data.error
                });
              }
            });

            socket.emit("editor:projects:functions:content", {
              projectId: router.query.project_id,
              pageId: router.query.page_id
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

  const editorRef = useRef<IStandaloneCodeEditor>();

  React.useEffect(() => {
    if (monaco && monaco.editor) {
      monaco.editor.defineTheme("codeup-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#101113"
        }
      });


      setMonacoTheme("codeup-dark");
    }
  }, [monaco]);

  if (func) {
    return (
      <>
        <Flex w={"100%"} minH={"100vh"} maxW={"100%"} direction={"row"}>
          <Box flex={["30%", "20%", "10%"]} minH={"90vh"}>

          </Box>
          <Box
            flex={["70%", "80%", "90%"]}
            minH={"90vh"}
            m={"2rem"}
            boxShadow={"2xl"}
          >
            <Flex direction={"column"} minH={"90vh"} w={"100%"}>
              <Editor
                defaultLanguage={"javascript"}
                defaultValue={
                  func.code
                }
                onMount={(e) => {
                  editorRef.current = e;
                }}
                onChange={(value, ev) => {
                  if (reactSocket) {
                    reactSocket.emit("editor:projects:functions:content:set", {
                      projectId: router.query.project_id,
                      pageId: router.query.page_id,
                      code: value
                    });
                    setFunc({
                      ...func,
                      code: value as string
                    });
                  }
                }}
                theme={monacoTheme}
                options={{
                  insertSpaces: false,
                  wrappingIndent: "indent",
                  fontSize: 22
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
