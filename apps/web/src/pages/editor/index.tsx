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
  Button,
  ButtonGroup,
  CircularProgress,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { io, Socket } from "socket.io-client";
import {
  FaClock,
  FaEye,
  FaPen,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUsers,
} from "react-icons/fa";
import CollaboratorManager from "@codeup/components/editor/CollaboratorManager";
import PopupManager from "../../global/PopupManager";

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

  const whatEverRef = React.useRef();

  const [editProjectPropID, setEditProjectPropID] = React.useState<
    string | null
  >(null);

  const [query, setQuery] = React.useState<string>("");

  return (
    <>
      {loggedIn ? (
        <>
          <Heading textAlign={"center"} size={"2xl"} mt={8}>
            Projekte
          </Heading>

          <Flex justifyContent={"center"} mt={8}>
            <FormControl w={["75%", "25%"]}>
              <InputGroup>
                <InputLeftElement>
                  <FaSearch />
                </InputLeftElement>
                <Input
                  placeholder={"Suche"}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                />
              </InputGroup>
            </FormControl>
          </Flex>

          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(4, 1fr)",
              "repeat(5, 1fr)",
            ]}
            gap={6}
            p={4}
            mt={"2rem"}
          >
            <GridItem
              key={"new"}
              bg={"gray.900"}
              p={"1rem"}
              borderRadius={"0.5rem"}
              _hover={{
                cursor: "pointer",
                borderColor: "blue.300",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
              onClick={async () => {
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
              }}
            >
              <Heading
                fontSize={"8xl"}
                textAlign={"center"}
                color={"blue.300"}
                alignItems={"center"}
                justifyContent={"center"}
                display={"flex"}
                h={"100%"}
              >
                <FaPlus />
              </Heading>
            </GridItem>
            {projects
              .filter((project) => {
                return project.name
                  .toLowerCase()
                  .trim()
                  .includes(query.toLowerCase().trim());
              })
              .sort((a, b) => {
                return (
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
                );
              })
              .map((project) => (
                <GridItem
                  key={project.id}
                  bg={"gray.900"}
                  p={"1rem"}
                  borderRadius={"0.5rem"}
                >
                  <Stack spacing={4}>
                    <Heading fontSize={"2xl"}>{project.name}</Heading>
                    <Text
                      fontSize={"xl"}
                      display={"flex"}
                      alignItems={"center"}
                      gap={3}
                    >
                      <FaClock />
                      {new Date(project.updated_at).toLocaleString()}
                    </Text>

                    <Button
                      leftIcon={<FaTrash />}
                      textAlign={"left"}
                      colorScheme={"red"}
                      w={"100%"}
                      onClick={async () => {
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
                      }}
                    >
                      Löschen
                    </Button>
                    <Button
                      leftIcon={<FaEye />}
                      textAlign={"left"}
                      justifyContent={"left"}
                      colorScheme={"blue"}
                      w={"100%"}
                      onClick={() => {
                        router.push(`/editor/${project._id}`);
                      }}
                    >
                      Öffnen
                    </Button>
                    <ButtonGroup w={"100%"}>
                      <Button
                        leftIcon={<FaPen />}
                        textAlign={"left"}
                        justifyContent={"left"}
                        colorScheme={"green"}
                        w={"100%"}
                        onClick={async () => {
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
                        }}
                      >
                        Umbenennen
                      </Button>
                      <Button
                        leftIcon={<FaUsers />}
                        textAlign={"left"}
                        justifyContent={"left"}
                        colorScheme={"yellow"}
                        w={"100%"}
                        onClick={() => {
                          setEditProjectPropID(project._id);
                          onCollabOpen();
                        }}
                      >
                        Mitwirkende
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </GridItem>
              ))}
          </Grid>
        </>
      ) : (
        <>
          <Flex
            w={"100%"}
            h={"100vh"}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"column"}
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
