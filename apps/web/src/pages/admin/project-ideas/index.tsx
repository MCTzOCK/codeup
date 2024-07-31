/**
 * apps/web/src/pages/admin/project-ideas/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.12.2022
 *
 */

import * as React from "react";
import { useEffect } from "react";
import { useLoggedIn } from "@codeup/hooks";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import REST from "@codeup/rest";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FaCheck, FaInfo, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { Card, CardBody, CardFooter } from "@chakra-ui/card";
import Head from "next/head";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import PopupManager from "../../../global/PopupManager";
import { sProp } from "../../../global/i18nstaticProps";

export default function Editor() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const [projectIdeas, setProjectIdeas] = React.useState<
    {
      _id: string;
      title: string;
      description: string;
      exampleDeployedURL?: string;
      exampleSourceURL?: string;
      level: string;
    }[]
  >([]);

  const [filteredProjectIdeas, setFilteredProjectIdeas] = React.useState<
    {
      _id: string;
      title: string;
      description: string;
      exampleDeployedURL?: string;
      exampleSourceURL?: string;
      level: string;
    }[]
  >([]);

  const toast = useToast();

  const reload = () => {
    REST.Admin.getProjectIdeasAdmin(
      localStorage.getItem("token") as string
    ).then((res) => {
      if (res.status === 200) {
        setProjectIdeas(res.payload.ideas);
        setFilteredProjectIdeas(res.payload.ideas);
      } else {
        toast({
          title: "Fehler",
          description: "Ein Fehler ist aufgetreten: " + res.payload.error,
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "bottom-right",
        });
      }
    });
  };

  useEffect(() => {
    if (loaded && loggedIn && userInfo?.role === "admin") {
      reload();
    }
  }, [userInfo, loggedIn, loaded]);

  const [query, setQuery] = React.useState<string>("");

  useEffect(() => {
    setFilteredProjectIdeas(
      projectIdeas.filter((idea) =>
        idea.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query]);

  return (
    <>
      <Head>
        <title>Projektideen - Admin - CodeUp</title>
      </Head>
      <AdminLayout>
        <GridLayoutV2
          pageTitle={"Projektideen"}
          search={{
            show: true,
            fields: true,
          }}
          topButtons={[
            {
              text: "Neu",
              leftIcon: <FaPlus />,
              variant: "brand",
              onClick: async () => {
                await PopupManager.alertAsync({
                  title: "Neue Projektidee",
                  description: (
                    <>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();

                          const data = new FormData(
                            e.target as HTMLFormElement
                          );

                          const title = data.get("title") as string;
                          const description = data.get("description") as string;
                          const exampleDeployedURL = data.get(
                            "exampleDeployedURL"
                          ) as string;
                          const exampleSourceURL = data.get(
                            "exampleSourceURL"
                          ) as string;
                          const level = data.get("level") as string;

                          REST.Admin.createProjectIdea({
                            token: localStorage.getItem("token") as string,
                            title,
                            description,
                            exampleDeployedURL,
                            exampleSourceURL,
                            level,
                          }).then((res) => {
                            PopupManager.removeCurrentPopup();
                            if (res.status === 200) {
                              toast({
                                title: "Erfolgreich",
                                description:
                                  "Die Projekt Idee wurde erfolgreich erstellt!",
                                status: "success",
                                duration: 1500,
                                isClosable: true,
                                position: "bottom-right",
                              });
                              reload();
                            } else {
                              toast({
                                title: "Fehler",
                                description:
                                  "Ein Fehler ist aufgetreten: " +
                                  res.payload.error,
                                status: "error",
                                duration: 1500,
                                isClosable: true,
                                position: "bottom-right",
                              });
                            }
                          });
                        }}
                      >
                        <FormControl isRequired>
                          <FormLabel>Titel</FormLabel>
                          <Input placeholder={"Titel"} name={"title"} />
                        </FormControl>
                        <FormControl isRequired mt={4}>
                          <FormLabel>Beschreibung</FormLabel>
                          <Textarea
                            placeholder={"Beschreibung"}
                            name={"description"}
                          />
                        </FormControl>
                        <FormControl isRequired mt={4}>
                          <FormLabel>Level</FormLabel>
                          <Select name={"level"}>
                            <option value={"easy"}>Einfach</option>
                            <option value={"medium"}>Mittel</option>
                            <option value={"hard"}>Schwer</option>
                          </Select>
                        </FormControl>
                        <FormControl mt={4}>
                          <FormLabel>Beispiel/Vorschau</FormLabel>
                          <Input
                            placeholder={"https://codeup.space"}
                            name={"exampleDeployedURL"}
                            type={"url"}
                          />
                        </FormControl>
                        <FormControl mt={4}>
                          <FormLabel>Beispiel/Code</FormLabel>
                          <Input
                            placeholder={"https://github.com/MCTzOCK/codeup"}
                            name={"exampleSourceURL"}
                            type={"url"}
                          />
                        </FormControl>
                        <ButtonGroup mt={4} w={"100%"}>
                          <Button
                            w={"100%"}
                            leftIcon={<FaPlus />}
                            type={"submit"}
                            variant={"brand"}
                          >
                            Erstellen
                          </Button>
                        </ButtonGroup>
                      </form>
                    </>
                  ),
                });
              },
            },
          ]}
          entries={projectIdeas.map((idea) => {
            return {
              title: idea.title,
              fields: [
                {
                  text: "ID: " + idea._id,
                  icon: <FaInfo />,
                },
                {
                  text:
                    "Level: " +
                    (idea.level === "easy"
                      ? "Einfach"
                      : idea.level === "medium"
                      ? "Mittel"
                      : "Schwer"),
                  icon: <FaInfo />,
                },
                {
                  text: idea.description,
                  icon: <FaInfo />,
                },
                {
                  text: "Deployment URL: " + idea.exampleDeployedURL || "K/A",
                  icon: <FaInfo />,
                },
                {
                  text: "Quellcode-URL: " + idea.exampleSourceURL || "K/A",
                  icon: <FaInfo />,
                },
              ],
              buttonRows: [
                [
                  {
                    text: "Bearbeiten",
                    leftIcon: <FaPen />,
                    variant: "brand",
                    onClick: async () => {
                      await PopupManager.alertAsync({
                        title: "Bearbeiten",
                        description: (
                          <>
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();

                                const data = new FormData(
                                  e.target as HTMLFormElement
                                );

                                const title = data.get("title") as string;
                                const description = data.get(
                                  "description"
                                ) as string;
                                const exampleDeployedURL = data.get(
                                  "exampleDeployedURL"
                                ) as string;
                                const exampleSourceURL = data.get(
                                  "exampleSourceURL"
                                ) as string;
                                const level = data.get("level") as string;

                                const res0 = await REST.Admin.deleteProjectIdea(
                                  {
                                    token: localStorage.getItem(
                                      "token"
                                    ) as string,
                                    id: idea._id,
                                  }
                                );

                                if (res0.status === 200) {
                                  const res1 =
                                    await REST.Admin.createProjectIdea({
                                      token: localStorage.getItem(
                                        "token"
                                      ) as string,
                                      title,
                                      description,
                                      exampleDeployedURL,
                                      exampleSourceURL,
                                      level,
                                    });

                                  PopupManager.removeCurrentPopup();

                                  if (res1.status === 200) {
                                    toast({
                                      title: "Erfolgreich",
                                      description:
                                        "Die Projekt Idee wurde erfolgreich gespeichert!",
                                      status: "success",
                                      duration: 1500,
                                      isClosable: true,
                                      position: "bottom-right",
                                    });
                                    reload();
                                  } else {
                                    toast({
                                      title: "Fehler",
                                      description:
                                        "Ein Fehler ist aufgetreten: " +
                                        res1.payload.error,
                                      status: "error",
                                      duration: 1500,
                                      isClosable: true,
                                      position: "bottom-right",
                                    });
                                  }
                                } else {
                                  toast({
                                    title: "Fehler",
                                    description:
                                      "Ein Fehler ist aufgetreten: " +
                                      res0.payload.error,
                                    status: "error",
                                    duration: 1500,
                                    isClosable: true,
                                    position: "bottom-right",
                                  });
                                }
                              }}
                            >
                              <FormControl isRequired>
                                <FormLabel>Titel</FormLabel>
                                <Input
                                  placeholder={"Titel"}
                                  name={"title"}
                                  defaultValue={idea.title}
                                />
                              </FormControl>
                              <FormControl isRequired mt={4}>
                                <FormLabel>Beschreibung</FormLabel>
                                <Textarea
                                  defaultValue={idea.description}
                                  placeholder={"Beschreibung"}
                                  name={"description"}
                                />
                              </FormControl>
                              <FormControl isRequired mt={4}>
                                <FormLabel>Level</FormLabel>
                                <Select name={"level"}>
                                  <option
                                    value={"easy"}
                                    selected={idea.level === "easy"}
                                  >
                                    Einfach
                                  </option>
                                  <option
                                    value={"medium"}
                                    selected={idea.level === "medium"}
                                  >
                                    Mittel
                                  </option>
                                  <option
                                    value={"hard"}
                                    selected={idea.level === "hard"}
                                  >
                                    Schwer
                                  </option>
                                </Select>
                              </FormControl>
                              <FormControl mt={4}>
                                <FormLabel>Beispiel/Vorschau</FormLabel>
                                <Input
                                  placeholder={"https://codeup.space"}
                                  name={"exampleDeployedURL"}
                                  type={"url"}
                                  defaultValue={idea.exampleDeployedURL}
                                />
                              </FormControl>
                              <FormControl mt={4}>
                                <FormLabel>Beispiel/Code</FormLabel>
                                <Input
                                  placeholder={
                                    "https://github.com/MCTzOCK/codeup"
                                  }
                                  name={"exampleSourceURL"}
                                  type={"url"}
                                  defaultValue={idea.exampleSourceURL}
                                />
                              </FormControl>
                              <ButtonGroup mt={4} w={"100%"}>
                                <Button
                                  w={"100%"}
                                  leftIcon={<FaCheck />}
                                  type={"submit"}
                                  variant={"brand"}
                                >
                                  Abschließen
                                </Button>
                              </ButtonGroup>
                            </form>
                          </>
                        ),
                      });
                    },
                  },
                  {
                    text: "Löschen",
                    leftIcon: <FaTrash />,
                    colorScheme: "red",
                    onClick: async () => {
                      REST.Admin.deleteProjectIdea({
                        token: localStorage.getItem("token") as string,
                        id: idea._id,
                      }).then((res) => {
                        if (res.status === 200) {
                          toast({
                            title: "Erfolgreich",
                            description:
                              "Die Projekt Idee wurde erfolgreich gelöscht!",
                            status: "success",
                            duration: 1500,
                            isClosable: true,
                            position: "bottom-right",
                          });
                          reload();
                        } else {
                          toast({
                            title: "Fehler",
                            description:
                              "Ein Fehler ist aufgetreten: " +
                              res.payload.error,
                            status: "error",
                            duration: 1500,
                            isClosable: true,
                            position: "bottom-right",
                          });
                        }
                      });
                    },
                  },
                ],
              ],
            };
          })}
        />
      </AdminLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, [])),
  };
}
