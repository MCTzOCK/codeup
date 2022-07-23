/**
 * apps/web/src/pages/ide/project/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.07.2022
 *
 */

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import redirect from "@codeup/util/src/userworkflow/redirect";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  useDisclosure,
  useToast,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Heading,
  Center,
  Link,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverHeader,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Kbd,
} from "@chakra-ui/react";
import {
  FaCloudUploadAlt,
  FaCogs,
  FaCss3,
  FaExternalLinkAlt,
  FaEye,
  FaFile,
  FaFolderPlus,
  FaHtml5,
  FaJsSquare,
  FaKeyboard,
  FaMarkdown,
  FaPlus,
  FaTrash,
  FaUserFriends,
} from "react-icons/fa";
import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import {
  FiEdit,
  FiEdit2,
  FiFilePlus,
  FiFolderPlus,
  FiTrash2,
} from "react-icons/fi";
import REST from "@codeup/rest";
import { BiRename } from "react-icons/bi";
import { editor } from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export default function Index() {
  const router = useRouter();
  const toast = useToast();
  const [firstLoad, setFirstLoad] = useState(true);

  const [editorOptions, setEditorOptions] = useState<{
    fontSize: number;
  }>({
    fontSize: 22,
  });

  const [currentFile, setCurrentFile] = useState<{
    path: string;
    content: string;
  } | null>(null);

  const {
    isOpen: isFileMenuOpen,
    onOpen: onFileMenuOpen,
    onClose: onFileMenuClose,
  } = useDisclosure();

  const [errorAlert, setErrorAlert] = useState<{
    show: boolean;
    error: string;
  }>({
    show: false,
    error: "",
  });

  const [project, setProject] = useState<{
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
  } | null>(null);

  useEffect(() => {
    redirect({
      forceAnonymous: false,
      allowAnonymous: false,
      redirectTo: router.pathname,
      redirectToLogin: true,
    });
  }, [router]);

  useEffect(() => {
    if (router.query.id) {
      REST.IDE.getProject({
        token: localStorage.getItem("token") as string,
        projectId: router.query.id as string,
      }).then((res) => {
        if (res.status === 200) {
          setProject(res.payload.project);
        } else {
          setErrorAlert({
            error: res.payload.error,
            show: true,
          });
        }
      });
    }
  }, [router]);

  const editorRef = useRef(null);
  const monaco = useMonaco();
  const [monacoTheme, setMonacoTheme] = useState("vs-dark");

  useEffect(() => {
    if (monaco && monaco.editor && project && project.files) {
      monaco.editor.defineTheme("codeup-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#171923",
        },
      });
      setMonacoTheme("codeup-dark");

      if (
        project.files.find((f) => f.path.toLowerCase() === "/readme.md") &&
        firstLoad
      ) {
        setFirstLoad(false);
        setCurrentFile({
          path: (
            project.files.find(
              (f) => f.path.toLowerCase() === "/readme.md"
            ) as any
          ).path,
          content: (
            project.files.find(
              (f) => f.path.toLowerCase() === "/readme.md"
            ) as any
          ).content,
        });
      }
    }
  }, [monaco, project]);

  useEffect(() => {
    return;

    window.addEventListener("keydown", listener, true);

    function listener(ev: KeyboardEvent) {
      if (ev.key === "s" && ev.ctrlKey) {
        ev.preventDefault();

        if (currentFile) {
          console.log(currentFile);

          REST.IDE.saveFile({
            token: localStorage.getItem("token") as string,
            projectId: project?._id as string,
            path: currentFile.path,
            // @ts-ignore
            content: editorRef?.current?.getValue(),
          }).then(async () => {
            const r = await REST.IDE.getProject({
              token: localStorage.getItem("token") as string,
              projectId: project?._id as string,
            });

            setProject(r.payload.project);

            toast({
              status: "success",
              variant: "solid",
              position: "top",
              title: "Erfolgreich",
              description: "Die Datei wurde erfolgreich gespeichert",
              isClosable: true,
              duration: 4000,
            });
          });
        }
      }
    }

    return () => window.removeEventListener("keydown", listener, true);
  }, []);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (project && project._id) {
      REST.IDE.getProjectPermissions({
        token: localStorage.getItem("token") as string,
        projectId: project._id,
      }).then((res) => {
        setPermissions(res.payload.permissions);
      });
    }
  }, [project]);

  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();

  return (
    <>
      {errorAlert.show ? (
        <Alert status="error" variant={"top-accent"}>
          <AlertIcon />
          <AlertTitle>Fehler!</AlertTitle>
          <AlertDescription>{errorAlert.error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <Flex
            direction={"row"}
            w={"100%"}
            minH={"100vh"}
            id={"editor-wrapper-flex"}
          >
            <Box
              flex={"5%"}
              minH={"90vh"}
              bgColor={"gray.900"}
              w={"100%"}
              margin={"2rem"}
              rounded={"xl"}
              shadow={"2xl"}
            >
              <Flex direction={"column"}>
                <Tooltip label={"Dateien"} placement={"right"} hasArrow>
                  <IconButton
                    aria-label={""}
                    variant="ghost"
                    size={"lg"}
                    p={"2rem"}
                    icon={<FaFile />}
                    rounded={"none"}
                    roundedTopLeft={"xl"}
                    roundedTopRight={"xl"}
                    onClick={onFileMenuOpen}
                  />
                </Tooltip>
                {permissions.includes("MANAGE-CONTRIBUTORS") ||
                permissions.includes("OWNER") ? (
                  <Tooltip label={"Mitwirkende"} placement={"right"} hasArrow>
                    <IconButton
                      aria-label={""}
                      variant="ghost"
                      size={"lg"}
                      p={"2rem"}
                      icon={<FaUserFriends />}
                      rounded={"none"}
                    />
                  </Tooltip>
                ) : null}
                <Tooltip label={"Veröffentlichen"} placement={"right"} hasArrow>
                  <IconButton
                    aria-label={""}
                    variant="ghost"
                    size={"lg"}
                    p={"2rem"}
                    icon={<FaCloudUploadAlt />}
                    rounded={"none"}
                  />
                </Tooltip>
                {currentFile && currentFile.path.endsWith(".html") ? (
                  <Tooltip label={"Vorschau"} placement={"right"} hasArrow>
                    <IconButton
                      aria-label={""}
                      variant="ghost"
                      size={"lg"}
                      p={"2rem"}
                      icon={<FaEye />}
                      rounded={"none"}
                      onClick={() => {
                        onPreviewOpen();
                      }}
                    />
                  </Tooltip>
                ) : null}
                <Tooltip label={"Tastenkürzel"} placement={"right"} hasArrow>
                  <IconButton
                    aria-label={""}
                    variant="ghost"
                    size={"lg"}
                    p={"2rem"}
                    icon={<FaKeyboard />}
                    rounded={"none"}
                  />
                </Tooltip>
                <Tooltip label={"Einstellungen"} placement={"right"} hasArrow>
                  <IconButton
                    aria-label={""}
                    variant="ghost"
                    size={"lg"}
                    p={"2rem"}
                    icon={<FaCogs />}
                    rounded={"none"}
                  />
                </Tooltip>
              </Flex>
            </Box>
            <Box
              flex={"95%"}
              minH={"90vh"}
              bgColor={"gray.900"}
              w={"100%"}
              maxW={"100%"}
              margin={"2rem"}
              rounded={"xl"}
              shadow={"2xl"}
            >
              <Flex
                direction={"column"}
                w={"100%"}
                h={"100%"}
                p={".6rem"}
                gap={".4rem"}
              >
                {currentFile ? (
                  <>
                    <Box flex={"5%"}>
                      <ButtonGroup>
                        <Menu>
                          <MenuButton as={Button} variant={"ghost"}>
                            Datei
                          </MenuButton>
                          <MenuList backgroundColor={"gray.900"}>
                            {permissions.includes("WRITE") ||
                            permissions.includes("OWNER") ? (
                              <>
                                <MenuItem
                                  onClick={async () => {
                                    const res = await REST.IDE.saveFile({
                                      token: localStorage.getItem(
                                        "token"
                                      ) as string,
                                      path: currentFile?.path as string,
                                      content:
                                        // @ts-ignore
                                        editorRef?.current?.getValue() as string,
                                      projectId: project?._id as string,
                                    });
                                    if (res.status === 200) {
                                      let f = project?.files;

                                      if (
                                        f &&
                                        f.find(
                                          (p) =>
                                            p.path ===
                                            (currentFile?.path as string)
                                        )
                                      ) {
                                        (
                                          f.find(
                                            (p) =>
                                              p.path ===
                                              (currentFile?.path as string)
                                          ) as {
                                            content: string;
                                            path: string;
                                          }
                                        ).content =
                                          // @ts-ignore
                                          editorRef?.current?.getValue();
                                      }

                                      if (project && f) {
                                        setProject({
                                          _id: project?._id,
                                          contributors: project?.contributors,
                                          owner: project?.owner,
                                          name: project?.name,
                                          files: f,
                                        });
                                      }

                                      toast({
                                        status: "success",
                                        variant: "solid",
                                        position: "top",
                                        title: "Erfolgreich",
                                        description:
                                          "Die Datei wurde erfolgreich gespeichert",
                                        isClosable: true,
                                        duration: 4000,
                                      });
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
                                  Speichern&nbsp;<Kbd>STRG</Kbd>+<Kbd>S</Kbd>
                                </MenuItem>
                              </>
                            ) : null}
                            <MenuItem
                              onClick={async () => {
                                const res = await REST.IDE.saveFile({
                                  token: localStorage.getItem(
                                    "token"
                                  ) as string,
                                  path: currentFile?.path as string,
                                  content:
                                    // @ts-ignore
                                    editorRef?.current?.getValue() as string,
                                  projectId: project?._id as string,
                                });

                                if (res.status === 200) {
                                  let f = project?.files;

                                  if (
                                    f &&
                                    f.find(
                                      (p) =>
                                        p.path === (currentFile?.path as string)
                                    )
                                  ) {
                                    (
                                      f.find(
                                        (p) =>
                                          p.path ===
                                          (currentFile?.path as string)
                                      ) as {
                                        content: string;
                                        path: string;
                                      }
                                    ).content =
                                      // @ts-ignore
                                      editorRef?.current?.getValue();
                                  }

                                  if (project && f) {
                                    setProject({
                                      _id: project?._id,
                                      contributors: project?.contributors,
                                      owner: project?.owner,
                                      name: project?.name,
                                      files: f,
                                    });
                                  }
                                }

                                setCurrentFile(null);
                              }}
                            >
                              Schließen
                            </MenuItem>
                          </MenuList>
                        </Menu>
                        {permissions.includes("WRITE") ||
                        permissions.includes("OWNER") ? (
                          <>
                            <Menu>
                              <MenuButton as={Button} variant={"ghost"}>
                                Bearbeiten
                              </MenuButton>
                              <MenuList backgroundColor={"gray.900"}>
                                <MenuItem>Rückgängig</MenuItem>
                                <MenuItem>Wiederholen</MenuItem>
                                <MenuItem>Ausschneiden</MenuItem>
                                <MenuItem>Kopieren</MenuItem>
                                <MenuItem>Einfügen</MenuItem>
                                <MenuItem>Löschen</MenuItem>
                                <MenuItem>Suchen</MenuItem>
                              </MenuList>
                            </Menu>
                          </>
                        ) : null}
                        <Menu>
                          <MenuButton as={Button} variant={"ghost"}>
                            Hilfe
                          </MenuButton>
                          <MenuList backgroundColor={"gray.900"}>
                            <MenuItem>Über</MenuItem>
                            <MenuItem>Support</MenuItem>
                          </MenuList>
                        </Menu>
                      </ButtonGroup>
                    </Box>
                    <Box flex={"95%"}>
                      <Editor
                        defaultLanguage={
                          currentFile?.path.toLowerCase().endsWith(".js")
                            ? "javascript"
                            : currentFile?.path.toLowerCase().endsWith(".html")
                            ? "html"
                            : currentFile?.path.toLowerCase().endsWith(".css")
                            ? "css"
                            : currentFile?.path.toLowerCase().endsWith(".md")
                            ? "markdown"
                            : "plain"
                        }
                        defaultValue={currentFile?.content}
                        onMount={handleEditorDidMount}
                        theme={monacoTheme}
                        options={{
                          fontSize: editorOptions.fontSize,
                          readOnly:
                            !permissions.includes("WRITE") &&
                            !permissions.includes("OWNER"),
                        }}
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <Center>
                      <Text
                        color="blue.500"
                        onClick={() => onFileMenuOpen()}
                        cursor="pointer"
                      >
                        Öffne eine Datei
                      </Text>
                      , damit du diese bearbeiten/lesen kannst.
                    </Center>
                  </>
                )}
              </Flex>
            </Box>
          </Flex>

          <Drawer
            isOpen={isFileMenuOpen}
            placement="left"
            onClose={onFileMenuClose}
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
                    <Box flex="10%">
                      {permissions.includes("WRITE") ||
                      permissions.includes("OWNER") ? (
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
                                        project?.files.find(
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
                                        projectId: project?._id as string,
                                      });

                                      if (res.status === 200) {
                                        let f = project?.files;
                                        f?.push({
                                          path,
                                          content: "",
                                        });
                                        if (project && f) {
                                          setProject({
                                            _id: project?._id,
                                            contributors: project?.contributors,
                                            owner: project?.owner,
                                            name: project?.name,
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
                    </Box>
                  </Flex>
                  <Flex direction="column" maxH="90vh" overflow="auto">
                    {project?.files
                      .sort((a, b) => {
                        let x = a.path.toLowerCase();
                        let y = b.path.toLowerCase();
                        return x < y ? -1 : x > y ? 1 : 0;
                      })
                      .map((f) => {
                        return (
                          <Flex direction="row" p=".4rem" alignItems="center">
                            <Box flex="5%" fontSize="xl">
                              {f.path.toLowerCase().endsWith(".js") ? (
                                <FaJsSquare />
                              ) : f.path.toLowerCase().endsWith(".html") ? (
                                <FaHtml5 />
                              ) : f.path.toLowerCase().endsWith(".css") ? (
                                <FaCss3 />
                              ) : f.path.toLowerCase().endsWith(".md") ? (
                                <FaMarkdown />
                              ) : (
                                <FaFile />
                              )}
                            </Box>
                            <Box flex="2%"></Box>
                            <Box flex="83%">{f.path.substring(1)}</Box>
                            <Box flex="10%">
                              <ButtonGroup>
                                {permissions.includes("WRITE") ||
                                permissions.includes("OWNER") ? (
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
                                        <PopoverHeader>
                                          Datei Löschen
                                        </PopoverHeader>
                                        <PopoverBody>
                                          <Stack>
                                            <Text>
                                              Bist du dir sicher, dass du die
                                              Datei&nbsp;
                                              <code>{f.path}</code>&nbsp;
                                              <b>UNWIEDERFLICH</b> löschen
                                              möchtest?
                                            </Text>
                                            <Button
                                              variant="solid"
                                              colorScheme="red"
                                              mt=".4rem"
                                              onClick={async () => {
                                                if (
                                                  currentFile?.path === f.path
                                                ) {
                                                  setCurrentFile(null);
                                                }

                                                const res =
                                                  await REST.IDE.deleteFile({
                                                    token: localStorage.getItem(
                                                      "token"
                                                    ) as string,
                                                    projectId: project?._id,
                                                    path: f.path,
                                                  });

                                                const rPro =
                                                  await REST.IDE.getProject({
                                                    token: localStorage.getItem(
                                                      "token"
                                                    ) as string,
                                                    projectId:
                                                      project._id as string,
                                                  });

                                                setProject(
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
                                                  projectId:
                                                    project._id as string,
                                                });

                                              const rSav =
                                                await REST.IDE.saveFile({
                                                  token: localStorage.getItem(
                                                    "token"
                                                  ) as string,
                                                  path,
                                                  content: f.content,
                                                  projectId:
                                                    project._id as string,
                                                });

                                              const rPro =
                                                await REST.IDE.getProject({
                                                  token: localStorage.getItem(
                                                    "token"
                                                  ) as string,
                                                  projectId:
                                                    project._id as string,
                                                });

                                              setProject(rPro.payload.project);
                                            }}
                                          >
                                            <Stack>
                                              <FormControl>
                                                <FormLabel>
                                                  Neuer Pfad
                                                </FormLabel>
                                                <Input
                                                  type={"text"}
                                                  defaultValue={f.path}
                                                  id={"renamenewpath"}
                                                  name={"renamenewpath"}
                                                  placeholder={"Pfad"}
                                                />
                                              </FormControl>
                                              <Button
                                                mt={".6rem"}
                                                type={"submit"}
                                              >
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
                                      setCurrentFile({
                                        path: f.path,
                                        content: f.content,
                                      });
                                      // @ts-ignore
                                      editorRef?.current?.setValue(f.content);
                                      // @ts-ignore
                                      editorRef?.current?.updateOptions({
                                        defaultLanguage: f.path
                                          .toLowerCase()
                                          .endsWith(".js")
                                          ? "javascript"
                                          : f.path
                                              .toLowerCase()
                                              .endsWith(".html")
                                          ? "html"
                                          : f.path
                                              .toLowerCase()
                                              .endsWith(".css")
                                          ? "css"
                                          : f.path.toLowerCase().endsWith(".md")
                                          ? "markdown"
                                          : "plain",
                                      });

                                      // @ts-ignore
                                      monaco.editor.setModelLanguage(
                                        // @ts-ignore
                                        editorRef?.current?.getModel(),
                                        f.path.toLowerCase().endsWith(".js")
                                          ? "javascript"
                                          : f.path
                                              .toLowerCase()
                                              .endsWith(".html")
                                          ? "html"
                                          : f.path
                                              .toLowerCase()
                                              .endsWith(".css")
                                          ? "css"
                                          : f.path.toLowerCase().endsWith(".md")
                                          ? "markdown"
                                          : "plain"
                                      );
                                      onFileMenuClose();
                                    }}
                                  />
                                </Tooltip>
                              </ButtonGroup>
                            </Box>
                          </Flex>
                        );
                      })}
                    {(project?.files?.length as number) < 1 ? (
                      <>
                        Dieses Projekt beinhaltet keine Dateien. Erstelle die
                        erste Datei über die Schaltfläche oben rechts.
                      </>
                    ) : null}
                  </Flex>
                </Flex>
              </DrawerBody>

              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onFileMenuClose}>
                  Schließen
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <PreviewModal
            project={project?._id}
            path={currentFile?.path}
            isOpen={isPreviewOpen}
            onOpen={onPreviewOpen}
            onClose={onPreviewClose}
          />
        </>
      )}
    </>
  );
}

function PreviewModal(props: {
  project: string | undefined;
  path: string | undefined;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <>
      {props.project && props.path ? (
        <Modal isOpen={props.isOpen} onClose={props.onClose} size={"full"}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <iframe
                width={"100%"}
                style={{ border: "none", height: "80vh" }}
                src={
                  "/api/ide/projects/" + props.project + "/preview" + props.path
                }
              ></iframe>
            </ModalBody>

            <ModalFooter>
              <Button
                rightIcon={<FaExternalLinkAlt />}
                variant="outline"
                mr={3}
                onClick={() => {
                  window.open(
                    "/api/ide/projects/" +
                      props.project +
                      "/preview" +
                      props.path,
                    "_blank"
                  );
                }}
              >
                Vollbild
              </Button>
              <Button variant="outline" mr={3} onClick={props.onClose}>
                Schließen
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : null}
    </>
  );
}
