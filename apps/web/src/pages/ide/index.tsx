/**
 * apps/web/src/pages/ide/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.07.2022
 *
 */

/*
 * Dear future me,
 * forgive me. Forgive me for not separating this into
 * more than one component. I am very sorry for this big mess.
 * At this time (08.07.2022;00:03) this file has about 1100 lines.
 * I AM SORRYYY :(
 */
import * as React from "react";
import { useEffect, useId, useState } from "react";
import redirect from "@codeup/util/src/userworkflow/redirect";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  ProgressLabel,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  FaCloudUploadAlt,
  FaFileExport,
  FaFileImport,
  FaPlus,
  FaRegFolderOpen,
  FaSearch,
  FaTrash,
  FaUsersCog,
} from "react-icons/fa";
import { BiDuplicate, BiRename } from "react-icons/bi";
import { default as NextLink } from "next/link";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import { useUserInfo } from "@codeup/hooks";
import { FiMoreHorizontal } from "react-icons/fi";
import REST from "@codeup/rest";
import { ContributorManager } from "@codeup/components/ide";
import Networking from "@codeup/util/src/Networking";

import { HiTemplate } from "react-icons/hi";
import TemplatePicker from "@codeup/components/ide/TemplatePicker";
import TemplatePublisher from "@codeup/components/ide/TemplatePublisher";
import { router } from "next/client";

export default function Index() {
  useEffect(() => {
    redirect({
      forceAnonymous: false,
      allowAnonymous: false,
      redirectToLogin: true,
      redirectTo: "/ide",
    });
  });

  const [currentComponent, setCurrentComponent] =
    React.useState<JSX.Element | null>(
      <>
        <Spinner size="xl" />
      </>
    );

  const [currentSelected, setCurrentSelected] =
    React.useState<string>("create");
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.has("component")) {
      switch (query.get("component")) {
        case "create":
          setCurrentComponent(<Create />);
          setCurrentSelected("create");
          break;
        default:
          setCurrentComponent(<Open />);
          setCurrentSelected("open");
          break;
      }
    } else {
      router.push("/ide?component=create");
    }
  }, [router]);

  return (
    <>
      <Flex direction={["column", "row"]} minW={"100%"} minH={"100vh"}>
        <Flex
          direction={"column"}
          flex={"15%"}
          minH={"100%"}
          bgColor={useColorModeValue("gray.400", "gray.900")}
          p={"1.2rem"}
        >
          <Heading textAlign={"center"}>Projekte</Heading>
          <Button
            m={"1.2rem"}
            variant={currentSelected === "create" ? "solid" : "ghost"}
            leftIcon={<FaPlus />}
            onClick={() => {
              router.push("/ide?component=create");
            }}
          >
            Neu
          </Button>
          <Button
            marginInline={"1.2rem"}
            variant={currentSelected === "open" ? "solid" : "ghost"}
            leftIcon={<FaRegFolderOpen />}
            onClick={() => {
              setCurrentSelected("account");
              router.push("/ide?component=open");
            }}
          >
            Meine Projekte
          </Button>
        </Flex>
        <Flex direction={"column"} flex={"85%"} minH={"100%"}>
          {currentComponent}
        </Flex>
      </Flex>
    </>
  );
}

