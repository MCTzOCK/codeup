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
  Checkbox,
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
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  FaCogs,
  FaPlus,
  FaRegFolderOpen,
  FaSearch,
  FaTrash,
  FaUsersCog,
} from "react-icons/fa";
import { BiDuplicate, BiRename } from "react-icons/bi";
import { default as NextLink } from "next/link";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMail } from "react-icons/hi";
import { useUserInfo } from "@codeup/hooks";

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
    { name: string; id: string; permissions: string[] }[]
  >([]);
  const [filteredProjectList, setFilteredProjectList] = useState<
    { name: string; id: string; permissions: string[] }[]
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
        type: "ALL",
        minimal: true,
      }),
    }).then((res) => {
      res.json().then(async (json) => {
        if (res.status === 200) {
          let pList = [];

          for (const project of json.projects) {
            const r = await fetch("/api/ide/projects/permissions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: localStorage.getItem("token"),
                project: project.id,
              }),
            });

            const j = await r.json();

            pList.push({
              id: project.id,
              name: project.name,
              permissions: j.permissions,
            });
          }

          setProjectList(pList);
          setFilteredProjectList(pList);
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
                              <Box
                                flex={"20%"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                textAlign={"center"}
                              >
                                <Menu>
                                  <MenuButton>
                                    <IconButton aria-label={"menu"}>
                                      <GiHamburgerMenu />
                                    </IconButton>
                                  </MenuButton>
                                  <MenuList>
                                    {project.permissions.includes("OWNER") ||
                                    project.permissions.includes("DELETE") ? (
                                      <MenuItem>
                                        <Flex
                                          direction={"row"}
                                          alignItems={"center"}
                                          gap={".6rem"}
                                          color={"red.400"}
                                          onClick={async () => {
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
                                                    localStorage.getItem(
                                                      "token"
                                                    ),
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
                                          }}
                                        >
                                          <BsFillTrashFill /> Löschen
                                        </Flex>
                                      </MenuItem>
                                    ) : null}
                                    {project.permissions.includes("OWNER") ||
                                    project.permissions.includes("RENAME") ? (
                                      <MenuItem>
                                        <Flex
                                          direction={"row"}
                                          alignItems={"center"}
                                          gap={".6rem"}
                                          color={"green.400"}
                                          onClick={async (e) => {
                                            const newName = prompt(
                                              "Gib den neuen Namen ein"
                                            );

                                            if (!newName) {
                                              return;
                                            }

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
                                                    localStorage.getItem(
                                                      "token"
                                                    ),
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
                                                    permissions: p.permissions,
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
                                                description: json.error,
                                                status: "error",
                                                variant: "solid",
                                                position: "top",
                                                isClosable: true,
                                              });
                                            }
                                          }}
                                        >
                                          <BsFillPencilFill /> Umbenennen
                                        </Flex>
                                      </MenuItem>
                                    ) : null}
                                    {project.permissions.includes("OWNER") ||
                                    project.permissions.includes(
                                      "DUPLICATE"
                                    ) ? (
                                      <MenuItem>
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
                                                    localStorage.getItem(
                                                      "token"
                                                    ),
                                                  id: project.id,
                                                  name: newName,
                                                }),
                                              }
                                            );
                                            const json = await res.json();

                                            if (res.status === 200) {
                                              setProjectList([
                                                ...projectList,
                                                {
                                                  id: json.project,
                                                  name: newName,
                                                  permissions: ["OWNER"],
                                                },
                                              ]);

                                              setFilteredProjectList([
                                                ...projectList,
                                                {
                                                  id: json.project,
                                                  name: newName,
                                                  permissions: ["OWNER"],
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
                                                description: json.error,
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
                                      <MenuItem>
                                        <Flex
                                          direction={"row"}
                                          alignItems={"center"}
                                          gap={".6rem"}
                                          color={"pink.400"}
                                          onClick={async () => {
                                            const res = await fetch(
                                              "/api/ide/projects/contributors/list",
                                              {
                                                method: "POST",
                                                headers: {
                                                  "Content-Type":
                                                    "application/json",
                                                },
                                                body: JSON.stringify({
                                                  token:
                                                    localStorage.getItem(
                                                      "token"
                                                    ),
                                                  project: project.id,
                                                }),
                                              }
                                            );

                                            const j = await res.json();

                                            setContributors({
                                              owner: j.owner,
                                              contributors: j.contributors,
                                            });
                                            setProjectId(project.id);
                                            onContributorOpen();
                                          }}
                                        >
                                          <FaUsersCog /> Mitwirkende verwalten
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
      <Modal
        isOpen={isContributorOpen}
        onClose={onContributorClose}
        size={["full", "5xl"]}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mitwirkende verwalten</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {contributors ? (
              <>
                <Flex justifyContent={"right"} mr={[0, "2rem"]}>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        variant={"solid"}
                        colorScheme={"whatsapp"}
                        leftIcon={<FaPlus />}
                      >
                        Hinzufügen
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent bgColor={"black"}>
                      <PopoverArrow bgColor={"black"} />
                      <PopoverCloseButton />
                      <PopoverHeader fontSize={["xl", "2xl"]}>
                        Mitwirkenden hinzufügen
                      </PopoverHeader>
                      <PopoverBody fontSize={["lg", "xl"]}>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const resp = await fetch(
                              "/api/ide/projects/contributors/add",
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  token: localStorage.getItem("token"),
                                  project: projectId,
                                  // @ts-ignore
                                  contributor: e.target.elements.email_i.value,
                                }),
                              }
                            );
                            if (resp.status === 200) {
                              let json = await resp.json();
                              let c0n: any = contributors;

                              c0n.contributors.push(json.contributor);

                              setContributors({
                                owner: contributors.owner,
                                contributors: [...c0n.contributors],
                              });
                              // @ts-ignore
                              e.target.elements.email_i.value = "";
                            } else {
                              const json = await resp.json();
                              toast({
                                title: "Fehler",
                                description: json.error,
                                position: "top",
                                status: "error",
                                variant: "solid",
                                isClosable: true,
                              });
                            }
                          }}
                        >
                          <Stack>
                            <FormControl>
                              <FormLabel>E-Mail</FormLabel>
                              <InputGroup>
                                <InputLeftAddon>
                                  <HiMail />
                                </InputLeftAddon>
                                <Input
                                  id={"email_i"}
                                  name="email_i"
                                  placeholder={"E-Mail"}
                                />
                              </InputGroup>
                            </FormControl>
                            <Button type="submit" colorScheme={"whatsapp"}>
                              Hinzufügen
                            </Button>
                          </Stack>
                        </form>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Flex>
                <Flex
                  m={[0, "2rem"]}
                  direction={"column"}
                  fontSize={["xl", "2xl"]}
                >
                  <Flex direction={"row"} mb={"1.2rem"}>
                    <Box flex={"20%"} fontWeight={"bold"}>
                      Name
                    </Box>
                    <Box flex={"60%"}></Box>
                    <Flex
                      flex={"20%"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontWeight={"bold"}
                    >
                      Berechtigungen
                    </Flex>
                  </Flex>
                  <Divider />
                  <Flex direction={"row"} mt={"1.2rem"} mb={"1.2rem"}>
                    <Box flex={"20%"}>
                      {contributors.owner.firstName}&nbsp;
                      {contributors.owner.lastName}
                      <br />
                      <Text color={"gray.500"} fontSize={["lg", "xl"]}>
                        @{contributors.owner.username}
                      </Text>
                    </Box>
                    <Box flex={"60%"}></Box>
                    <Flex
                      flex={"20%"}
                      alignItems={"center"}
                      justifyContent={"right"}
                    >
                      <Tooltip
                        label={
                          "Diesem Benutzer gehört das Projekt, er hat alle Berechtigungen, inklusive der Verwaltung von Mitwirkenden"
                        }
                        hasArrow={true}
                      >
                        <Tag size={"lg"} variant={"solid"} colorScheme={"red"}>
                          Besitzer
                        </Tag>
                      </Tooltip>
                    </Flex>
                  </Flex>
                  <Divider />
                  {contributors.contributors.map((contributor) => {
                    return (
                      <>
                        <Flex direction={"row"} mt={"1.2rem"} mb={"1.2rem"}>
                          <Box flex={"20%"}>
                            {contributor.firstName}&nbsp;
                            {contributor.lastName}
                            <br />
                            <Text color={"gray.500"} fontSize={["lg", "xl"]}>
                              @{contributor.username}
                            </Text>
                          </Box>
                          <Box flex={"20%"}></Box>
                          <Flex
                            flex={"60%"}
                            justifyContent={"right"}
                            direction={["column", "row"]}
                            gap={["2rem", 0]}
                          >
                            <Box flex={"80%"}>
                              <SimpleGrid
                                minChildWidth={130}
                                w={"100%"}
                                spacing={3}
                              >
                                {contributor.permissions.includes("READ") ? (
                                  <Tag
                                    size={"lg"}
                                    variant={"solid"}
                                    colorScheme={"teal"}
                                  >
                                    Lesen
                                  </Tag>
                                ) : null}
                                {contributor.permissions.includes("WRITE") ? (
                                  <Tag
                                    size={"lg"}
                                    variant={"solid"}
                                    colorScheme={"teal"}
                                  >
                                    Schreiben
                                  </Tag>
                                ) : null}
                                {contributor.permissions.includes("DELETE") ? (
                                  <Tag
                                    size={"lg"}
                                    variant={"solid"}
                                    colorScheme={"teal"}
                                  >
                                    Löschen
                                  </Tag>
                                ) : null}
                                {contributor.permissions.includes(
                                  "DUPLICATE"
                                ) ? (
                                  <Tag
                                    size={"lg"}
                                    variant={"solid"}
                                    colorScheme={"teal"}
                                  >
                                    Klonen
                                  </Tag>
                                ) : null}
                                {contributor.permissions.includes("RENAME") ? (
                                  <Tag
                                    size={"lg"}
                                    variant={"solid"}
                                    colorScheme={"teal"}
                                  >
                                    Umbenennen
                                  </Tag>
                                ) : null}
                                {contributor.permissions.includes("EXPORT") ? (
                                  <Tag
                                    size={"lg"}
                                    variant={"solid"}
                                    colorScheme={"teal"}
                                  >
                                    Exportieren
                                  </Tag>
                                ) : null}
                                {contributor.permissions.includes(
                                  "MANAGE-CONTRIBUTORS"
                                ) ? (
                                  <Tag
                                    size={"lg"}
                                    variant={"solid"}
                                    colorScheme={"teal"}
                                  >
                                    Mitwirkende verwalten
                                  </Tag>
                                ) : null}
                              </SimpleGrid>
                            </Box>
                            <Flex
                              flex={"20%"}
                              justifyContent={"center"}
                              alignItems={"center"}
                            >
                              <ButtonGroup>
                                <Popover>
                                  <PopoverTrigger>
                                    <IconButton
                                      aria-label={"Mitwirkenden entfernen"}
                                    >
                                      <FaTrash />
                                    </IconButton>
                                  </PopoverTrigger>
                                  <PopoverContent bgColor={"gray.800"}>
                                    <PopoverArrow bgColor={"gray.800"} />
                                    <PopoverCloseButton />
                                    <PopoverHeader>
                                      Mitwirkenden entfernen
                                    </PopoverHeader>
                                    <PopoverBody>
                                      <Stack>
                                        <Text fontSize={"lg"}>
                                          Willst du den mitwirkenden&nbsp;
                                          {contributor.firstName}&nbsp;
                                          {contributor.lastName}&nbsp;(
                                          {contributor.username}) wirklich
                                          entfernen?
                                        </Text>
                                        <Button
                                          variant={"solid"}
                                          colorScheme={"red"}
                                          onClick={async () => {
                                            const resp = await fetch(
                                              "/api/ide/projects/contributors/remove",
                                              {
                                                method: "POST",
                                                headers: {
                                                  "Content-Type":
                                                    "application/json",
                                                },
                                                body: JSON.stringify({
                                                  token:
                                                    localStorage.getItem(
                                                      "token"
                                                    ),
                                                  project: projectId,
                                                  contributor:
                                                    contributor.email,
                                                }),
                                              }
                                            );
                                            if (resp.status === 200) {
                                              let c0n: any = contributors;

                                              c0n = c0n.contributors.filter(
                                                (c: any) =>
                                                  c.email !== contributor.email
                                              );

                                              setContributors({
                                                owner: contributors.owner,
                                                contributors: [...c0n],
                                              });
                                            } else {
                                              const json = await resp.json();
                                              toast({
                                                title: "Fehler",
                                                description: json.error,
                                                position: "top",
                                                status: "error",
                                                variant: "solid",
                                                isClosable: true,
                                              });
                                            }
                                          }}
                                        >
                                          Entfernen
                                        </Button>
                                      </Stack>
                                    </PopoverBody>
                                  </PopoverContent>
                                </Popover>

                                {userInfo.id !== contributor.id ? (
                                  <>
                                    <Popover>
                                      <PopoverTrigger>
                                        <IconButton
                                          aria-label={
                                            "Berechtigungen verwalten"
                                          }
                                        >
                                          <FaCogs />
                                        </IconButton>
                                      </PopoverTrigger>
                                      <PopoverContent bgColor={"gray.800"}>
                                        <PopoverArrow bgColor={"gray.800"} />
                                        <PopoverCloseButton />
                                        <PopoverHeader>
                                          Berechtigungen ändern
                                        </PopoverHeader>
                                        <PopoverBody>
                                          <Stack>
                                            <Checkbox
                                              defaultChecked={contributor.permissions.includes(
                                                "READ"
                                              )}
                                              disabled={true}
                                            >
                                              Lesen
                                            </Checkbox>
                                            <Checkbox
                                              defaultChecked={contributor.permissions.includes(
                                                "WRITE"
                                              )}
                                              id={
                                                "cb-upd-perms-" +
                                                contributor.id +
                                                "-write"
                                              }
                                            >
                                              Schreiben
                                            </Checkbox>
                                            <Checkbox
                                              defaultChecked={contributor.permissions.includes(
                                                "DELETE"
                                              )}
                                              id={
                                                "cb-upd-perms-" +
                                                contributor.id +
                                                "-delete"
                                              }
                                            >
                                              Löschen
                                            </Checkbox>
                                            <Checkbox
                                              defaultChecked={contributor.permissions.includes(
                                                "DUPLICATE"
                                              )}
                                              id={
                                                "cb-upd-perms-" +
                                                contributor.id +
                                                "-duplicate"
                                              }
                                            >
                                              Klonen
                                            </Checkbox>
                                            <Checkbox
                                              defaultChecked={contributor.permissions.includes(
                                                "RENAME"
                                              )}
                                              id={
                                                "cb-upd-perms-" +
                                                contributor.id +
                                                "-rename"
                                              }
                                            >
                                              Umbenennen
                                            </Checkbox>
                                            <Checkbox
                                              defaultChecked={contributor.permissions.includes(
                                                "EXPORT"
                                              )}
                                              id={
                                                "cb-upd-perms-" +
                                                contributor.id +
                                                "-export"
                                              }
                                            >
                                              Exportieren
                                            </Checkbox>
                                            <Checkbox
                                              defaultChecked={contributor.permissions.includes(
                                                "MANAGE-CONTRIBUTORS"
                                              )}
                                              id={
                                                "cb-upd-perms-" +
                                                contributor.id +
                                                "-manage_contributors"
                                              }
                                            >
                                              Mitwirkende verwalten
                                            </Checkbox>
                                            <Button
                                              variant={"solid"}
                                              colorScheme={"blue"}
                                              onClick={async () => {
                                                const resp = await fetch(
                                                  "/api/ide/projects/contributors/permissions",
                                                  {
                                                    method: "POST",
                                                    headers: {
                                                      "Content-Type":
                                                        "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                      token:
                                                        localStorage.getItem(
                                                          "token"
                                                        ),
                                                      project: projectId,
                                                      contributor:
                                                        contributor.email,
                                                      permissions: [
                                                        "READ",
                                                        (
                                                          document.getElementById(
                                                            "cb-upd-perms-" +
                                                              contributor.id +
                                                              "-write"
                                                          ) as HTMLInputElement
                                                        ).checked
                                                          ? "WRITE"
                                                          : null,
                                                        (
                                                          document.getElementById(
                                                            "cb-upd-perms-" +
                                                              contributor.id +
                                                              "-delete"
                                                          ) as HTMLInputElement
                                                        ).checked
                                                          ? "DELETE"
                                                          : null,
                                                        (
                                                          document.getElementById(
                                                            "cb-upd-perms-" +
                                                              contributor.id +
                                                              "-duplicate"
                                                          ) as HTMLInputElement
                                                        ).checked
                                                          ? "DUPLICATE"
                                                          : null,
                                                        (
                                                          document.getElementById(
                                                            "cb-upd-perms-" +
                                                              contributor.id +
                                                              "-rename"
                                                          ) as HTMLInputElement
                                                        ).checked
                                                          ? "RENAME"
                                                          : null,
                                                        (
                                                          document.getElementById(
                                                            "cb-upd-perms-" +
                                                              contributor.id +
                                                              "-export"
                                                          ) as HTMLInputElement
                                                        ).checked
                                                          ? "EXPORT"
                                                          : null,
                                                        (
                                                          document.getElementById(
                                                            "cb-upd-perms-" +
                                                              contributor.id +
                                                              "-manage_contributors"
                                                          ) as HTMLInputElement
                                                        ).checked
                                                          ? "MANAGE-CONTRIBUTORS"
                                                          : null,
                                                      ],
                                                    }),
                                                  }
                                                );
                                                if (resp.status === 200) {
                                                  const json =
                                                    await resp.json();
                                                  let c0n: any = contributors;

                                                  c0n.contributors.find(
                                                    (c: any) =>
                                                      c.id === contributor.id
                                                  ).permissions =
                                                    json.contributor.permissions;

                                                  setContributors({
                                                    owner: contributors.owner,
                                                    contributors: [
                                                      ...c0n.contributors,
                                                    ],
                                                  });
                                                } else {
                                                  const json =
                                                    await resp.json();
                                                  toast({
                                                    title: "Fehler",
                                                    description: json.error,
                                                    position: "top",
                                                    status: "error",
                                                    variant: "solid",
                                                    isClosable: true,
                                                  });
                                                }
                                              }}
                                            >
                                              Speichern
                                            </Button>
                                          </Stack>
                                        </PopoverBody>
                                      </PopoverContent>
                                    </Popover>
                                  </>
                                ) : null}
                              </ButtonGroup>
                            </Flex>
                          </Flex>
                        </Flex>
                      </>
                    );
                  })}
                </Flex>
              </>
            ) : null}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onContributorClose}>
              Schließen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
