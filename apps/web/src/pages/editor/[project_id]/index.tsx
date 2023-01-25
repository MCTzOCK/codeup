/**
 * apps/web/src/pages/editor/[project_id]/index.tsx
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
import EditorProjectLayout from "@codeup/components/editor/EditorProjectLayout";
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
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import PopupManager from "../../../global/PopupManager";

export default function ProjectViewer() {
  const router = useRouter();

  const { loggedIn, loaded, userInfo } = useLoggedIn();

  const [reactSocket, setReactSocket] = React.useState<Socket>();
  let socket: Socket | null = null;

  const [pages, setPages] = React.useState<
    {
      _id: string;
      url: string;
      type: string;
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
            socket.on("editor:projects:pages", (data: any) => {
              if (data.success) {
                setPages(data.pages);
              } else {
                PopupManager.alert({
                  title: "Fehler",
                  description: data.error,
                });
              }
            });

            socket.emit("editor:projects:pages", {
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
          Seiten
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
                title: "Neue Seite",
                helperText: "Gib die URL der neuen Seite ein. (z.B. /about)",
              });

              if (url) {
                const type = await PopupManager.selectAsync({
                  title: "Seitentyp",
                  helperText: "Wähle den Seitentyp aus.",
                  choices: ["HTML", "InCode"],
                });

                if (type) {
                  if (reactSocket) {
                    reactSocket.emit("editor:projects:pages:create", {
                      id: router.query.project_id,
                      url: url,
                      type: type,
                    });

                    reactSocket.on(
                      "editor:projects:pages:create",
                      (data: any) => {
                        if (data.success) {
                          setPages([
                            ...pages,
                            {
                              _id: data.page._id,
                              url: data.page.url,
                              type: data.page.type,
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
                }
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
          {pages
            .filter((page) => {
              return page.url
                .toLowerCase()
                .trim()
                .includes(query.toLowerCase().trim());
            })
            .map((page) => (
              <GridItem
                key={page._id}
                bg={"gray.900"}
                p={"1rem"}
                borderRadius={"0.5rem"}
              >
                <Stack spacing={4}>
                  <Heading fontSize={"2xl"}>{page.url}</Heading>
                  <HStack gap={".4rem"} fontSize={"lg"}>
                    {page.type.toLowerCase() === "html" ? (
                      <>
                        <FaHtml5 />
                      </>
                    ) : (
                      <>
                        <FaCode />
                      </>
                    )}
                    <Text>{page.type}-Seite</Text>
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
                            "editor:projects:pages:delete",
                            (data: any) => {
                              if (data.success) {
                                setPages(
                                  pages.filter((p) => p._id !== page._id)
                                );
                              } else {
                                PopupManager.alert({
                                  title: "Fehler",
                                  description: data.error as string,
                                });
                              }
                            }
                          );

                          reactSocket.emit("editor:projects:pages:delete", {
                            projectId: router.query.project_id,
                            pageId: page._id,
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
                    onClick={async () => {
                      const newUrl = await PopupManager.promptAsync({
                        title: "Seite bearbeiten",
                        helperText: "Gib die neue URL der Seite ein.",
                      });

                      if (newUrl) {
                        if (reactSocket) {
                          reactSocket.on(
                            "editor:projects:pages:rename",
                            (data: any) => {
                              if (data.success) {
                                setPages(
                                  pages.map((p) => {
                                    if (p._id === page._id) {
                                      return {
                                        ...p,
                                        url: newUrl,
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

                          reactSocket.emit("editor:projects:pages:rename", {
                            projectId: router.query.project_id,
                            pageId: page._id,
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
                        `/editor/${router.query.project_id}/pages/${page._id}`
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
