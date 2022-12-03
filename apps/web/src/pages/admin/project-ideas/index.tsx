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
import { useLoggedIn } from "@codeup/hooks";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import { useEffect } from "react";
import REST from "@codeup/rest";
import {
  Heading,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  IconButton,
  Portal,
  Flex,
  Button,
  FormControl,
  Input,
  FormLabel,
  Textarea,
  ButtonGroup,
  Grid,
  Stack,
  Text,
  Divider,
  Link,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/card";

export default function Editor() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const [projectIdeas, setProjectIdeas] = React.useState<
    {
      _id: string;
      title: string;
      description: string;
      exampleDeployedURL?: string;
      exampleSourceURL?: string;
    }[]
  >([]);

  const toast = useToast();

  const reload = () => {
    REST.Admin.getProjectIdeasAdmin(
      localStorage.getItem("token") as string
    ).then((res) => {
      if (res.status === 200) {
        setProjectIdeas(res.payload.ideas);
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

  return (
    <>
      <AdminLayout>
        <Flex
          w={"100%"}
          mt={"2rem"}
          alignItems={"center"}
          justifyContent={"center"}
          direction={"column"}
        >
          <Heading size={"2xl"} textAlign={"center"} mt={"2rem"}>
            Projektideen
          </Heading>
          <Popover>
            <PopoverTrigger>
              <Button leftIcon={<FaPlus />} colorScheme={"green"} mt={"2rem"}>
                Neu
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent bgColor={"black"}>
                <PopoverArrow bgColor={"black"} />
                <PopoverCloseButton />
                <PopoverBody>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();

                      const data = new FormData(e.target as HTMLFormElement);

                      const title = data.get("title") as string;
                      const description = data.get("description") as string;
                      const exampleDeployedURL = data.get(
                        "exampleDeployedURL"
                      ) as string;
                      const exampleSourceURL = data.get(
                        "exampleSourceURL"
                      ) as string;

                      REST.Admin.createProjectIdea({
                        token: localStorage.getItem("token") as string,
                        title,
                        description,
                        exampleDeployedURL,
                        exampleSourceURL,
                      }).then((res) => {
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
                        colorScheme={"green"}
                      >
                        Erstellen
                      </Button>
                    </ButtonGroup>
                  </form>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
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
          p={10}
        >
          {projectIdeas.map((idea) => (
            <>
              <Card
                maxW="sm"
                h={"100%"}
                bgColor={"black"}
                rounded={"xl"}
                boxShadow={"xl"}
                p={5}
                id={"_card_" + idea._id}
              >
                <CardBody>
                  <Stack mt={2} spacing="3">
                    <Heading size="md">{idea.title}</Heading>
                    <Text>{idea.description}</Text>
                    <Text color={"blue.400"}>
                      {idea.exampleDeployedURL || ""}
                    </Text>
                    <Text color={"blue.400"}>
                      {idea.exampleSourceURL || ""}
                    </Text>
                  </Stack>
                </CardBody>
                <CardFooter mt={4}>
                  <ButtonGroup spacing="2">
                    <Popover>
                      <PopoverTrigger>
                        <Button variant="solid" colorScheme="blue">
                          Bearbeiten
                        </Button>
                      </PopoverTrigger>
                      <Portal>
                        <PopoverContent bgColor={"black"}>
                          <PopoverArrow bgColor={"black"} />
                          <PopoverCloseButton />
                          <PopoverBody>
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
                                    });

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
                                    // close popover
                                    document
                                      .getElementById("_card_" + idea._id)!
                                      .querySelector("button")!
                                      .click();
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
                                  leftIcon={<FaPlus />}
                                  type={"submit"}
                                  colorScheme={"green"}
                                >
                                  Abschließen
                                </Button>
                              </ButtonGroup>
                            </form>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                    <Button
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
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
                      }}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            </>
          ))}
        </Grid>
      </AdminLayout>
    </>
  );
}
