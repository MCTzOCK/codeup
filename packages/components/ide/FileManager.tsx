/**
 * packages/components/ide/FileManager.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.08.2022
 *
 */

import * as React from "react";
import REST from "@codeup/rest";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Flex,
  ButtonGroup,
  Popover,
  PopoverTrigger,
  IconButton,
  Box,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Text,
  Tooltip,
  DrawerFooter,
} from "@chakra-ui/react";
import {
  FiFilePlus,
  FiTrash2,
  FiEdit,
  FiUpload,
  FiDownload,
} from "react-icons/fi";
import {
  SiMarkdown,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiTypescript,
  SiSass,
} from "react-icons/si";
import { FaFile } from "react-icons/fa";
import { BiRename } from "react-icons/bi";
import { lookup } from "mime-types";

export default function FileManager(props: {
  onFileMenuClose: () => void;
  isFileMenuOpen: boolean;
  permissions: string[];
  project: {
    _id: string;
    owner: string;
    name: string;
    contributors: {
      user: string;
      permissions: string[];
    }[];
    files: {
      path: string;
      content: string;
    }[];
  } | null;
  setProject: (project: any) => void;
  currentFile: {
    path: string;
    content: string;
  } | null;
  setCurrentFile: (newFile: any) => void;
  setSettingsOpen: (bool: boolean) => void;
  editorRef: any;
  monaco: any;
}) {
  const toast = useToast();

  const LANGUAGES: {
    [key: string]: {
      icon: any;
      language: string;
    };
  } = {
    md: {
      language: "markdown",
      icon: <SiMarkdown />,
    },
    js: {
      language: "javascript",
      icon: <SiJavascript />,
    },
    html: {
      language: "html",
      icon: <SiHtml5 />,
    },
    css: {
      language: "css",
      icon: <SiCss3 />,
    },
    ts: {
      language: "typescript",
      icon: <SiTypescript />,
    },
    scss: {
      language: "scss",
      icon: <SiSass />,
    },
    sass: {
      language: "sass",
      icon: <SiSass />,
    },
    _default: {
      language: "plain",
      icon: <FaFile />,
    },
  };

  return (
    <>
      <Drawer
        isOpen={props.isFileMenuOpen}
        placement="left"
        onClose={props.onFileMenuClose}
        size={["full", "lg"]}
      >
        <DrawerOverlay />
        <DrawerContent bgColor={"gray.900"}>
          <DrawerCloseButton />
          <DrawerHeader>Dateien</DrawerHeader>

          <DrawerBody>
            <Flex direction={"column"} w="100%">
              <Flex direction="row" w="100%">
                <Box flex="90%"></Box>
                <Flex flex="10%" direction={"row"}>
                  {props.permissions.includes("WRITE") ||
                  props.permissions.includes("OWNER") ? (
                    <>
                      <ButtonGroup>
                        <Popover>
                          <PopoverTrigger>
                            <IconButton
                              aria-label="Neue Datei"
                              size="lg"
                              fontSize={"2xl"}
                              icon={<FiFilePlus />}
                              variant="ghost"
                            />
                          </PopoverTrigger>
                          <PopoverContent bgColor="black">
                            <PopoverArrow bgColor="black" />
                            <PopoverCloseButton />
                            <PopoverHeader>Neue Datei</PopoverHeader>
                            <PopoverBody>
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  let path =
                                    // @ts-ignore
                                    e.target.elements.newfilepath.value.toLowerCase();

                                  if (!path.startsWith("/")) {
                                    path = "/" + path;
                                  }

                                  if (
                                    props.project?.files.find(
                                      (f) => f.path === path
                                    )
                                  ) {
                                    toast({
                                      status: "error",
                                      variant: "solid",
                                      position: "top",
                                      title: "Fehler",
                                      description:
                                        "Diese Datei existiert bereits.",
                                      isClosable: true,
                                      duration: 4000,
                                    });
                                    return;
                                  }

                                  const res = await REST.IDE.saveFile({
                                    token: localStorage.getItem(
                                      "token"
                                    ) as string,
                                    path: path,
                                    content: "Happy Coding!",
                                    projectId: props.project?._id as string,
                                  });

                                  if (res.status === 200) {
                                    let f = props.project?.files;
                                    f?.push({
                                      path,
                                      content: "",
                                    });
                                    if (props.project && f) {
                                      props.setProject({
                                        _id: props.project?._id,
                                        contributors:
                                          props.project?.contributors,
                                        owner: props.project?.owner,
                                        name: props.project?.name,
                                        files: f,
                                      });
                                    }
                                  } else {
                                    toast({
                                      status: "error",
                                      variant: "solid",
                                      position: "top",
                                      title: "Fehler",
                                      description: res.payload.error,
                                      isClosable: true,
                                      duration: 4000,
                                    });
                                  }
                                }}
                              >
                                <FormControl>
                                  <FormLabel>Pfad</FormLabel>
                                  <Input
                                    type="text"
                                    name="newfilepath"
                                    id="newfilepath"
                                    placeholder="Pfad"
                                  />
                                </FormControl>
                                <Button type="submit" mt=".6rem">
                                  Erstellen
                                </Button>
                              </form>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </ButtonGroup>
                    </>
                  ) : null}
                  <Tooltip label={"Datei hochladen"} hasArrow>
                    <IconButton
                      aria-label="Datei hochladen"
                      size="lg"
                      fontSize={"2xl"}
                      icon={<FiUpload />}
                      variant="ghost"
                      onClick={() => {
                        const f = document.createElement("input");
                        f.type = "file";
                        f.style.display = "none";

                        f.onchange = async () => {
                          if (f.files && f.files.length > 0) {
                            const file = f.files.item(0);
                            if (file) {
                              const content = await file.text();

                              await REST.IDE.saveFile({
                                token: localStorage.getItem("token") as string,
                                path: "/" + file.name,
                                content: content,
                                projectId: props.project?._id as string,
                              });

                              const x = await REST.IDE.getProject({
                                token: localStorage.getItem("token") as string,
                                projectId: props.project?._id as string,
                              });

                              props.setProject(x.payload.project);
                            }
                          }
                        };

                        document.body.appendChild(f);
                        f.click();
                        document.body.removeChild(f);
                      }}
                    />
                  </Tooltip>
                </Flex>
              </Flex>
              <Flex direction="column" maxH="90vh" overflow="auto">
                {props.project?.files
                  .sort((a, b) => {
                    let x = a.path.toLowerCase();
                    let y = b.path.toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                  })
                  .map((f) => {
                    return (
                      <Flex direction="row" p=".4rem" alignItems="center">
                        <Box flex="5%" fontSize="xl">
                          {LANGUAGES[f.path.split(".").pop() as string]
                            ? LANGUAGES[f.path.split(".").pop() as string].icon
                            : LANGUAGES["_default"].icon}
                        </Box>
                        <Box flex="2%"></Box>
                        <Box flex="83%">{f.path.substring(1)}</Box>
                        <Box flex="10%">
                          <ButtonGroup>
                            {props.permissions.includes("WRITE") ||
                            props.permissions.includes("OWNER") ? (
                              <>
                                <Popover>
                                  <PopoverTrigger>
                                    <IconButton
                                      aria-label="Löschen"
                                      size="lg"
                                      fontSize={"xl"}
                                      icon={<FiTrash2 />}
                                      variant="ghost"
                                    />
                                  </PopoverTrigger>
                                  <PopoverContent bgColor={"black"}>
                                    <PopoverArrow bgColor={"black"} />
                                    <PopoverCloseButton />
                                    <PopoverHeader>Datei Löschen</PopoverHeader>
                                    <PopoverBody>
                                      <Stack>
                                        <Text>
                                          Bist du dir sicher, dass du die
                                          Datei&nbsp;
                                          <code>{f.path}</code>&nbsp;
                                          <b>UNWIEDERFLICH</b> löschen möchtest?
                                        </Text>
                                        <Button
                                          variant="solid"
                                          colorScheme="red"
                                          mt=".4rem"
                                          onClick={async () => {
                                            if (
                                              props.currentFile?.path === f.path
                                            ) {
                                              props.setCurrentFile(null);
                                            }

                                            const res =
                                              await REST.IDE.deleteFile({
                                                token: localStorage.getItem(
                                                  "token"
                                                ) as string,
                                                projectId: props.project
                                                  ?._id as string,
                                                path: f.path,
                                              });

                                            const rPro =
                                              await REST.IDE.getProject({
                                                token: localStorage.getItem(
                                                  "token"
                                                ) as string,
                                                projectId: props.project
                                                  ?._id as string,
                                              });

                                            props.setProject(
                                              rPro.payload.project
                                            );
                                          }}
                                        >
                                          Löschen
                                        </Button>
                                      </Stack>
                                    </PopoverBody>
                                  </PopoverContent>
                                </Popover>
                                <Popover>
                                  <PopoverTrigger>
                                    <IconButton
                                      aria-label="Umbenennen"
                                      size="lg"
                                      fontSize={"xl"}
                                      icon={<BiRename />}
                                      variant="ghost"
                                      title={"Umbenennen/Verschieben"}
                                    />
                                  </PopoverTrigger>
                                  <PopoverContent bgColor={"black"}>
                                    <PopoverArrow bgColor={"black"} />
                                    <PopoverCloseButton />
                                    <PopoverHeader>
                                      Datei umbenennen
                                    </PopoverHeader>
                                    <PopoverBody>
                                      <form
                                        onSubmit={async (e) => {
                                          e.preventDefault();

                                          let path =
                                            // @ts-ignore
                                            e.target.elements.renamenewpath
                                              .value;

                                          if (!path.startsWith("/")) {
                                            path = `/${path}`;
                                          }

                                          const rDel =
                                            await REST.IDE.deleteFile({
                                              token: localStorage.getItem(
                                                "token"
                                              ) as string,
                                              path: f.path,
                                              projectId: props.project
                                                ?._id as string,
                                            });

                                          const rSav = await REST.IDE.saveFile({
                                            token: localStorage.getItem(
                                              "token"
                                            ) as string,
                                            path,
                                            content:
                                              f.content.length > 0
                                                ? f.content
                                                : "Pfad: " + f.path,
                                            projectId: props.project
                                              ?._id as string,
                                          });

                                          const rPro =
                                            await REST.IDE.getProject({
                                              token: localStorage.getItem(
                                                "token"
                                              ) as string,
                                              projectId: props.project
                                                ?._id as string,
                                            });

                                          props.setProject(
                                            rPro.payload.project
                                          );
                                        }}
                                      >
                                        <Stack>
                                          <FormControl>
                                            <FormLabel>Neuer Pfad</FormLabel>
                                            <Input
                                              type={"text"}
                                              defaultValue={f.path}
                                              id={"renamenewpath"}
                                              name={"renamenewpath"}
                                              placeholder={"Pfad"}
                                            />
                                          </FormControl>
                                          <Button mt={".6rem"} type={"submit"}>
                                            Umbenennen
                                          </Button>
                                        </Stack>
                                      </form>
                                    </PopoverBody>
                                  </PopoverContent>
                                </Popover>
                              </>
                            ) : null}

                            <Tooltip label="Bearbeiten" hasArrow>
                              <IconButton
                                aria-label="Bearbeiten"
                                size="lg"
                                fontSize={"xl"}
                                icon={<FiEdit />}
                                variant="ghost"
                                onClick={() => {
                                  props.setSettingsOpen(false);

                                  props.setCurrentFile({
                                    path: f.path,
                                    content: f.content,
                                  });
                                  // @ts-ignore
                                  props.editorRef?.current?.setValue(f.content);

                                  props.onFileMenuClose();

                                  // @ts-ignore
                                  props.monaco.editor.setModelLanguage(
                                    // @ts-ignore
                                    props.editorRef?.current?.getModel(),
                                    LANGUAGES[f.path.split(".").pop() as string]
                                      ? LANGUAGES[
                                          f.path.split(".").pop() as string
                                        ].language
                                      : LANGUAGES["_default"].language
                                  );
                                }}
                              />
                            </Tooltip>
                            <Tooltip label={"Herunterladen"} hasArrow>
                              <IconButton
                                aria-label="Datei herunterladen"
                                size="lg"
                                fontSize={"2xl"}
                                icon={<FiDownload />}
                                variant="ghost"
                                onClick={() => {
                                  const element = document.createElement("a");
                                  element.setAttribute(
                                    "href",
                                    "data:" +
                                      lookup(f.path) +
                                      ";charset=utf-8," +
                                      encodeURIComponent(f.content)
                                  );
                                  element.setAttribute(
                                    "download",
                                    f.path.split("/")[
                                      f.path.split("/").length - 1
                                    ]
                                  );

                                  element.style.display = "none";
                                  document.body.appendChild(element);

                                  element.click();

                                  document.body.removeChild(element);
                                }}
                              />
                            </Tooltip>
                          </ButtonGroup>
                        </Box>
                      </Flex>
                    );
                  })}
                {(props.project?.files?.length as number) < 1 ? (
                  <>
                    Dieses Projekt beinhaltet keine Dateien. Erstelle die erste
                    Datei über die Schaltfläche oben rechts.
                  </>
                ) : null}
              </Flex>
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={props.onFileMenuClose}>
              Schließen
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
