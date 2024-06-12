/**
 * apps/web/src/pages/projects/[id]/editor/professional.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.06.2024
 *
 */
import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { useRouter } from "next/router";
import { Box, Flex, Text } from "@chakra-ui/react";
import AppShell from "@codeup/components/dist/global/AppShell";
import { IProject } from "../../../../types/IProject";
import { useEffect } from "react";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/editorv2/EditorProjectLayout";
import { DirectoryNode, FileNode, WebContainer } from "@webcontainer/api";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { Stripe } from "stripe";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import EditorFileExplorer from "@codeup/components/editorv2/EditorFileExplorer";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function Professional() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  type entry = {
    name: string;
    type: string;
    children: entry[];
    content?: any;
  };

  const [project, setProject] = React.useState<IProject | null>(null);
  const [fileTree, setFileTree] = React.useState<{
    [key: string]: FileNode | DirectoryNode;
  }>({});
  const [simpleFileTree, setSimpleFileTree] = React.useState<entry | null>(
    null
  );

  const [webContainer, setWebContainer] = React.useState<WebContainer | null>(
    null
  );
  const [isBootstrapping, setIsBootstrapping] = React.useState<boolean>(false);
  const [terminal, setTerminal] = React.useState<any | null>(null);
  const [terminalData, setTerminalData] = React.useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then((res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reloadFileTree();
      } else {
        PopupManager.alertAsync({
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const reloadFileTree = async () => {
    const res = await REST.Projects.GitOps.tree(
      AccountManager.getActiveToken(),
      router.query.id as string,
      "webcontainer"
    );

    if (res.status === 200) {
      setFileTree(res.payload.data);
      setSimpleFileTree({
        name: "root",
        type: "directory",
        children: res.payload.tree,
      });
      //await bootWebContainer(res.payload.data);
    } else {
      await PopupManager.alertAsync({
        title: "Fehler",
        description: "Das Dateisystem konnte nicht geladen werden",
      });
    }
  };

  const bootWebContainer = async (wcpaths: any) => {
    if (isBootstrapping) return;
    if (webContainer) return;
    setIsBootstrapping(true);
    const wc = await WebContainer.boot();

    await wc.mount(wcpaths);
    setWebContainer(wc);
    await installDeps(wc);
    setIsBootstrapping(false);
  };

  const installDeps = async (wc: WebContainer) => {
    if (!wc) return;
    console.log("Installing dependencies");

    const installProcess = await wc.spawn("npm", ["install"], {
      env: {
        NO_COLOR: true,
      },
    });

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          setTerminalData((prev) => [...prev, data]);
          console.log(data);
        },
      })
    );
  };

  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        {isBootstrapping && (
          <>
            <AuthenticateLoadingIndicator text={"Starte WebContainer..."} />
          </>
        )}
        {webContainer && !isBootstrapping && <></>}
        {simpleFileTree && (
          <Box p={6}>
            <Flex bg={"gray.900"} rounded={"md"} p={2}>
              <PanelGroup
                autoSaveId={"editor-panel-group"}
                direction={"horizontal"}
                style={{
                  gap: "0.75rem",
                }}
              >
                <Panel
                  defaultSize={25}
                  minSize={25}
                  maxSize={70}
                  style={{
                    padding: "var(--chakra-space-2)",
                    borderRadius: "var(--chakra-radii-md)",
                  }}
                >
                  <EditorFileExplorer
                    projectName={project!.name}
                    fileTree={simpleFileTree}
                    openFile={(path) => {}}
                    deleteFile={async (path) => {
                      if (
                        path.startsWith(".git") ||
                        path === "project.codeup.json"
                      ) {
                        await PopupManager.alertAsync({
                          title: "Datei löschen",
                          description: `Die Datei ${path} kann nicht gelöscht werden`,
                        });
                        return;
                      }
                      if (
                        !(await PopupManager.confirmAsync({
                          title: "Datei löschen",
                          question: `Möchtest du die Datei ${path} wirklich löschen?`,
                        }))
                      )
                        return;

                      const res = await REST.Projects.Files.delete(
                        AccountManager.getActiveToken(),
                        router.query.id as string,
                        path
                      );

                      if (res.status === 200) {
                        await reloadFileTree();
                      } else {
                        await PopupManager.alertAsync({
                          title: "Fehler",
                          description: res.payload.error,
                        });
                      }
                    }}
                    createDirectory={async (path) => {
                      const res = await REST.Projects.Files.createFolder(
                        AccountManager.getActiveToken(),
                        router.query.id as string,
                        path
                      );

                      if (res.status === 200) {
                        await reloadFileTree();
                      } else {
                        await PopupManager.alertAsync({
                          title: "Fehler",
                          description: res.payload.error,
                        });
                      }
                    }}
                    createFile={async (path) => {
                      const res = await REST.Projects.Files.setFileContent(
                        AccountManager.getActiveToken(),
                        router.query.id as string,
                        path,
                        ""
                      );

                      if (res.status === 200) {
                        await reloadFileTree();
                      } else {
                        await PopupManager.alertAsync({
                          title: "Fehler",
                          description: res.payload.error,
                        });
                      }
                    }}
                    renameFile={async (path, newName) => {
                      if (
                        path.startsWith(".git") ||
                        path === "project.codeup.json"
                      ) {
                        await PopupManager.alertAsync({
                          title: "Datei umbenennen",
                          description: `Die Datei ${path} kann nicht umbenannt werden`,
                        });
                        return;
                      }

                      const res = await REST.Projects.Files.rename(
                        AccountManager.getActiveToken(),
                        router.query.id as string,
                        path,
                        newName
                      );

                      if (res.status === 200) {
                        await reloadFileTree();
                      } else {
                        await PopupManager.alertAsync({
                          title: "Fehler",
                          description: res.payload.error,
                        });
                      }
                    }}
                  />
                </Panel>
                <PanelResizeHandle
                  style={{
                    cursor: "col-resize",
                    width: "0.5rem",
                    backgroundColor: "#2C2E33",
                    border: "1px solid gray.800",
                    borderRadius: "0.25rem",
                  }}
                />
                <Panel defaultSize={75} minSize={30} maxSize={100}>
                  <Box bg={"#FFAAFF"} rounded={"md"}>
                    Code
                  </Box>
                </Panel>
              </PanelGroup>
            </Flex>
          </Box>
        )}
      </EditorProjectLayout>
    </>
  );
}
