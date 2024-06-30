/**
 * apps/web/src/pages/editor/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.01.2023
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import {
  Box,
  CircularProgress,
  Flex,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { io, Socket } from "socket.io-client";
import {
  FaClock,
  FaEye,
  FaFileUpload,
  FaPen,
  FaPlus,
  FaTrash,
  FaUsers,
} from "react-icons/fa";
import CollaboratorManager from "@codeup/components/editor/CollaboratorManager";
import PopupManager from "../../global/PopupManager";
import JSZip from "jszip";
import GridLayout from "@codeup/components/global/GridLayout";
import Head from "next/head";
import GridLayoutV2 from "@codeup/components/global/GridLayoutV2";

export default function Editor() {
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCollabOpen,
    onOpen: onCollabOpen,
    onClose: onCollabClose,
  } = useDisclosure();

  const [reactSocket, setReactSocket] = React.useState<Socket>();
  let socket: Socket | null = null;

  const [projects, setProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (loaded) {
      if (!loggedIn) {
        router.push("/#login");
        window.dispatchEvent(new CustomEvent("codeup::open_login"));
      } else {
        socket = io();
        setReactSocket(socket);
        registerSocket();
      }
    }
  }, [loggedIn, userInfo, loaded, router]);

  const registerSocket = () => {
    if (socket) {
      socket.on("authenticate", (data: any) => {
        console.debug(data);
        if (data.authenticated) {
          console.debug("Authenticated");

          if (socket) {
            socket.on("editor:projects:list", (data: any) => {
              console.debug(data);
              if (data.success) {
                setProjects(data.projects);
              }
            });

            socket.emit("editor:projects:list");
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

  const [editProjectPropID, setEditProjectPropID] = React.useState<
    string | null
  >(null);

  return (
    <>
      <Head>
        <title>Editor - CodeUp</title>
      </Head>
      {loggedIn ? (
        <Box minH={"100vh"} h={"fit-content"} bg={"#000"}>
          <GridLayoutV2
            pageTitle={"Projekte"}
            search={{
              show: true,
              fields: true,
            }}
            topButtons={[
              {
                text: "Neu",
                leftIcon: <FaPlus />,
                variant: "brand",
                onClick: async () => {
                  const name = await PopupManager.promptAsync({
                    title: "Neues Projekt",
                    helperText:
                      "Der Name sollte das Projekt bestmöglich beschreiben, damit du es später wieder findest.",
                  });

                  if (name) {
                    reactSocket?.emit("editor:projects:create", {
                      name: name,
                    });

                    reactSocket?.on("editor:projects:create", (data: any) => {
                      if (data.success) {
                        reactSocket?.emit("editor:projects:list");
                      } else {
                        PopupManager.alert({
                          description: data.error as string,
                        });
                      }
                    });
                  }
                },
              },
              {
                text: "Importieren",
                leftIcon: <FaFileUpload />,
                variant: "brand",
                onClick: async () => {
                  const name = await PopupManager.promptAsync({
                    title: "Neues Projekt",
                    helperText:
                      "Der Name sollte das Projekt bestmöglich beschreiben, damit du es später wieder findest.",
                  });

                  if (name) {
                    const files = await PopupManager.uploadFileAsync({
                      title: "Projekt importieren",
                      helperText:
                        "Wähle eine ZIP-Datei aus, die du importieren möchtest.",
                    });

                    if (files.length > 0) {
                      reactSocket?.emit("editor:projects:create", {
                        name: name,
                      });

                      reactSocket?.on(
                        "editor:projects:create",
                        (projectData: any) => {
                          if (projectData.success) {
                            const file = files[0];
                            const reader = new FileReader();
                            reader.readAsArrayBuffer(file);

                            reader.onload = () => {
                              const buffer = Buffer.from(
                                reader.result as ArrayBuffer
                              );
                              const zip = new JSZip();

                              zip.loadAsync(buffer).then(async (zip) => {
                                if (
                                  zip.files["pages/"] &&
                                  zip.files["pages/"].dir
                                ) {
                                  const corrupted = [];
                                  let pageDir = Object.keys(zip.files).filter(
                                    (file) => file.startsWith("pages/")
                                  );
                                  let funcDir = Object.keys(zip.files).filter(
                                    (file) => file.startsWith("functions/")
                                  );

                                  // only get top level directories
                                  let pdT = [];

                                  for (const page of pageDir) {
                                    if (
                                      page.endsWith("/") &&
                                      page !== "pages/"
                                    ) {
                                      pdT.push(page);
                                    }
                                  }

                                  pageDir = pdT;

                                  for (const page of pageDir) {
                                    let indexType = "html";
                                    let indexContent = "";
                                    let pageCorrupted = false;

                                    if (zip.files[`${page}index.html`]) {
                                      indexContent = await zip.files[
                                        `${page}index.html`
                                      ].async("string");
                                    } else {
                                      if (zip.files[`${page}index.ic`]) {
                                        indexType = "incode";
                                        indexContent = await zip.files[
                                          `${page}index.ic`
                                        ].async("string");
                                      } else {
                                        corrupted.push(page);
                                        pageCorrupted = true;
                                      }
                                    }

                                    if (!pageCorrupted) {
                                      reactSocket?.emit(
                                        "editor:projects:pages:create",
                                        {
                                          id: projectData.project._id as string,
                                          url: page
                                            .split("/")
                                            [
                                              page.split("/").length - 2
                                            ].replace("_", "/"),
                                          type:
                                            indexType === "html"
                                              ? "HTML"
                                              : "InCode",
                                          content: indexContent,
                                        }
                                      );

                                      await new Promise((resolve) => {
                                        reactSocket?.on(
                                          "editor:projects:pages:create",
                                          async (data: any) => {
                                            if (data.success) {
                                              if (
                                                // @ts-ignore
                                                !window.__codeup__temp__editor__resource_imports
                                              ) {
                                                // @ts-ignore
                                                window.__codeup__temp__editor__resource_imports =
                                                  [];
                                              }

                                              let resourceFiles = Object.keys(
                                                zip.files
                                              ).filter((file) =>
                                                file.startsWith(page)
                                              );

                                              resourceFiles =
                                                resourceFiles.filter(
                                                  (file) =>
                                                    !file.endsWith(
                                                      "index.html"
                                                    ) &&
                                                    !file.endsWith("index.ic")
                                                );

                                              const resources: any[] = [];

                                              for (const resource of resourceFiles) {
                                                const resourceContent =
                                                  await zip.files[
                                                    resource
                                                  ].async("string");
                                                resources.push({
                                                  content: resourceContent,
                                                  name: resource
                                                    .split("/")
                                                    [
                                                      resource.split("/")
                                                        .length - 1
                                                    ].split(".")[0],
                                                  type: resource
                                                    .split("/")
                                                    [
                                                      resource.split("/")
                                                        .length - 1
                                                    ].split(".")[1],
                                                });
                                              }

                                              for (const resource of resources) {
                                                if (
                                                  // @ts-ignore
                                                  window.__codeup__temp__editor__resource_imports.indexOf(
                                                    page + "/" + resource.name
                                                  ) === -1
                                                ) {
                                                  // @ts-ignore
                                                  window.__codeup__temp__editor__resource_imports.push(
                                                    page + "/" + resource.name
                                                  );
                                                } else {
                                                  return;
                                                }
                                                reactSocket?.emit(
                                                  "editor:projects:page:content:set",
                                                  {
                                                    projectId:
                                                      projectData.project._id,
                                                    pageId: data.page._id,
                                                    resource: resource.name,
                                                    resourceType: resource.type,
                                                    content: resource.content,
                                                  }
                                                );
                                              }

                                              resolve(true);
                                            }
                                          }
                                        );
                                      });
                                    }
                                  }

                                  let functions = zip.files["functions/"].dir
                                    ? Object.keys(zip.files)
                                        .filter((file) =>
                                          file.startsWith("functions/")
                                        )
                                        .filter((file) => file !== "functions/")
                                    : [];

                                  functions = functions.map((f) => {
                                    return f.split("/")[1];
                                  });

                                  for (const func of functions) {
                                    let funcContent = "";

                                    if (zip.files[`functions/${func}`]) {
                                      funcContent = await zip.files[
                                        `functions/${func}`
                                      ].async("string");
                                    } else {
                                      corrupted.push(func);
                                    }

                                    reactSocket?.emit(
                                      "editor:projects:functions:create",
                                      {
                                        id: projectData.project._id as string,
                                        url: func
                                          .replace(/_/g, "/")
                                          .replace(/\/api/g, "")
                                          .replace(/\.js/g, ""),
                                      }
                                    );

                                    await new Promise((resolve) => {
                                      reactSocket?.on(
                                        "editor:projects:functions:create",
                                        (data: any) => {
                                          if (data.success) {
                                            reactSocket?.emit(
                                              "editor:projects:functions:content:set",
                                              {
                                                projectId:
                                                  projectData.project._id,
                                                pageId: data.function._id,
                                                code: funcContent,
                                              }
                                            );

                                            resolve(true);
                                          }
                                        }
                                      );
                                    });
                                  }

                                  reactSocket?.emit("editor:projects:list");
                                }
                              });
                            };
                          } else {
                            PopupManager.alert({
                              description: projectData.error as string,
                            });
                          }
                        }
                      );
                    }
                  }
                },
              },
            ]}
            entries={projects.map((project) => {
              return {
                title: project.name,
                fields: [
                  {
                    icon: <FaClock />,
                    text: new Date(project.updated_at).toLocaleString(),
                  },
                ],
                buttonRows: [
                  [
                    {
                      text: "Löschen",
                      onClick: async () => {
                        if (
                          await PopupManager.confirmAsync({
                            title: "Projekt löschen",
                            question:
                              "Willst du das Projekt wirklich unwiederuflich löschen? Dies kann nicht rückgängig gemacht werden.",
                          })
                        ) {
                          reactSocket?.on(
                            "editor:projects:delete",
                            (data: any) => {
                              if (data.success) {
                                setProjects(
                                  projects.filter((p) => p._id !== project._id)
                                );
                              } else {
                                PopupManager.alert({
                                  description: data.error as string,
                                });
                              }
                            }
                          );

                          reactSocket?.emit("editor:projects:delete", {
                            id: project._id,
                          });
                        }
                      },
                      colorScheme: "red",
                      leftIcon: <FaTrash />,
                    },
                    {
                      text: "Öffnen",
                      onClick: () => {
                        router.push(`/editor/${project._id}`);
                      },
                      variant: "brand",
                      leftIcon: <FaEye />,
                    },
                  ],
                  [
                    {
                      text: "Umbenennen",
                      onClick: async () => {
                        const newName = await PopupManager.promptAsync({
                          title: "Projekt umbenennen",
                          helperText:
                            "Der Name sollte das Projekt bestmöglich beschreiben, damit du es später wieder findest.",
                        });

                        if (newName) {
                          reactSocket?.on(
                            "editor:projects:rename",
                            (data: any) => {
                              if (data.success) {
                                reactSocket?.emit("editor:projects:list");
                              } else {
                                PopupManager.alert({
                                  description: data.error as string,
                                });
                              }
                            }
                          );

                          reactSocket?.emit("editor:projects:rename", {
                            id: project._id,
                            name: newName,
                          });
                        }
                      },
                      variant: "brand",
                      leftIcon: <FaPen />,
                    },
                    {
                      text: "Mitwirkende",
                      onClick: () => {
                        setEditProjectPropID(project._id);
                        onCollabOpen();
                      },
                      variant: "brand",
                      leftIcon: <FaUsers />,
                    },
                  ],
                ],
              };
            })}
          />
        </Box>
      ) : (
        <>
          <Flex
            w={"100%"}
            h={"100vh"}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"column"}
            bg={"#000"}
          >
            <CircularProgress size={"80px"} isIndeterminate color="green.300" />
            <Heading size={"lg"} mt={4}>
              Anmelden ...
            </Heading>
          </Flex>
        </>
      )}

      <CollaboratorManager
        isOpen={isCollabOpen}
        onClose={onCollabClose}
        onOpen={onCollabOpen}
        projectId={editProjectPropID || ""}
        socket={reactSocket as Socket}
      />
    </>
  );
}
