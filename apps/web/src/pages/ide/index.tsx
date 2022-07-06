/**
 * apps/web/src/pages/ide/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.07.2022
 *
 */

import * as React from "react";
import { useEffect, useId, useState } from "react";
import redirect from "@codeup/util/src/userworkflow/redirect";
import {
  Box,
  Button,
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
  Spinner,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaPlus, FaRegFolderOpen, FaSearch } from "react-icons/fa";
import { BiDuplicate, BiRename } from "react-icons/bi";
import { default as NextLink } from "next/link";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";

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

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

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
            Projekt Erstellen
          </Heading>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              setLoading(true);

              const resp = await fetch("/api/ide/projects/create", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: localStorage.getItem("token"),
                  // @ts-ignore
                  name: e.target.elements[nameId].value,
                }),
              });

              const json = await resp.json();

              if (resp.status === 200) {
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
                  description: json.error,
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
        </Box>
      </Flex>
    </>
  );
}

function Open() {
  const [projectList, setProjectList] = useState<
    { name: string; id: string }[]
  >([]);
  const [filteredProjectList, setFilteredProjectList] = useState<
    { name: string; id: string }[]
  >([]);
  const [query, setQuery] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    fetch("/api/ide/projects/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        type: "OWNER",
        minimal: true,
      }),
    }).then((res) => {
      res.json().then((json) => {
        if (res.status === 200) {
          setProjectList(json.projects);
          setFilteredProjectList(json.projects);
          setLoading(false);
        } else {
          toast({
            title: "Fehler",
            description: json.error,
            status: "error",
            variant: "solid",
            position: "top",
            isClosable: true,
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    setFilteredProjectList(projectList.filter((p) => p.name.includes(query)));
  }, [query]);

  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const sBoxId = useId();

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
                                {project.name}
                              </Box>
                              <Box flex={[0, "60%"]}></Box>
                              <Box flex={"20%"}>
                                <Flex alignItems={"center"} gap={".8rem"}>
                                  <Tooltip
                                    label={"Projekt löschen"}
                                    hasArrow={true}
                                  >
                                    <IconButton
                                      aria-label={"Projekt Löschen"}
                                      colorScheme={"red"}
                                      isLoading={buttonLoading}
                                      disabled={buttonLoading}
                                      icon={<BsFillTrashFill />}
                                      onClick={async () => {
                                        setButtonLoading(true);
                                        const res = await fetch(
                                          "/api/ide/projects/delete",
                                          {
                                            method: "POST",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify({
                                              token:
                                                localStorage.getItem("token"),
                                              id: project.id,
                                            }),
                                          }
                                        );
                                        const json = await res.json();

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
                                          setButtonLoading(false);
                                        } else {
                                          toast({
                                            title: "Fehler",
                                            description: json.error,
                                            status: "error",
                                            variant: "solid",
                                            position: "top",
                                            isClosable: true,
                                          });
                                          setButtonLoading(false);
                                        }
                                      }}
                                    />
                                  </Tooltip>
                                  <Tooltip
                                    label={"Projekt Umbenennen"}
                                    hasArrow={true}
                                  >
                                    <IconButton
                                      aria-label={"Projekt Umbenennen"}
                                      colorScheme={"green"}
                                      isLoading={buttonLoading}
                                      disabled={buttonLoading}
                                      icon={<BsFillPencilFill />}
                                      onClick={async (e) => {
                                        const newName = prompt(
                                          "Gib den neuen Namen ein"
                                        );

                                        if (!newName) {
                                          return;
                                        }

                                        setButtonLoading(true);
                                        const res = await fetch(
                                          "/api/ide/projects/update/name",
                                          {
                                            method: "POST",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify({
                                              token:
                                                localStorage.getItem("token"),
                                              id: project.id,
                                              name: newName,
                                            }),
                                          }
                                        );
                                        const json = await res.json();

                                        if (res.status === 200) {
                                          let npl = projectList.map((p) => {
                                            if (p.id === project.id) {
                                              return {
                                                id: p.id,
                                                name: newName,
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
                                          setButtonLoading(false);
                                        } else {
                                          toast({
                                            title: "Fehler",
                                            description: json.error,
                                            status: "error",
                                            variant: "solid",
                                            position: "top",
                                            isClosable: true,
                                          });
                                          setButtonLoading(false);
                                        }
                                      }}
                                    />
                                  </Tooltip>

                                  <Tooltip
                                    label={"Projekt Duplizieren"}
                                    hasArrow={true}
                                  >
                                    <IconButton
                                      aria-label={"Projekt Duplizieren"}
                                      colorScheme={"blue"}
                                      isLoading={buttonLoading}
                                      disabled={buttonLoading}
                                      icon={<BiDuplicate />}
                                      onClick={async () => {
                                        const newName = prompt(
                                          "Gib den neuen Namen ein"
                                        );

                                        if (!newName) {
                                          return;
                                        }

                                        setButtonLoading(true);
                                        const res = await fetch(
                                          "/api/ide/projects/duplicate",
                                          {
                                            method: "POST",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify({
                                              token:
                                                localStorage.getItem("token"),
                                              id: project.id,
                                              name: newName,
                                            }),
                                          }
                                        );
                                        const json = await res.json();

                                        if (res.status === 200) {
                                          let npl = projectList;

                                          npl.push({
                                            id: json.project,
                                            name: newName,
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
                                              "Das Projekt wurde erfolgreich dupliziert",
                                            status: "success",
                                            variant: "solid",
                                            position: "top",
                                            isClosable: true,
                                          });
                                          setButtonLoading(false);
                                        } else {
                                          toast({
                                            title: "Fehler",
                                            description: json.error,
                                            status: "error",
                                            variant: "solid",
                                            position: "top",
                                            isClosable: true,
                                          });
                                          setButtonLoading(false);
                                        }
                                      }}
                                    />
                                  </Tooltip>
                                </Flex>
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
    </>
  );
}
