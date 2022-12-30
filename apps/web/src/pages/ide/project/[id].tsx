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
  FaCodeBranch,
  FaCogs,
  FaEye,
  FaFile,
  FaFileCode,
  FaHome,
  FaKeyboard,
  FaUserFriends,
} from "react-icons/fa";
import Editor, { useMonaco } from "@monaco-editor/react";
import { FiEdit, FiFilePlus, FiTrash2 } from "react-icons/fi";
import REST from "@codeup/rest";
import { BiGitRepoForked, BiRename } from "react-icons/bi";
import {
  ContributorManager,
  KeyboardShortcuts,
  PreviewModal,
  SnippetViewer,
} from "@codeup/components/ide";
import { useKeyPress, useLoggedIn } from "@codeup/hooks";
import {
  SiCss3,
  SiHtml5,
  SiJavascript,
  SiMarkdown,
  SiSass,
  SiTypescript,
} from "react-icons/si";
import FileManager from "@codeup/components/ide/FileManager";
import PublishManager from "@codeup/components/ide/PublishManager";
import Head from "next/head";

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
    ic: {
      language: "codeup-incode",
      icon: <FaHome />,
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

  useEffect(() => {
    if (localStorage.getItem("monaco.props") !== null) {
      setEditorOptions(
        JSON.parse(localStorage.getItem("monaco.props") as string)
      );
    } else {
      localStorage.setItem("monaco.props", JSON.stringify(editorOptions));
    }
  }, []);

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

  const {
    isOpen: isPublishOpen,
    onOpen: onPublishOpen,
    onClose: onPublishClose,
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
    published: boolean;
    publishedCustomName: string;
  } | null>(null);

  const { userInfo, loggedIn, loaded } = useLoggedIn();

  useEffect(() => {
    if (!loggedIn && loaded) {
      router.push("/");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    }
  }, [router, userInfo, loggedIn, loaded]);

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
          "editor.background": "#141517",
        },
      });
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
      });

      monaco.languages.register({ id: "codeup-incode" });

      monaco.languages.setMonarchTokensProvider("codeup-incode", {
        ignoreCase: true,
        tokenizer: {
          root: [
            [/erstelle/, "command"],
            [/addiere/, "command"],
            [/subtrahiere/, "command"],
            [/multipliziere/, "command"],
            [/dividiere/, "command"],
            [/füge/, "command"],
            [/entferne/, "command"],
            [/gib/, "command"],
            [/frage/, "command"],
            [/funktion/, "command"],
            [/rufe/, "command"],
            [/setze/, "command"],
            [/wiederhole/, "command"],
            [/wenn/, "command"],
            [/sonst/, "command"],
            [/stopp/, "command"],
            [/funktion/, "command"],

            [/#([a-f0-9]{3}|[a-f0-9]{6})/, "value"],

            [/\/\/.*/, "comment"],
            [/#.*/, "comment"],
            [/!.*/, "comment"],

            [/".*"/, "data"],

            [/\d+/, "data"],

            [/in/, "secondary"],
            [/der/, "secondary"],
            [/die/, "secondary"],
            [/das/, "secondary"],
            [/den/, "secondary"],
            [/dem/, "secondary"],
            [/auf/, "secondary"],
            [/aus/, "secondary"],
            [/als/, "secondary"],
            [/mit/, "secondary"],
            [/zum/, "secondary"],
            [/zu/, "secondary"],
            [/von/, "secondary"],
            [/durch/, "secondary"],
            [/hinzu/, "secondary"],
            [/von/, "secondary"],
            [/vom/, "secondary"],
            [/speicher/, "secondary"],
            [/Antwort/, "secondary"],
            [/ist/, "secondary"],
            [/wird/, "secondary"],

            [/und/, "condition-joiner"],
            [/oder/, "condition-joiner"],

            [/gleich/, "operator"],
            [/ungleich/, "operator"],
            [/kleiner/, "operator"],
            [/kleiner-gleich/, "operator"],
            [/größer/, "operator"],
            [/größer-gleich/, "operator"],

            [/unterstrichen/, "value"],
            [/überstrichen/, "value"],
            [/durchgestrichen/, "value"],
            [/unterstrichen-überstrichen/, "value"],
            [/links/, "value"],
            [/zentriert/, "value"],
            [/rechts/, "value"],
            [/normal/, "value"],
            [/fett/, "value"],
            [/schwächer/, "value"],
            [/leichter/, "value"],
            [/absolut/, "value"],
            [/relativ/, "value"],
            [/fest/, "value"],
            [/keine/, "value"],
            [/durchgezogen/, "value"],
            [/gestrichen/, "value"],
            [/gepunktet/, "value"],
            [/doppelt/, "value"],
            [/unsichtbar/, "value"],
            [/sichtbar/, "value"],

            [/solange/, "type"],
            [/taste/, "type"],
            [/variable/, "type"],
            [/dialogbox/, "type"],
            [/bildschirm/, "type"],
            [/wert/, "type"],
            [/farbe/, "type"],
            [/hintergrundfarbe/, "type"],
            [/textdekoration/, "type"],
            [/textausrichtung/, "type"],
            [/text/, "type"],
            [/schriftbreite/, "type"],
            [/schriftart/, "type"],
            [/abstand-oben/, "type"],
            [/abstand-unten/, "type"],
            [/abstand-rechts/, "type"],
            [/abstand-links/, "type"],
            [/abstand/, "type"],
            [/innerer-abstand-oben/, "type"],
            [/innerer-abstand-unten/, "type"],
            [/innerer-abstand-rechts/, "type"],
            [/innerer-abstand-links/, "type"],
            [/innerer-abstand/, "type"],
            [/schriftgröße/, "type"],
            [/breite/, "type"],
            [/höhe/, "type"],
            [/quelle/, "type"],
            [/position/, "type"],
            [/umrandungsbreite-oben/, "type"],
            [/umrandungsbreite-unten/, "type"],
            [/umrandungsbreite-links/, "type"],
            [/umrandungsbreite-rechts/, "type"],
            [/umrandungsbreite/, "type"],
            [/umrandungsstil-oben/, "type"],
            [/umrandungsstil-unten/, "type"],
            [/umrandungsstil-links/, "type"],
            [/umrandungsstil-rechts/, "type"],
            [/umrandungsstil/, "type"],
            [/umrandungsradius/, "type"],
            [/umrandungsradius-oben-links/, "type"],
            [/umrandungsradius-oben-rechts/, "type"],
            [/umrandungsradius-unten-links/, "type"],
            [/umrandungsradius-unten-rechts/, "type"],
            [/umrandungsfarbe/, "type"],
            [/umrandungsfarbe-oben/, "type"],
            [/umrandungsfarbe-rechts/, "type"],
            [/umrandungsfarbe-links/, "type"],
            [/umrandungsfarbe-unten/, "type"],
            [/sichtbarkeit/, "type"],

            [/knopf/, "type"],
            [/textfeld/, "type"],
            [/absatz/, "type"],
            [/text/, "type"],
            [/bild/, "type"],
            [/überschrift/, "type"],
            [/überschrift2/, "type"],
            [/überschrift3/, "type"],
            [/überschrift4/, "type"],
            [/überschrift5/, "type"],
            [/überschrift6/, "type"],
            [/tabelle/, "type"],
            [/zeile/, "type"],
            [/spalte/, "type"],
            [/zeilenumbruch/, "type"],
            [/video/, "type"],
            [/audio/, "type"],
            [/fenster/, "type"],
            [/container/, "type"],
            [/listenpunkt/, "type"],
            [/liste/, "type"],
            [/ungeordnete-liste/, "type"],
            [/geordnete-liste/, "type"],
            [/link/, "type"],

            [/gedrückt/, "event"],
            [/berührt/, "event"],
            [/verlassen/, "event"],
          ],
        },
      });

      monaco.editor.defineTheme("codeup-dark-incode", {
        base: "vs-dark",
        inherit: true,
        rules: [
          {
            token: "command",
            foreground: "#ffa500",
            fontStyle: "bold",
          },
          {
            token: "comment",
            foreground: "#808080",
          },
          {
            token: "data",
            foreground: "#FF00FF",
          },
          {
            token: "secondary",
            foreground: "#545454",
          },
          {
            token: "type",
            foreground: "#38d920",
          },
          {
            token: "operator",
            foreground: "#d92020",
            fontStyle: "italic",
          },
          {
            token: "condition-joiner",
            foreground: "#2086d9",
          },
          {
            token: "value",
            foreground: "#d9b420",
          },
          {
            token: "event",
            foreground: "#20d992",
          },
        ],
        colors: {
          "editor.background": "#141517",
        },
      });

      setMonacoTheme("codeup-dark-incode");

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
      save();
    }
  }, [saveKeyPress, currentFile]);

  useEffect(() => {
    if (openKeyPress && !isFileMenuOpen) {
      onFileMenuOpen();
    }
  }, [openKeyPress]);

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

  const {
    isOpen: isCSOpen,
    onOpen: onCSOpen,
    onClose: onCSClose,
  } = useDisclosure();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const save = async () => {
    const res = await REST.IDE.saveFile({
      token: localStorage.getItem("token") as string,
      path: currentFile?.path as string,
      content:
        // @ts-ignore
        editorRef?.current?.getValue() as string,
      projectId: project?._id as string,
    });
    if (res.status === 200) {
      let f = project?.files;

      if (f && f.find((p) => p.path === (currentFile?.path as string))) {
        (
          f.find((p) => p.path === (currentFile?.path as string)) as {
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
          published: project?.published,
          publishedCustomName: project?.publishedCustomName,
        });
      }

      toast({
        status: "success",
        variant: "solid",
        position: "top",
        title: "Erfolgreich",
        description: "Die Datei wurde erfolgreich gespeichert",
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
  };

  return (
    <>
      <Head>
        <title>
          {currentFile
            ? currentFile.path.split("/")[
                currentFile.path.split("/").length - 1
              ]
            : "Neue Datei"}
          &nbsp;-&nbsp;Editor - CodeUp
        </title>
      </Head>
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
                {!permissions.includes("WRITE") &&
                !permissions.includes("OWNER") ? (
                  <Tooltip label={"Fork"} placement={"right"} hasArrow>
                    <IconButton
                      aria-label={""}
                      variant="ghost"
                      size={"lg"}
                      p={"2rem"}
                      icon={<BiGitRepoForked />}
                      rounded={"none"}
                      onClick={async () => {
                        const projectTemplateRequest =
                          await REST.IDE.getProject({
                            token: localStorage.getItem("token") as string,
                            projectId: project?._id as string,
                          });

                        if (projectTemplateRequest.status === 200) {
                          const newProjectRequest =
                            await REST.IDE.createProject({
                              token: localStorage.getItem("token") as string,
                              name:
                                "Fork von " +
                                projectTemplateRequest.payload.project.name,
                            });

                          if (newProjectRequest.status === 200) {
                            for (const file of projectTemplateRequest.payload
                              .project.files) {
                              await REST.IDE.saveFile({
                                token: localStorage.getItem("token") as string,
                                projectId:
                                  newProjectRequest.payload.project._id,
                                path: file.path,
                                content: file.content,
                              });

                              router.push(
                                "/ide/project/" +
                                  newProjectRequest.payload.project._id
                              );
                            }
                          } else {
                            toast({
                              status: "error",
                              variant: "solid",
                              position: "top",
                              title: "Fehler",
                              description: projectTemplateRequest.payload.error,
                              isClosable: true,
                              duration: 4000,
                            });
                          }
                        } else {
                          toast({
                            status: "error",
                            variant: "solid",
                            position: "top",
                            title: "Fehler",
                            description: projectTemplateRequest.payload.error,
                            isClosable: true,
                            duration: 4000,
                          });
                        }
                      }}
                    />
                  </Tooltip>
                ) : null}
                {permissions.includes("WRITE") ||
                permissions.includes("OWNER") ? (
                  <Tooltip label={"Code Snippets"} placement={"right"} hasArrow>
                    <IconButton
                      aria-label={""}
                      variant="ghost"
                      size={"lg"}
                      p={"2rem"}
                      icon={<FaFileCode />}
                      rounded={"none"}
                      onClick={async () => {
                        onCSOpen();
                      }}
                    />
                  </Tooltip>
                ) : null}
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
                {permissions.includes("PUBLISH") ||
                permissions.includes("OWNER") ? (
                  <Tooltip
                    label={"Veröffentlichen"}
                    placement={"right"}
                    hasArrow
                  >
                    <IconButton
                      aria-label={""}
                      variant="ghost"
                      size={"lg"}
                      p={"2rem"}
                      icon={<FaCloudUploadAlt />}
                      rounded={"none"}
                      onClick={() => {
                        onPublishOpen();
                      }}
                    />
                  </Tooltip>
                ) : null}
                {currentFile &&
                !settingsOpen &&
                (currentFile.path.toLowerCase().endsWith(".html") ||
                  currentFile.path.toLowerCase().endsWith(".ic")) ? (
                  <Tooltip label={"Vorschau"} placement={"right"} hasArrow>
                    <IconButton
                      aria-label={""}
                      variant="ghost"
                      size={"lg"}
                      p={"2rem"}
                      icon={<FaEye />}
                      rounded={"none"}
                      onClick={async () => {
                        await save();
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
                      if (currentFile) {
                        REST.IDE.saveFile({
                          token: localStorage.getItem("token") as string,
                          projectId: project?._id as string,
                          path: currentFile?.path,
                          // @ts-ignore
                          content: editorRef?.current?.getValue(),
                        }).then(async () => {
                          const r = await REST.IDE.getProject({
                            token: localStorage.getItem("token") as string,
                            projectId: project?._id as string,
                          });

                          setProject(r.payload.project);
                        });
                      }
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
                            onChange={(s, n) => {
                              let x = editorOptions;

                              x.fontSize = n;

                              setEditorOptions(x);

                              localStorage.setItem(
                                "monaco.props",
                                JSON.stringify(x)
                              );
                            }}
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
                            <Button
                              variant={"ghost"}
                              onClick={async () => {
                                save();
                              }}
                            >
                              Speichern
                            </Button>
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
                              insertSpaces: false,
                              wrappingIndent: "indent",
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
          <FileManager
            onFileMenuClose={onFileMenuClose}
            isFileMenuOpen={isFileMenuOpen}
            permissions={permissions}
            project={project}
            setProject={setProject}
            currentFile={currentFile}
            setCurrentFile={setCurrentFile}
            setSettingsOpen={setSettingsOpen}
            editorRef={editorRef}
            monaco={monaco}
          />
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
          <PublishManager
            projectId={project?._id}
            isOpen={isPublishOpen}
            onClose={onPublishClose}
            onOpen={onPublishOpen}
          />
          <SnippetViewer isOpen={isCSOpen} onClose={onCSClose} />
        </>
      )}
    </>
  );
}
