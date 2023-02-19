/**
 * apps/web/src/pages/editor/[project_id]/functions/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.01.2023
 *
 */

import * as React from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/router";
import { useLoggedIn } from "@codeup/hooks";
import EditorProjectLayout from "@codeup/components/dist/editor/EditorProjectLayout";
import {
  Button,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  FaCode,
  FaEdit,
  FaHtml5,
  FaLink,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import PopupManager from "../../../../global/PopupManager";

export default function ProjectfunctionsViewer() {
  const router = useRouter();

  const { loggedIn, loaded, userInfo } = useLoggedIn();

  const [reactSocket, setReactSocket] = React.useState<Socket>();
  let socket: Socket | null = null;

  const [functions, setFunctions] = React.useState<
    {
      _id: string;
      path: string;
    }[]
  >([]);

  const [query, setQuery] = React.useState<string>("");

  React.useEffect(() => {
    if (loaded) {
      if (!loggedIn) {
        router.push("/#login");
        window.dispatchEvent(new CustomEvent("codeup::open_login"));
      } else {
        if (router.query.project_id) {
          socket = io();
          setReactSocket(socket);
          registerSocket();
        }
      }
    }
  }, [loggedIn, userInfo, loaded, router]);

  const registerSocket = () => {
    if (socket) {
      socket.on("authenticate", (data: any) => {
        if (data.authenticated) {
          if (socket) {
            socket.on("editor:projects:functions", (data: any) => {
              if (data.success) {
                setFunctions(data.functions);
              } else {
                PopupManager.alert({
                  title: "Fehler",
                  description: data.error,
                });
              }
            });

            socket.emit("editor:projects:functions", {
              id: router.query.project_id,
            });
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

  return (
    <>
      <EditorProjectLayout>
        <Heading textAlign={"center"} size={"2xl"} mt={8}>
          Serverless
        </Heading>

        <Flex justifyContent={"center"} mt={8}>
          <FormControl w={["75%", "45%"]}>
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
              const url = await PopupManager.promptAsync({
                title: "Neue Funktion",
                helperText:
                  "Gib die URL der Funktion an. (z.B. account/login)",
              });


              if (reactSocket) {
                reactSocket.emit("editor:projects:functions:create", {
                  id: router.query.project_id,
                  url: "/" + url,
                });

                reactSocket.on(
                  "editor:projects:functions:create",
                  (data: any) => {
                    if (data.success) {
                      setFunctions([
                        ...functions,
                        {
                          _id: data.function._id,
                          path: data.function.path,
                        },
                      ]);
                    } else {
                      PopupManager.alert({
                        title: "Fehler",
                        description: data.error as string,
                      });
                    }
                  }
                );
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
          {functions
            .filter((func) => {
              return func.path
                .toLowerCase()
                .trim()
                .includes(query.toLowerCase().trim());
            })
            .map((func) => (
              <GridItem
                key={func._id}
                bg={"gray.900"}
                p={"1rem"}
                borderRadius={"0.5rem"}
              >
                <Stack spacing={4}>
                  <Heading fontSize={"2xl"}>
                    {func.path}
                  </Heading>
                  <HStack gap={".4rem"} fontSize={"lg"}>
                  </HStack>
                  <Button
                    w={"100%"}
                    colorScheme={"red"}
                    onClick={async () => {
                      if (
                        await PopupManager.confirmAsync({
                          title: "Seite löschen",
                          question: "Möchtest du diese Seite wirklich löschen?",
                        })
                      ) {
                        if (reactSocket) {
                          reactSocket.on(
                            "editor:projects:functions:delete",
                            (data: any) => {
                              if (data.success) {
                                setFunctions(
                                  functions.filter((p) => p._id !== func._id)
                                );
                              } else {
                                PopupManager.alert({
                                  title: "Fehler",
                                  description: data.error as string,
                                });
                              }
                            }
                          );

                          reactSocket.emit("editor:projects:functions:delete", {
                            projectId: router.query.project_id,
                            pageId: func._id,
                          });
                        }
                      }
                    }}
                    leftIcon={<FaTrash />}
                  >
                    Löschen
                  </Button>
                  <Button
                    w={"100%"}
                    colorScheme={"green"}
                    leftIcon={<FaLink />}
                    onClick={async () => {
                      let newUrl = await PopupManager.promptAsync({
                        title: "Seite bearbeiten",
                        helperText: "Gib die neue URL der Seite ein.",
                      });

                      if (newUrl) {

                        newUrl = ["/api/", newUrl].join("");

                        if (reactSocket) {
                          reactSocket.on(
                            "editor:projects:functions:rename",
                            (data: any) => {
                              if (data.success) {
                                setFunctions(
                                  functions.map((p) => {
                                    if (p._id === func._id) {
                                      return {
                                        ...p,
                                        path: newUrl,
                                      };
                                    } else {
                                      return p;
                                    }
                                  })
                                );
                              } else {
                                PopupManager.alert({
                                  title: "Fehler",
                                  description: data.error as string,
                                });
                              }
                            }
                          );

                          reactSocket.emit("editor:projects:functions:rename", {
                            projectId: router.query.project_id,
                            pageId: func._id,
                            newUrl,
                          });
                        }
                      }
                    }}
                  >
                    URL Ändern
                  </Button>
                  <Button
                    w={"100%"}
                    colorScheme={"blue"}
                    onClick={() => {
                      router.push(
                        `/editor/${router.query.project_id}/serverless/${func._id}`
                      );
                    }}
                    leftIcon={<FaEdit />}
                  >
                    Bearbeiten
                  </Button>
                </Stack>
              </GridItem>
            ))}
        </Grid>
      </EditorProjectLayout>
    </>
  );
}
