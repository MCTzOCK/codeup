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
  Center,
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
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  FaCloudUploadAlt,
  FaCogs,
  FaEye,
  FaFile,
  FaHome,
  FaKeyboard,
  FaUserFriends,
} from "react-icons/fa";
import Editor, { useMonaco } from "@monaco-editor/react";
import { FiEdit, FiFilePlus, FiTrash2 } from "react-icons/fi";
import REST from "@codeup/rest";
import { BiRename } from "react-icons/bi";
import {
  ContributorManager,
  KeyboardShortcuts,
  PreviewModal,
} from "@codeup/components/ide";
import { useKeyPress } from "@codeup/hooks";
import {
  SiCss3,
  SiHtml5,
  SiJavascript,
  SiMarkdown,
  SiSass,
  SiTypescript,
} from "react-icons/si";

export default function Index() {
  const router = useRouter();
  const toast = useToast();
  const [firstLoad, setFirstLoad] = useState(true);

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

  const {
    isOpen: isContributorOpen,
    onOpen: onContributorOpen,
    onClose: onContributorClose,
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
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
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

  const saveKeyPress = useKeyPress("s", true);
  const openKeyPress = useKeyPress("o", true);

  useEffect(() => {
    if (saveKeyPress && currentFile) {
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
  }, [saveKeyPress, currentFile]);

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

  const {
    isOpen: isKSOpen,
    onOpen: onKSOpen,
    onClose: onKSClose,
  } = useDisclosure();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

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
              <Flex direction={"column"} h={"100%"}>
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
                      onClick={() => {
                        onContributorOpen();
                      }}
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
                {currentFile &&
                currentFile.path.endsWith(".html") &&
                !settingsOpen ? (
                  <Tooltip label={"Vorschau"} placement={"right"} hasArrow>
                    <IconButton
                      aria-label={""}
                      variant="ghost"
                      size={"lg"}
                      p={"2rem"}
                      icon={<FaEye />}
                      rounded={"none"}
                      onClick={() => {
                        document.cookie =
                          (("jwt=" + localStorage.getItem("token")) as string) +
                          "; path=/";
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
                    onClick={() => {
                      onKSOpen();
                    }}
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
                    onClick={() => {
                      setSettingsOpen(!settingsOpen);
                    }}
                  />
                </Tooltip>
                <Tooltip label={"Hautpmenü"} placement={"right"} hasArrow>
                  <IconButton
                    aria-label={""}
                    variant="ghost"
                    size={"lg"}
                    p={"2rem"}
                    icon={<FaHome />}
                    rounded={"none"}
                    onClick={() => {
                      router.push("/ide?component=open");
                    }}
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
                {settingsOpen ? (
                  <>
                    <Heading size={"lg"} textAlign={"center"}>
                      Einstellungen
                    </Heading>
                    <Box maxH={"85vh"} h={"100%"} overflow={"auto"}>
                      <Flex direction={"column"}>
                        <Box padding={"2rem"} maxW={["100%", "25%"]}>
                          <Heading size={"md"}>Schriftgröße</Heading>
                          <NumberInput
                            defaultValue={editorOptions.fontSize}
                            mt={"1.2rem"}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Box>
                      </Flex>
                    </Box>
                  </>
                ) : null}
                {!settingsOpen ? (
                  <>
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
                                              contributors:
                                                project?.contributors,
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
                                      Speichern
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
                                    }

                                    setCurrentFile(null);
                                  }}
                                >
                                  Schließen
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </ButtonGroup>
                        </Box>
                        <Box flex={"95%"}>
                          <Editor
                            defaultLanguage={
                              LANGUAGES[
                                currentFile?.path.split(".").pop() as string
                              ]
                                ? LANGUAGES[
                                    currentFile?.path.split(".").pop() as string
                                  ].language
                                : LANGUAGES["_default"].language
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
                  </>
                ) : null}
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
                              {LANGUAGES[f.path.split(".").pop() as string]
                                ? LANGUAGES[f.path.split(".").pop() as string]
                                    .icon
                                : LANGUAGES["_default"].icon}
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
                                      setSettingsOpen(false);

                                      setCurrentFile({
                                        path: f.path,
                                        content: f.content,
                                      });
                                      // @ts-ignore
                                      editorRef?.current?.setValue(f.content);

                                      onFileMenuClose();

                                      // @ts-ignore
                                      monaco.editor.setModelLanguage(
                                        // @ts-ignore
                                        editorRef?.current?.getModel(),
                                        LANGUAGES[
                                          f.path.split(".").pop() as string
                                        ]
                                          ? LANGUAGES[
                                              f.path.split(".").pop() as string
                                            ].language
                                          : LANGUAGES["_default"].language
                                      );
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
          <ContributorManager
            isOpen={isContributorOpen}
            onOpen={onContributorOpen}
            onClose={onContributorClose}
            projectId={project?._id}
          />
          <KeyboardShortcuts
            isOpen={isKSOpen}
            onOpen={onKSOpen}
            onClose={onKSClose}
          />
        </>
      )}
    </>
  );
}
