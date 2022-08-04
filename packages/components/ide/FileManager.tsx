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
import { useEffect, useState } from "react";
import REST from "@codeup/rest";
import pathsToStructure from "@codeup/util/src/pathsToStructure";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
  useToast,
  Stack,
  Select,
  Text,
  Link,
} from "@chakra-ui/react";
import {
  FiDownload,
  FiEdit,
  FiFilePlus,
  FiUpload,
  FiTrash2,
} from "react-icons/fi";
import {
  SiCss3,
  SiHtml5,
  SiJavascript,
  SiMarkdown,
  SiSass,
  SiTypescript,
} from "react-icons/si";
import { FaFile, FaFolder, FaHome } from "react-icons/fa";
import { BiRename } from "react-icons/bi";
import { lookup } from "mime-types";
import { useHover, useUserInfo } from "@codeup/hooks";

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

  const [structure, setStructure] = useState<any>([]);

  useEffect(() => {
    if (props.project) {
      let paths = [];
      let contents: { [path: string]: string } = {};
      for (const file of props.project.files) {
        paths.push(file.path);
        contents[file.path] = file.content;
      }

      const x = pathsToStructure(paths, contents);
      console.log(x);
      setStructure(x);
    }
  }, [props.project]);

  const userInfo = useUserInfo();

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

                                  let extension =
                                    // @ts-ignore
                                    e.target.elements.nf_extension
                                      .selectedOptions[0].value;

                                  if (!path.startsWith("/")) {
                                    path = "/" + path;
                                  }

                                  path = path.replace(/\/\//g, "/");

                                  path = path += extension;

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
                                <FormControl isRequired>
                                  <FormLabel>Pfad</FormLabel>
                                  <Input
                                    type="text"
                                    name="newfilepath"
                                    id="newfilepath"
                                    placeholder="Pfad"
                                  />
                                </FormControl>
                                <FormControl isRequired mt={".6rem"}>
                                  <FormLabel>Dateiendung</FormLabel>
                                  <Select name="nf_extension" id="nf_extension">
                                    <option disabled={true}>Struktur</option>
                                    <option value={".html"}>HTML</option>
                                    <option disabled={true}>Aussehen</option>
                                    <option value={".css"}>CSS</option>
                                    <option value={".scss"}>SCSS</option>
                                    <option value={".sass"}>Sass</option>
                                    <option disabled={true}>Logik</option>
                                    <option value={".js"}>JavaScript</option>
                                    <option value={".ts"}>TypeScript</option>
                                    <option disabled={true}>Anderes</option>
                                    <option value={".txt"}>Text</option>
                                    <option value={".json"}>JSON</option>
                                    <option value={".xml"}>XML</option>
                                  </Select>
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
                <Accordion
                  allowMultiple
                  allowToggle
                  borderColor={"gray.900"}
                  defaultIndex={[0]}
                >
                  <AccordionItem borderWidth={0}>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Flex direction="row" alignItems="center">
                            <Box flex="5%" fontSize="xl">
                              <FaHome />
                            </Box>
                            <Box flex="2%"></Box>
                            <Box flex="83%">
                              /home/@{userInfo.username}/{props.project?.name}
                            </Box>
                          </Flex>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>
                      {getFileComponentTree(
                        structure,
                        LANGUAGES,
                        props.permissions,
                        props.currentFile,
                        props.setCurrentFile,
                        props.project,
                        props.setProject,
                        props.onFileMenuClose,
                        props.editorRef,
                        props.monaco,
                        props.setSettingsOpen
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
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

function getFileComponentTree(
  structure: any,
  LANGUAGES: any,
  permissions: string[],
  currentFile: any,
  setCurrentFile: (cf: any) => void,
  project: any,
  setProject: (cf: any) => void,
  onFileMenuClose: () => void,
  editorRef: any,
  monaco: any,
  setSettingsOpen: (b: boolean) => void
) {
  if (structure && structure[0] && structure[0].children) {
    const r = [<></>];

    structure[0].children.map((x: any) => {
      if (x.children.length > 0) {
        r.push(
          <>
            <Accordion allowMultiple allowToggle>
              <AccordionItem borderWidth={"0"} borderColor={"gray.900"}>
                <h2>
                  <AccordionButton>
                    <Box flex={"1"} textAlign={"left"}>
                      <Flex direction="row" alignItems="center">
                        <Box flex="5%" fontSize="xl">
                          <FaFolder />
                        </Box>
                        <Box flex="2%"></Box>
                        <Box flex="83%">{x.name}</Box>
                      </Flex>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {x.children.map((y: any) => {
                    return getFileComponentTree(
                      y,
                      LANGUAGES,
                      permissions,
                      currentFile,
                      setCurrentFile,
                      project,
                      setProject,
                      onFileMenuClose,
                      editorRef,
                      monaco,
                      setSettingsOpen
                    );
                  })}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </>
        );
      } else {
        r.push(
          <FileEntry
            structure={x}
            LANGUAGES={LANGUAGES}
            permissions={permissions}
            currentFile={currentFile}
            setCurrentFile={setCurrentFile}
            project={project}
            setProject={setProject}
            onFileMenuClose={onFileMenuClose}
            editorRef={editorRef}
            monaco={monaco}
            setSettingsOpen={setSettingsOpen}
          />
        );
      }
    });

    return r;
  } else {
    if (structure.name && structure.children.length < 1) {
      return (
        <FileEntry
          structure={structure}
          LANGUAGES={LANGUAGES}
          permissions={permissions}
          currentFile={currentFile}
          setCurrentFile={setCurrentFile}
          project={project}
          setProject={setProject}
          onFileMenuClose={onFileMenuClose}
          editorRef={editorRef}
          monaco={monaco}
          setSettingsOpen={setSettingsOpen}
        />
      );
    } else {
      return (
        <>
          <Accordion allowMultiple allowToggle>
            <AccordionItem borderWidth={"0"} borderColor={"gray.900"}>
              <h2>
                <AccordionButton>
                  <Box flex={"1"} textAlign={"left"}>
                    <Flex direction="row" alignItems="center">
                      <Box flex="5%" fontSize="xl">
                        <FaFolder />
                      </Box>
                      <Box flex="2%"></Box>
                      <Box flex="83%">{structure.name}</Box>
                    </Flex>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {structure.children && structure.children.map
                  ? structure.children.map((y: any) => {
                      return getFileComponentTree(
                        y,
                        LANGUAGES,
                        permissions,
                        currentFile,
                        setCurrentFile,
                        project,
                        setProject,
                        onFileMenuClose,
                        editorRef,
                        monaco,
                        setSettingsOpen
                      );
                    })
                  : null}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </>
      );
    }
  }
}

function FileEntry(props: {
  structure: {
    name: string;
    children?: any[];
    fullPath: string;
    contents: string;
  };
  LANGUAGES: any;
  permissions: string[];
  currentFile: any;
  setCurrentFile: (cf: any) => void;
  project: any;
  setProject: (cf: any) => void;
  editorRef: any;
  monaco: any;
  onFileMenuClose: () => void;
  setSettingsOpen: (b: boolean) => void;
}) {
  const [hoverRef, isHovering] = useHover();

  return (
    <>
      <Flex
        direction="row"
        alignItems="center"
        // @ts-ignore
        ref={hoverRef}
      >
        <Box flex="5%" fontSize="xl">
          {props.LANGUAGES[props.structure.name.split(".").pop() as string]
            ? props.LANGUAGES[props.structure.name.split(".").pop() as string]
                .icon
            : props.LANGUAGES["_default"].icon}
        </Box>
        <Box flex="2%"></Box>
        <Box
          flex="83%"
          onClick={() => {
            props.setSettingsOpen(false);

            props.setCurrentFile({
              path: props.structure.fullPath,
              content: props.structure.contents,
            });
            // @ts-ignore
            props.editorRef?.current?.setValue(props.structure.contents);

            props.onFileMenuClose();

            // @ts-ignore
            props.monaco.editor.setModelLanguage(
              // @ts-ignore
              props.editorRef?.current?.getModel(),
              props.LANGUAGES[
                props.structure.fullPath.split(".").pop() as string
              ]
                ? props.LANGUAGES[
                    props.structure.fullPath.split(".").pop() as string
                  ].language
                : props.LANGUAGES["_default"].language
            );
          }}
        >
          <Stack>
            <Link w={"100%"}>{props.structure.name}</Link>
          </Stack>
        </Box>
        <Box flex="10%" visibility={isHovering ? "visible" : "hidden"}>
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
                          Bist du dir sicher, dass du die Datei&nbsp;
                          <code>{props.structure.fullPath}</code>&nbsp;
                          <b>UNWIEDERFLICH</b> löschen möchtest?
                        </Text>
                        <Button
                          variant="solid"
                          colorScheme="red"
                          mt=".4rem"
                          onClick={async () => {
                            if (
                              props.currentFile?.path ===
                              props.structure.fullPath
                            ) {
                              props.setCurrentFile(null);
                            }

                            const res = await REST.IDE.deleteFile({
                              token: localStorage.getItem("token") as string,
                              projectId: props.project?._id as string,
                              path: props.structure.fullPath,
                            });

                            const rPro = await REST.IDE.getProject({
                              token: localStorage.getItem("token") as string,
                              projectId: props.project?._id as string,
                            });

                            props.setProject(rPro.payload.project);
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
                    <PopoverHeader>Datei umbenennen</PopoverHeader>
                    <PopoverBody>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();

                          let path =
                            // @ts-ignore
                            e.target.elements.renamenewpath.value;

                          if (!path.startsWith("/")) {
                            path = `/${path}`;
                          }

                          const rDel = await REST.IDE.deleteFile({
                            token: localStorage.getItem("token") as string,
                            path: props.structure.fullPath,
                            projectId: props.project?._id as string,
                          });

                          const rSav = await REST.IDE.saveFile({
                            token: localStorage.getItem("token") as string,
                            path,
                            content:
                              props.structure.contents.length > 0
                                ? props.structure.contents
                                : "Pfad: " + props.structure.fullPath,
                            projectId: props.project?._id as string,
                          });

                          const rPro = await REST.IDE.getProject({
                            token: localStorage.getItem("token") as string,
                            projectId: props.project?._id as string,
                          });

                          props.setProject(rPro.payload.project);
                        }}
                      >
                        <Stack>
                          <FormControl>
                            <FormLabel>Neuer Pfad</FormLabel>
                            <Input
                              type={"text"}
                              defaultValue={props.structure.fullPath}
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
                      lookup(props.structure.fullPath) +
                      ";charset=utf-8," +
                      encodeURIComponent(props.structure.contents)
                  );
                  element.setAttribute(
                    "download",
                    props.structure.fullPath.split("/")[
                      props.structure.fullPath.split("/").length - 1
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
    </>
  );
}