function Create() {
  const toast = useToast();
  const nameId = useId();

  const [loading, setLoading] = useState<boolean>(false);

  const [section, setSection] = useState("menu");

  function Card(props: {
    icon: any;
    title: string;
    section?: string;
    onClick?: () => void;
  }) {
    return (
      <>
        <Box
          flex={"33%"}
          backgroundColor={"gray.800"}
          shadow={"xl"}
          rounded={"xl"}
          h={"100%"}
          cursor={"pointer"}
          onClick={() => {
            if (props.section) {
              setSection(props.section);
            }
            if (props.onClick) {
              props.onClick();
            }
          }}
        >
          <Flex direction={"row"} h={"100%"} w={"100%"}>
            <Flex
              flex={"30%"}
              fontSize={"6xl"}
              alignItems={"center"}
              justifyContent={"center"}
              h={"100%"}
              w={"100%"}
            >
              {props.icon}
            </Flex>
            <Flex
              flex={"70%"}
              pl={".2rem"}
              justifyContent={"center"}
              h={"100%"}
              w={"100%"}
              direction={"column"}
            >
              <Heading size={"lg"}>{props.title}</Heading>
            </Flex>
          </Flex>
        </Box>
      </>
    );
  }

  const importFileInputId = useId();

  const [importProgress, setImportProgress] = useState(0);
  const {
    isOpen: isImportOpen,
    onOpen: onImportOpen,
    onClose: onImportClose,
  } = useDisclosure();

  const [importProgressMax, setImportProgressMax] = useState(0);
  const [importProgressCurrent, setImportProgressCurrent] = useState("");

  const [importFinished, setImportFinished] = useState(false);

  const [importedProjectId, setImportedProjectId] = useState("");

  const router = useRouter();

  return (
    <>
      <Flex alignItems={"center"} justifyContent={"center"} mt={"1.2rem"}>
        <Box
          w={["100%", "85%"]}
          minW={["100%", "85%"]}
          backgroundColor={"gray.900"}
          p={"1.2rem"}
          rounded={"xl"}
        >
          <Heading textAlign={"center"} size={"xl"}>
            Projekt Erstellen
          </Heading>
          <Divider mt={"1.2rem"} />
          {section === "menu" ? (
            <>
              <Box mt={"1.2rem"}>
                <Flex
                  direction={["column", "row"]}
                  gap={["1.2rem", "2rem"]}
                  h={["30vh", "15vh"]}
                >
                  <Card
                    icon={<FaPlus />}
                    title={"Leeres Projekt"}
                    section={"empty"}
                  />
                  <Card
                    icon={<FaFileImport />}
                    title={"Importieren"}
                    onClick={async () => {
                      const element = document.getElementById(
                        importFileInputId
                      ) as HTMLInputElement;

                      element.click();

                      element.onchange = async (e) => {
                        const target = e.target as HTMLInputElement;

                        if (target && target.files) {
                          if (target.files.length > 0) {
                            const file = target.files.item(0);

                            if (file) {
                              try {
                                const data = JSON.parse(await file.text());
                                if (
                                  !(
                                    data.codeUp &&
                                    data.codeUp.version &&
                                    data.codeUp.version === "1.0"
                                  )
                                ) {
                                  toast({
                                    status: "error",
                                    position: "top",
                                    variant: "solid",
                                    isClosable: true,
                                    duration: 3000,
                                    title: "Fehler",
                                    description:
                                      "Die Datei-Version (codeUp.version) ist nicht 1.0. Die Datei kann nicht gelesen werden.",
                                  });
                                  return;
                                }

                                if (!(data.files && data.name)) {
                                  toast({
                                    status: "error",
                                    position: "top",
                                    variant: "solid",
                                    isClosable: true,
                                    duration: 3000,
                                    title: "Fehler",
                                    description:
                                      "Die Datei beinhaltet keine Projekt Daten.",
                                  });
                                  return;
                                }

                                onImportOpen();

                                const cRes = await REST.IDE.createProject({
                                  token: localStorage.getItem(
                                    "token"
                                  ) as string,
                                  name:
                                    data.name +
                                    " - Imported " +
                                    new Date().toLocaleTimeString(),
                                });

                                await REST.IDE.deleteFile({
                                  token: localStorage.getItem(
                                    "token"
                                  ) as string,
                                  projectId: cRes.payload.project._id,
                                  path: "/README.MD",
                                });

                                setImportProgressMax(data.files.length);
                                setImportProgress(0);

                                for (const [
                                  index,
                                  file,
                                ] of data.files.entries()) {
                                  setImportProgressCurrent(file.path);

                                  await REST.IDE.saveFile({
                                    token: localStorage.getItem(
                                      "token"
                                    ) as string,
                                    projectId: cRes.payload.project._id,
                                    path: file.path,
                                    content: file.content,
                                  });

                                  setImportProgress(index + 1);
                                }

                                setImportProgress(0);
                                setImportProgressCurrent("");
                                setImportProgressMax(1);
                                setImportedProjectId(cRes.payload.project._id);

                                setImportFinished(true);
                              } catch (e: any) {
                                toast({
                                  status: "error",
                                  position: "top",
                                  variant: "solid",
                                  isClosable: true,
                                  duration: 3000,
                                  title: "Fehler",
                                  description:
                                    "Die Datei konnte nicht gelesen werden: " +
                                    e.message,
                                });
                              }
                            }
                          }
                        }
                      };
                    }}
                  />
                  <Card
                    icon={<HiTemplate />}
                    title={"Vorlage"}
                    section={"templates"}
                  />
                </Flex>
              </Box>
            </>
          ) : null}
          {section === "empty" ? (
            <>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  setLoading(true);

                  const res = await REST.IDE.createProject({
                    token: localStorage.getItem("token") as string,
                    // @ts-ignore
                    name: e.target.elements[nameId].value,
                  });

                  if (res.status === 200) {
                    toast({
                      title: "Erfolgreich",
                      description: "Das Projekt wurde erstellt",
                      status: "success",
                      variant: "solid",
                      position: "top",
                      isClosable: true,
                    });
                    setLoading(false);
                    router.push("/ide?component=open");
                  } else {
                    setLoading(false);
                    toast({
                      title: "Fehler",
                      description: res.payload.error,
                      status: "error",
                      variant: "solid",
                      position: "top",
                      isClosable: true,
                    });
                  }
                }}
              >
                <FormControl>
                  <FormLabel>Projekt Name</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>
                      <BiRename />
                    </InputLeftAddon>
                    <Input
                      disabled={loading}
                      type={"text"}
                      id={nameId}
                      placeholder={"Projekt Name"}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mt={"2rem"}>
                  <Button isLoading={loading} type={"submit"}>
                    Erstellen
                  </Button>
                </FormControl>
              </form>
            </>
          ) : null}
          {section === "templates" ? (
            <>
              <TemplatePicker />
            </>
          ) : null}
        </Box>
      </Flex>
      <input
        type={"file"}
        id={importFileInputId}
        style={{ visibility: "hidden" }}
        accept={".cupp,.codeup"}
      />

      <Modal isOpen={isImportOpen} onClose={onImportClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {importFinished ? "Import abgeschlossen" : "Importieren"}
          </ModalHeader>
          <ModalBody>
            {importFinished ? (
              <>
                <Text color={"gray.400"}>
                  Der Import wurde abgeschlossen! Du kannst das Projekt nun
                  bearbeiten.
                </Text>
                <Stack direction={"column"} mt={"2rem"} gap={".4rem"}>
                  <Button
                    variant={"solid"}
                    colorScheme={"blue"}
                    onClick={() => {
                      router.push(
                        "/ide/project/" +
                          importedProjectId +
                          "#editor-wrapper-flex"
                      );
                    }}
                  >
                    Bearbeiten
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setImportedProjectId("0");
                      onImportClose();
                    }}
                  >
                    Später
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <Progress
                  size={"lg"}
                  max={importProgressMax}
                  value={importProgress}
                  w={"100%"}
                  rounded={"xl"}
                  hasStripe
                />
                <Text color={"gray.500"}>
                  Importiere Datei <code>{importProgressCurrent}</code>
                </Text>
              </>
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function Open() {
  const [projectList, setProjectList] = useState<
    { name: string; id: string; permissions: string[]; hasTemplate: boolean }[]
  >([]);
  const [filteredProjectList, setFilteredProjectList] = useState<
    { name: string; id: string; permissions: string[]; hasTemplate: boolean }[]
  >([]);
  const [query, setQuery] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    REST.IDE.getProjects({
      token: localStorage.getItem("token") as string,
      type: "ALL",
    }).then(async (res) => {
      if (res.status === 200) {
        let pList = [];

        for (const project of res.payload.projects) {
          const r = await REST.IDE.getProjectPermissions({
            token: localStorage.getItem("token") as string,
            projectId: project._id,
          });

          const hasTemplate = await REST.IDE.hasTemplate({
            token: localStorage.getItem("token") as string,
            projectId: project._id,
          });

          pList.push({
            id: project._id,
            name: project.name,
            permissions: r.payload.permissions,
            hasTemplate: hasTemplate.payload.hasTemplate,
          });
        }

        setProjectList(pList);
        setFilteredProjectList(pList);
        setLoading(false);
      } else {
        toast({
          title: "Fehler",
          description: res.payload.error,
          status: "error",
          variant: "solid",
          position: "top",
          isClosable: true,
        });
      }
    });
  }, []);

  useEffect(() => {
    setFilteredProjectList(projectList.filter((p) => p.name.includes(query)));
  }, [query]);

  const {
    isOpen: isContributorOpen,
    onOpen: onContributorOpen,
    onClose: onContributorClose,
  } = useDisclosure();

  const [contributors, setContributors] = useState<{
    owner: {
      email: string;
      id: string;
      permissions: string[];
      username: string;
      firstName: string;
      lastName: string;
    };
    contributors: {
      email: string;
      id: string;
      permissions: string[];
      username: string;
      firstName: string;
      lastName: string;
    }[];
  } | null>(null);

  const sBoxId = useId();

  const [projectId, setProjectId] = useState("0");

  const userInfo = useUserInfo();

  const {
    isOpen: isPublisherOpen,
    onOpen: onPublisherOpen,
    onClose: onPublisherClose,
  } = useDisclosure();

  const [publisherTemplateId, setPublisherTemplateId] = useState("0");

  return (
    <>
      <Flex alignItems={"center"} justifyContent={"center"} mt={"1.2rem"}>
        <Box
          w={["100%", "65%"]}
          minW={["100%", "65%"]}
          backgroundColor={"gray.900"}
          p={"1.2rem"}
          rounded={"xl"}
        >
          <Heading textAlign={"center"} size={"xl"}>
            Projekt Öffnen
          </Heading>
          {loading ? (
            <>
              <Flex justifyContent={"center"} mt={"1.2rem"}>
                <Spinner size={"xl"} />
              </Flex>
            </>
          ) : null}
          {!loading && projectList.length === 0 ? (
            <>
              <Flex justifyContent={"center"} mt={"1.2rem"}>
                <Box>
                  Du hast noch keine Projekte erstellt.&nbsp;
                  <Link color="blue.400" href={"?component=create"}>
                    <NextLink href={"?component=create"}>
                      Erstelle dein erstes Projekt
                    </NextLink>
                  </Link>
                  .
                </Box>
              </Flex>
            </>
          ) : null}
          {projectList.length > 0 ? (
            <>
              <FormControl mt={"2rem"}>
                <InputGroup>
                  <InputLeftAddon>
                    <FaSearch />
                  </InputLeftAddon>
                  <Input
                    type={"text"}
                    placeholder={"Suche..."}
                    id={sBoxId}
                    defaultValue={query}
                    onChange={(e) => {
                      // @ts-ignore
                      setQuery(e.target.value);
                    }}
                  />
                </InputGroup>
              </FormControl>
              {filteredProjectList.length > 0 ? (
                <>
                  <Flex direction={"column"} mt={"2rem"}>
                    <Box pt={"0.75rem"} pb={"0.75rem"} fontSize={"2xl"}>
                      <Flex direction={"row"}>
                        <Box
                          flex={"20%"}
                          textAlign={"center"}
                          fontWeight={"bold"}
                        >
                          Name
                        </Box>
                        <Box flex={[0, "60%"]}></Box>
                        <Box
                          flex={"20%"}
                          textAlign={"center"}
                          fontWeight={"bold"}
                        >
                          Aktion
                        </Box>
                      </Flex>
                    </Box>
                    {filteredProjectList.map((project) => {
                      return (
                        <>
                          <Box pt={"0.75rem"} pb={"0.75rem"} fontSize={"2xl"}>
                            <Flex direction={"row"}>
                              <Box flex={"20%"} textAlign={"center"}>
                                <Link
                                  href={
                                    "/ide/project/" +
                                    project.id +
                                    "#editor-wrapper-flex"
                                  }
                                >
                                  <NextLink
                                    href={
                                      "/ide/project/" +
                                      project.id +
                                      "#editor-wrapper-flex"
                                    }
                                  >
                                    {project.name}
                                  </NextLink>
                                </Link>
                              </Box>
                              <Box flex={[0, "60%"]}></Box>
                              <Box
                                flex={"20%"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                textAlign={"center"}
                              >
                                <Menu>
                                  <MenuButton>
                                    <IconButton aria-label={"menu"}>
                                      <FiMoreHorizontal />
                                    </IconButton>
                                  </MenuButton>
                                  <MenuList fontSize={"xl"}>
                                    {project.permissions.includes("OWNER") ||
                                    project.permissions.includes("DELETE") ? (
                                      <MenuItem
                                        onClick={async () => {
                                          const res =
                                            await REST.IDE.deleteProject({
                                              token: localStorage.getItem(
                                                "token"
                                              ) as string,
                                              projectId: project.id,
                                            });

                                          if (res.status === 200) {
                                            let npl = projectList.filter(
                                              (p) => p.id !== project.id
                                            );
                                            setProjectList(npl);
                                            setFilteredProjectList(npl);
                                            setQuery("");
                                            (
                                              document.getElementById(
                                                sBoxId
                                              ) as HTMLInputElement
                                            ).value = "";
                                            toast({
                                              title: "Erfolg",
                                              description:
                                                "Das Projekt wurde erfolgreich gelöscht",
                                              status: "success",
                                              variant: "solid",
                                              position: "top",
                                              isClosable: true,
                                            });
                                          } else {
                                            toast({
                                              title: "Fehler",
                                              description: res.payload.error,
                                              status: "error",
                                              variant: "solid",
                                              position: "top",
                                              isClosable: true,
                                            });
                                          }
                                        }}
                                      >
                                        <Flex
                                          direction={"row"}
                                          alignItems={"center"}
                                          gap={".6rem"}
                                          color={"red.400"}
                                        >
                                          <BsFillTrashFill /> Löschen
                                        </Flex>
                                      </MenuItem>
                                    ) : null}
                                    {project.permissions.includes("OWNER") ||
                                    project.permissions.includes("RENAME") ? (
                                      <MenuItem
                                        onClick={async (e) => {
                                          const newName = prompt(
                                            "Gib den neuen Namen ein"
                                          );

                                          if (!newName) {
                                            return;
                                          }

                                          const res =
                                            await REST.IDE.renameProject({
                                              token: localStorage.getItem(
                                                "token"
                                              ) as string,
                                              projectId: project.id,
                                              newName,
                                            });

                                          if (res.status === 200) {
                                            let npl = projectList.map((p) => {
                                              if (p.id === project.id) {
                                                return {
                                                  id: p.id,
                                                  name: newName,
                                                  permissions: p.permissions,
                                                  hasTemplate: p.hasTemplate,
                                                };
                                              } else {
                                                return p;
                                              }
                                            });
                                            setProjectList(npl);
                                            setFilteredProjectList(npl);
                                            setQuery("");
                                            (
                                              document.getElementById(
                                                sBoxId
                                              ) as HTMLInputElement
                                            ).value = "";
                                            toast({
                                              title: "Erfolg",
                                              description:
                                                "Das Projekt wurde erfolgreich umbenannt",
                                              status: "success",
                                              variant: "solid",
                                              position: "top",
                                              isClosable: true,
                                            });
                                          } else {
                                            toast({
                                              title: "Fehler",
                                              description: res.payload.error,
                                              status: "error",
                                              variant: "solid",
                                              position: "top",
                                              isClosable: true,
                                            });
                                          }
                                        }}
                                      >
                                        <Flex
                                          direction={"row"}
                                          alignItems={"center"}
                                          gap={".6rem"}
                                          color={"green.400"}
                                        >
                                          <BsFillPencilFill /> Umbenennen
                                        </Flex>
                                      </MenuItem>
                                    ) : null}
                                    {project.permissions.includes("OWNER") ||
                                    project.permissions.includes(
                                      "DUPLICATE"
                                    ) ? (
                                      <MenuItem
                                        onClick={async () => {
                                          const newName = prompt(
                                            "Gib den neuen Namen ein"
                                          );

                                          if (!newName) {
                                            return;
                                          }

                                          const res =
                                            await REST.IDE.duplicateProject({
                                              token: localStorage.getItem(
                                                "token"
                                              ) as string,
                                              projectId: project.id,
                                              name: newName,
                                            });

                                          if (res.status === 200) {
                                            setProjectList([
                                              ...projectList,
                                              {
                                                id: res.payload.project,
                                                name: newName,
                                                permissions: ["OWNER"],
                                                hasTemplate: false,
                                              },
                                            ]);

                                            setFilteredProjectList([
                                              ...projectList,
                                              {
                                                id: res.payload.project,
                                                name: newName,
                                                permissions: ["OWNER"],
                                                hasTemplate: false,
                                              },
                                            ]);
                                            setQuery("");
                                            (
                                              document.getElementById(
                                                sBoxId
                                              ) as HTMLInputElement
                                            ).value = "";
                                            toast({
                                              title: "Erfolg",
                                              description:
                                                "Das Projekt wurde erfolgreich dupliziert",
                                              status: "success",
                                              variant: "solid",
                                              position: "top",
                                              isClosable: true,
                                            });
                                          } else {
                                            toast({
                                              title: "Fehler",
                                              description: res.payload.error,
                                              status: "error",
                                              variant: "solid",
                                              position: "top",
                                              isClosable: true,
                                            });
                                          }
                                        }}
                                      >
                                        <Flex
                                          direction={"row"}
                                          alignItems={"center"}
                                          gap={".6rem"}
                                          color={"blue.400"}
                                          onClick={async () => {
                                            const newName = prompt(
                                              "Gib den neuen Namen ein"
                                            );

                                            if (!newName) {
                                              return;
                                            }

                                            const res =
                                              await REST.IDE.duplicateProject({
                                                token: localStorage.getItem(
                                                  "token"
                                                ) as string,
                                                projectId: project.id,
                                                name: newName,
                                              });

                                            if (res.status === 200) {
                                              setProjectList([
                                                ...projectList,
                                                {
                                                  id: res.payload.project,
                                                  name: newName,
                                                  permissions: ["OWNER"],
                                                  hasTemplate: false,
                                                },
                                              ]);

                                              setFilteredProjectList([
                                                ...projectList,
                                                {
                                                  id: res.payload.project,
                                                  name: newName,
                                                  permissions: ["OWNER"],
                                                  hasTemplate: false,
                                                },
                                              ]);
                                              setQuery("");
                                              (
                                                document.getElementById(
                                                  sBoxId
                                                ) as HTMLInputElement
                                              ).value = "";
                                              toast({
                                                title: "Erfolg",
                                                description:
                                                  "Das Projekt wurde erfolgreich dupliziert",
                                                status: "success",
                                                variant: "solid",
                                                position: "top",
                                                isClosable: true,
                                              });
                                            } else {
                                              toast({
                                                title: "Fehler",
                                                description: res.payload.error,
                                                status: "error",
                                                variant: "solid",
                                                position: "top",
                                                isClosable: true,
                                              });
                                            }
                                          }}
                                        >
                                          <BiDuplicate /> Klonen
                                        </Flex>
                                      </MenuItem>
                                    ) : null}
                                    {project.permissions.includes("OWNER") ||
                                    project.permissions.includes(
                                      "MANAGE-CONTRIBUTORS"
                                    ) ? (
                                      <MenuItem
                                        onClick={async () => {
                                          setProjectId(project.id);
                                          onContributorOpen();
                                        }}
                                      >
                                        <Flex
                                          direction={"row"}
                                          alignItems={"center"}
                                          gap={".6rem"}
                                          color={"pink.400"}
                                        >
                                          <FaUsersCog /> Mitwirkende verwalten
                                        </Flex>
                                      </MenuItem>
                                    ) : null}
                                    {project.permissions.includes("OWNER") ||
                                    project.permissions.includes("EXPORT") ? (
                                      <MenuItem
                                        onClick={async () => {
                                          const fullProject = (
                                            await REST.IDE.getProject({
                                              token: localStorage.getItem(
                                                "token"
                                              ) as string,
                                              projectId: project.id as string,
                                            })
                                          ).payload.project;

                                          const exportObject: any = {};

                                          exportObject.codeUp = {
                                            version: "1.0",
                                            href: location.href,
                                            exportedAt:
                                              new Date().toLocaleString(),
                                            userInfo: userInfo,
                                          };

                                          exportObject.name = fullProject.name;

                                          exportObject.files =
                                            fullProject.files;

                                          Networking.download(
                                            fullProject.name + ".cupp",
                                            JSON.stringify(
                                              exportObject,
                                              null,
                                              2
                                            ),
                                            "text/plain"
                                          );
                                        }}
                                      >
                                        <Flex
                                          direction={"row"}
                                          alignItems={"center"}
                                          gap={".6rem"}
                                          color={"yellow.400"}
                                        >
                                          <FaFileExport /> Exportieren
                                        </Flex>
                                      </MenuItem>
                                    ) : null}
                                    {project.permissions.includes("OWNER") &&
                                    !project.hasTemplate ? (
                                      <MenuItem
                                        onClick={async () => {
                                          setPublisherTemplateId(project.id);
                                          onPublisherOpen();
                                        }}
                                      >
                                        <Flex
                                          direction={"row"}
                                          alignItems={"center"}
                                          gap={".6rem"}
                                          color={"purple.400"}
                                        >
                                          <FaCloudUploadAlt /> Vorlage
                                          Veröffentlichen
                                        </Flex>
                                      </MenuItem>
                                    ) : null}
                                    {project.permissions.includes("OWNER") &&
                                    project.hasTemplate ? (
                                      <MenuItem
                                        onClick={async () => {
                                          const res =
                                            await REST.IDE.removeTemplate({
                                              token: localStorage.getItem(
                                                "token"
                                              ) as string,
                                              projectId: project.id,
                                            });

                                          let y = projectList;

                                          (
                                            y.find(
                                              (p) => p.id === project.id
                                            ) as any
                                          ).hasTemplate = false;

                                          setProjectList(y);

                                          setQuery(project.name);

                                          setTimeout(() => {
                                            setQuery(query);
                                          }, 100);

                                          toast({
                                            status: "success",
                                            position: "top",
                                            variant: "solid",
                                            isClosable: true,
                                            duration: 3000,
                                            title: "Erfolgreich",
                                            description:
                                              "Die Vorlage wurde erfolgreich gelöscht!",
                                          });
                                        }}
                                      >
                                        <Flex
                                          direction={"row"}
                                          alignItems={"center"}
                                          gap={".6rem"}
                                          color={"purple.400"}
                                        >
                                          <FaTrash /> Vorlage Löschen
                                        </Flex>
                                      </MenuItem>
                                    ) : null}
                                  </MenuList>
                                </Menu>
                              </Box>
                            </Flex>
                          </Box>
                          <Divider />
                        </>
                      );
                    })}
                  </Flex>
                </>
              ) : (
                <>
                  <Box mt={"2rem"} textAlign={"center"}>
                    Es wurden keine Projekte gefunden, die der auf die Suche
                    &quot;{query}&quot; zutreffen
                  </Box>
                </>
              )}
            </>
          ) : null}
        </Box>
      </Flex>
      <ContributorManager
        isOpen={isContributorOpen}
        onOpen={onContributorOpen}
        onClose={onContributorClose}
        projectId={projectId}
      />
      <TemplatePublisher
        isOpen={isPublisherOpen}
        onOpen={onPublisherOpen}
        onClose={onPublisherClose}
        projectId={publisherTemplateId}
        setProjectList={setProjectList}
        projectList={projectList}
      />
    </>
  );
}
