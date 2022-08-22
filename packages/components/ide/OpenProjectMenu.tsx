/**
 * packages/components/ide/OpenProjectMenu.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.08.2022
 *
 */

import * as React from "react";
import { useEffect, useId, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import { useUserInfo } from "@codeup/hooks";
import {
  FaCloudUploadAlt,
  FaFileExport,
  FaSearch,
  FaSort,
  FaSortNumericDownAlt,
  FaSortNumericUpAlt,
  FaSortUp,
  FaThumbtack,
  FaTrash,
  FaUsersCog,
} from "react-icons/fa";
import { BiDuplicate } from "react-icons/bi";
import * as generate from "project-name-generator";
import byteSize from "byte-size";
import { FiMoreHorizontal } from "react-icons/fi";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import { ContributorManager } from "./index";
import TemplatePublisher from "./TemplatePublisher";
import { default as NextLink } from "next/link";
import Networking from "@codeup/util/src/Networking";

export default function OpenProjectMenu() {
  const [projectList, setProjectList] = useState<
    {
      name: string;
      id: string;
      permissions: string[];
      hasTemplate: boolean;
      updated_at: string;
      pinned: string[];
      stats: {
        total_files: number;
        total_contributors: number;
        total_size: number;
      };
    }[]
  >([]);
  const [filteredProjectList, setFilteredProjectList] = useState<
    {
      name: string;
      id: string;
      permissions: string[];
      hasTemplate: boolean;
      updated_at: string;
      pinned: string[];
      stats: {
        total_files: number;
        total_contributors: number;
        total_size: number;
      };
    }[]
  >([]);
  const [query, setQuery] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    REST.IDE.getProjects({
      token: localStorage.getItem("token") as string,
      type: "ALL",
      withStats: true,
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
            updated_at: project.updated_at,
            pinned: project.pinned,
            stats: project.stats,
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

  const sBoxId = useId();

  const [projectId, setProjectId] = useState("0");

  const userInfo = useUserInfo();

  const {
    isOpen: isPublisherOpen,
    onOpen: onPublisherOpen,
    onClose: onPublisherClose,
  } = useDisclosure();

  const [publisherTemplateId, setPublisherTemplateId] = useState("0");

  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const [sorting, setSorting] = useState<string>("latest-first");

  useEffect(() => {
    console.log(selectedProjects);
  }, [selectedProjects]);

  useEffect(() => {
    if (sorting === "latest-first") {
      setFilteredProjectList(
        filteredProjectList.sort((a, b) => {
          return (
            Number(new Date(b.updated_at)) - Number(new Date(a.updated_at))
          );
        })
      );
    } else if (sorting === "oldest-first") {
      setFilteredProjectList(
        filteredProjectList.sort((a, b) => {
          return (
            Number(new Date(a.updated_at)) - Number(new Date(b.updated_at))
          );
        })
      );
    }
  }, [sorting]);

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
                  <InputRightAddon>
                    <IconButton
                      aria-label={"sort"}
                      icon={
                        sorting === "latest-first" ? (
                          <FaSortNumericDownAlt />
                        ) : (
                          <FaSortNumericUpAlt />
                        )
                      }
                      onClick={() => {
                        if (sorting === "latest-first") {
                          setSorting("oldest-first");
                        } else {
                          setSorting("latest-first");
                        }
                      }}
                      backgroundColor={"transparent"}
                      _hover={{
                        backgroundColor: "transparent",
                      }}
                      _active={{
                        backgroundColor: "transparent",
                      }}
                    />
                  </InputRightAddon>
                </InputGroup>
              </FormControl>
              {filteredProjectList.length > 0 ? (
                <>
                  <Flex direction={"column"} mt={"2rem"}>
                    <Box pt={"0.75rem"} pb={"0.75rem"} fontSize={"2xl"}>
                      <Flex direction={"row"}>
                        <Box flex={"10%"}></Box>
                        <Box
                          flex={"20%"}
                          textAlign={"center"}
                          fontWeight={"bold"}
                        >
                          Name
                        </Box>
                        <Box
                          flex={[0, "50%"]}
                          textAlign={"center"}
                          fontWeight={"bold"}
                          display={["none", "initial"]}
                        >
                          Statistik
                        </Box>
                        <Box
                          flex={"20%"}
                          textAlign={"center"}
                          fontWeight={"bold"}
                        >
                          Aktion
                        </Box>
                      </Flex>
                    </Box>
                    {selectedProjects.length > 0 ? (
                      <>
                        <Box pt={".75rem"} pb={".75rem"} fontSize={"2xl"}>
                          <Flex direction={"row"}>
                            <Box flex={"5%"}></Box>
                            <Box flex={"20%"} textAlign={"left"}>
                              {selectedProjects.length} Projekte
                            </Box>
                            <Box flex={[0, "50%"]}></Box>
                            <Box flex={"20%"}>
                              <Flex
                                w={"100%"}
                                h={"100%"}
                                alignItems={"center"}
                                justifyContent={"center"}
                              >
                                <Button
                                  variant={"ghost"}
                                  leftIcon={<FaTrash />}
                                  colorScheme={"red"}
                                  onClick={async () => {
                                    let npl = projectList;

                                    for (const projectId of selectedProjects) {
                                      const res = await REST.IDE.deleteProject({
                                        token: localStorage.getItem(
                                          "token"
                                        ) as string,
                                        projectId: projectId,
                                      });

                                      if (res.status === 200) {
                                        npl = npl.filter(
                                          (p) => p.id !== projectId
                                        );
                                        (
                                          document.getElementById(
                                            sBoxId
                                          ) as HTMLInputElement
                                        ).value = "";
                                        toast({
                                          title: "Erfolg",
                                          description: `Das Projekt ${projectId} wurde erfolgreich gelöscht`,
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
                                    }
                                    setSelectedProjects([]);
                                    setProjectList(npl);
                                    setFilteredProjectList(npl);
                                    setQuery("");
                                  }}
                                >
                                  Löschen
                                </Button>
                                <Button
                                  variant={"ghost"}
                                  leftIcon={<FaFileExport />}
                                  colorScheme={"orange"}
                                  onClick={async () => {
                                    for (const projectId of selectedProjects) {
                                      const fullProject = (
                                        await REST.IDE.getProject({
                                          token: localStorage.getItem(
                                            "token"
                                          ) as string,
                                          projectId: projectId as string,
                                        })
                                      ).payload.project;

                                      const exportObject: any = {};

                                      exportObject.codeUp = {
                                        version: "1.0",
                                        href: location.href,
                                        exportedAt: new Date().toLocaleString(),
                                        userInfo: userInfo,
                                      };

                                      exportObject.name = fullProject.name;

                                      exportObject.files = fullProject.files;

                                      Networking.download(
                                        fullProject.name + ".cupp",
                                        JSON.stringify(exportObject, null, 2),
                                        "text/plain"
                                      );
                                    }
                                  }}
                                >
                                  Exportieren
                                </Button>
                                <Button
                                  variant={"ghost"}
                                  leftIcon={<BiDuplicate />}
                                  colorScheme={"blue"}
                                  onClick={async () => {
                                    let npl = projectList;

                                    for (const projectId of selectedProjects) {
                                      const newName = generate.default().dashed;

                                      const res =
                                        await REST.IDE.duplicateProject({
                                          token: localStorage.getItem(
                                            "token"
                                          ) as string,
                                          projectId: projectId,
                                          name: newName,
                                        });

                                      if (res.status === 200) {
                                        npl = [
                                          ...npl,
                                          {
                                            id: res.payload.project._id,
                                            name: newName,
                                            permissions: ["OWNER"],
                                            hasTemplate: false,
                                            updated_at:
                                              res.payload.project.updated_at,
                                            pinned: res.payload.project.pinned,
                                            stats: {
                                              total_files: 1,
                                              total_contributors: 1,
                                              total_size: 0,
                                            },
                                          },
                                        ];
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
                                    }
                                    setProjectList(npl);
                                    setFilteredProjectList(npl);
                                  }}
                                >
                                  Klonen
                                </Button>
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>
                      </>
                    ) : null}
                    {filteredProjectList
                      .sort((a, b) => {
                        let f = a;
                        let s = b;

                        if (sorting !== "latest-first") {
                          f = b;
                          s = a;
                        }

                        return (
                          Number(new Date(s.updated_at)) -
                          Number(new Date(f.updated_at))
                        );
                      })
                      .sort((a, b) => {
                        if (
                          a.pinned.includes(userInfo.id) &&
                          !b.pinned.includes(userInfo.id)
                        ) {
                          return -1;
                        } else if (
                          !a.pinned.includes(userInfo.id) &&
                          b.pinned.includes(userInfo.id)
                        ) {
                          return 1;
                        }
                        return 0;
                      })
                      .map((project) => {
                        return (
                          <>
                            <Box
                              pt={"0.75rem"}
                              pb={"0.75rem"}
                              fontSize={"2xl"}
                              bgColor={
                                selectedProjects.includes(project.id)
                                  ? "gray.800"
                                  : "gray.900"
                              }
                            >
                              <Flex direction={"row"}>
                                <Box flex={"10%"}>
                                  <Flex
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    h={"100%"}
                                  >
                                    <Checkbox
                                      size={"lg"}
                                      onChange={(e) => {
                                        console.log(e.target.checked);
                                        if (e.target.checked) {
                                          setSelectedProjects([
                                            project.id,
                                            ...selectedProjects,
                                          ]);
                                        } else {
                                          let x = selectedProjects;
                                          x = x.filter((y) => y !== project.id);
                                          setSelectedProjects(x);
                                        }
                                      }}
                                    />
                                  </Flex>
                                </Box>
                                <Box flex={"20%"} textAlign={"center"}>
                                  <Flex direction={"column"}>
                                    <Link
                                      href={
                                        "/ide/project/" +
                                        project.id +
                                        "#editor-wrapper-flex"
                                      }
                                      flex={"100%"}
                                    >
                                      <NextLink
                                        href={
                                          "/ide/project/" +
                                          project.id +
                                          "#editor-wrapper-flex"
                                        }
                                      >
                                        <Flex
                                          alignItems={"center"}
                                          justifyContent={"center"}
                                          gap={".6rem"}
                                        >
                                          <Text
                                            fontSize={"lg"}
                                            color={"blue.600"}
                                          >
                                            {project.pinned.includes(
                                              userInfo.id
                                            ) ? (
                                              <FaThumbtack />
                                            ) : null}
                                          </Text>
                                          {project.name}
                                        </Flex>
                                      </NextLink>
                                    </Link>
                                    <Text color={"gray.500"} fontSize={"lg"}>
                                      {new Date(
                                        project.updated_at
                                      ).toLocaleDateString()}
                                      &nbsp;
                                      {new Date(
                                        project.updated_at
                                      ).toLocaleTimeString()}
                                    </Text>
                                  </Flex>
                                </Box>
                                <Box
                                  flex={[0, "50%"]}
                                  display={["none", "initial"]}
                                  textAlign={"center"}
                                >
                                  <Flex direction={"column"} gap={".4rem"}>
                                    <Text fontSize={"md"}>
                                      {project.stats.total_files}&nbsp;
                                      {project.stats.total_files === 1
                                        ? "Datei"
                                        : "Dateien"}
                                    </Text>
                                    <Text fontSize={"md"}>
                                      {project.stats.total_contributors}&nbsp;
                                      {project.stats.total_contributors === 1
                                        ? "Mitwirkender"
                                        : "Mitwirkende"}
                                    </Text>
                                    <Text fontSize={"md"}>
                                      <>
                                        Projektgröße:&nbsp;
                                        {byteSize(
                                          project.stats.total_size
                                        ).toString()}
                                      </>
                                    </Text>
                                  </Flex>
                                </Box>
                                <Box
                                  flex={"20%"}
                                  alignItems={"center"}
                                  justifyContent={"center"}
                                  textAlign={"center"}
                                >
                                  <Menu>
                                    <MenuButton>
                                      <IconButton
                                        variant="outline"
                                        aria-label={"menu"}
                                      >
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
                                                    updated_at: p.updated_at,
                                                    pinned: p.pinned,
                                                    stats: p.stats,
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
                                            const newName =
                                              generate.default().dashed;

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
                                                  id: res.payload.project._id,
                                                  name: newName,
                                                  permissions: ["OWNER"],
                                                  hasTemplate: false,
                                                  updated_at:
                                                    res.payload.project
                                                      .updated_at,
                                                  pinned:
                                                    res.payload.project.pinned,
                                                  stats: {
                                                    total_files: 1,
                                                    total_contributors: 1,
                                                    total_size: 0,
                                                  },
                                                },
                                              ]);

                                              setFilteredProjectList([
                                                ...projectList,
                                                {
                                                  id: res.payload.project._id,
                                                  name: newName,
                                                  permissions: ["OWNER"],
                                                  hasTemplate: false,
                                                  updated_at:
                                                    res.payload.project
                                                      .updated_at,
                                                  pinned:
                                                    res.payload.project.pinned,
                                                  stats: {
                                                    total_files: 1,
                                                    total_contributors: 1,
                                                    total_size: 0,
                                                  },
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

                                            exportObject.name =
                                              fullProject.name;

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
                                      <MenuItem
                                        onClick={async () => {
                                          let l = projectList;
                                          const beforePinned =
                                            project.pinned.includes(
                                              userInfo.id
                                            );

                                          await REST.IDE.toggleProjectPin({
                                            token: localStorage.getItem(
                                              "token"
                                            ) as string,
                                            projectId: project.id,
                                          });

                                          l = l.map((x) => {
                                            if (x.id !== project.id) {
                                              return x;
                                            } else {
                                              if (beforePinned) {
                                                x.pinned = x.pinned.filter(
                                                  (y) => y !== userInfo.id
                                                );
                                              } else {
                                                x.pinned.push(userInfo.id);
                                              }
                                              return x;
                                            }
                                          });

                                          setProjectList(l);
                                          setQuery("loading...");
                                          setTimeout(() => {
                                            setQuery("");
                                          }, 100);
                                        }}
                                      >
                                        <Flex
                                          direction={"row"}
                                          alignItems={"center"}
                                          gap={".6rem"}
                                          color={"blue.600"}
                                        >
                                          <FaThumbtack />
                                          &nbsp;
                                          {project.pinned.includes(userInfo.id)
                                            ? "Abheften"
                                            : "Anheften"}
                                        </Flex>
                                      </MenuItem>
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
