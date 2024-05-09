/**
 * apps/web/src/pages/orgs/[name]/dashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.03.2023
 *
 */

import * as React from "react";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useLoggedIn } from "@codeup/hooks";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import REST from "@codeup/rest";
import AccountManager from "@codeup/util/dist/AccountManager";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Stack,
  StackDivider,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { FaCogs, FaInfo, FaPlus, FaTrash } from "react-icons/fa";
import PopupManager from "../../../global/PopupManager";
import { CHeading } from "@codeup/components/dist/global/CHeading";

export default function Dashboard() {
  const router = useRouter();
  const { loggedIn, loaded, userInfo } = useLoggedIn();
  const [org, setOrg] = React.useState<{
    owner: string;
    name: string;
    members: string[];
    icon: string;
    subscription: string;
    createdAt: string;
    _id: string;
  }>();
  const [blogs, setBlogs] = React.useState<
    {
      title: string;
      content: string;
      createdAt: string;
      _id: string;
    }[]
  >([]);

  const [error, setError] = React.useState<string>();

  useEffect(() => {
    if (!router || !router.query || !router.query.name) {
      return;
    }

    if (!loaded) return;

    if (!loggedIn) {
      router.push("/#login");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
      return;
    }

    REST.Orgs.getOrg({
      token: AccountManager.getActiveToken(),
      name: router.query.name as string,
    }).then(async (data) => {
      if (data.status === 200) {
        setOrg(data.payload.org);
        reloadBlogs();
        reloadTemplates();
        reloadCourses(data.payload.org);
      } else {
        setError(data.payload.error);
      }
    });
  }, [router, loggedIn, loaded]);

  const [templates, setTemplates] = React.useState<
    {
      name: string;
      projectId: string;
      _id: string;
    }[]
  >([]);

  const [courses, setCourses] = React.useState<
    {
      _id: string;
      name: string;
      friendlyName: string;
      description: string;
      splashImage: string;
      available: string;
      contentPositions: string[];
      creator: string;
      createdAt: string;
      __v: number;
    }[]
  >([]);

  const reloadTemplates = async () => {
    const templateRes = await REST.Orgs.getOrgTemplates({
      token: AccountManager.getActiveToken(),
      org: router.query.name as string,
    });

    if (templateRes.status === 200) {
      setTemplates(templateRes.payload.templates);
    }
  };

  const reloadBlogs = async () => {
    const blogRes = await REST.Orgs.getBlogs({
      token: AccountManager.getActiveToken(),
      org: router.query.name as string,
    });

    if (blogRes.status === 200) {
      const sortedBlogs = blogRes.payload.blogs.sort((a: any, b: any) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      setBlogs(sortedBlogs);
    }
  };

  const reloadCourses = async (org: any) => {
    const allCourses = await REST.Course.listCourses({
      token: AccountManager.getActiveToken(),
    });

    if (allCourses.status === 200) {
      const courses = allCourses.payload.courses
        .filter((course: any) => {
          return course.available === "org:" + org._id;
        })
        .map((c: any) => {
          c.contentPositions = c.contentPositions.filter(
            (x: any) => x !== "false"
          );
          return c;
        });
      setCourses(courses);
    }
  };

  if (error) {
    return (
      <>
        <ErrorComponent description={error} title={"Fehler"} />
      </>
    );
  }

  return (
    <>
      {!org ? (
        <>
          <AuthenticateLoadingIndicator />
        </>
      ) : (
        <>
          <Flex
            direction={"column"}
            pt={"2rem"}
            alignItems={"center"}
            w={"100%"}
            minH={"100vh"}
            h={"fit-content"}
            bg={"#000"}
          >
            <Box
              w={["100%", "75%"]}
              backgroundColor={"black"}
              p={4}
              rounded={"xl"}
              boxShadow={"xl"}
            >
              {org.owner === userInfo.id ? (
                <>
                  <Flex
                    w={"100%"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Heading color={"red.400"} size={"md"}>
                      Organisations Administrator
                    </Heading>
                    <Text></Text>
                    <IconButton
                      aria-label={"Verwalten"}
                      icon={<FaCogs />}
                      colorScheme={"red"}
                      onClick={() => {
                        router.push("/orgs/" + org.name + "/manage");
                      }}
                    />
                  </Flex>
                  <Divider mt={2} mb={2} backgroundColor={"red"} />
                </>
              ) : null}
              <Stack>
                <Box textAlign={"center"}>
                  <CHeading size="2xl">{org.name}</CHeading>
                </Box>
                <StackDivider />
                <Flex
                  w={"100%"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Accordion
                    maxW={["100%", "20%"]}
                    w={["100%", "20%"]}
                    allowToggle
                  >
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex={1} textAlign={"left"}>
                            Informationen
                          </Box>
                          <FaInfo />
                        </AccordionButton>
                      </h2>

                      <AccordionPanel pb={4}>
                        <Text fontSize={"md"}>
                          Mitglieder: {org.members.length}
                        </Text>
                        <Text fontSize={"md"}>
                          Erstellt am:{" "}
                          {new Date(org.createdAt).toLocaleString()}
                        </Text>
                        <Text fontSize={"md"}>
                          Abonnement: {org.subscription}
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Flex>
                <StackDivider />
                <Tabs
                  w={"100%"}
                  variant={"enclosed-colored"}
                  isFitted
                  colorScheme={"brand"}
                >
                  <TabList w={"100%"}>
                    <Tab>Mitteilungen</Tab>
                    <Tab>Vorlagen</Tab>
                    <Tab>Kurse</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <Flex
                        w={"100%"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        mb={4}
                      >
                        <Heading>Neuste Meldungen</Heading>
                        <i></i>
                        {org.owner === userInfo.id ? (
                          <Button
                            variant={"brand"}
                            leftIcon={<FaPlus />}
                            onClick={async () => {
                              const title = await PopupManager.promptAsync({
                                title: "Titel der Meldung",
                                helperText:
                                  "Gib einen Titel für die Meldung ein",
                              });

                              if (!title) return;

                              const content = await PopupManager.promptAsync({
                                title: "Inhalt der Meldung",
                                helperText:
                                  "Gib einen Inhalt für die Meldung ein",
                                inputType: "TEXTAREA",
                              });

                              if (!content) return;

                              const res = await REST.Orgs.createBlog({
                                token: AccountManager.getActiveToken(),
                                org: org.name,
                                title,
                                content,
                              });

                              if (res.status === 200) {
                                reloadBlogs();
                              } else {
                                PopupManager.alertAsync({
                                  title: "Fehler",
                                  description:
                                    "Die Meldung konnte nicht erstellt werden: " +
                                    res.payload.error,
                                });
                              }
                            }}
                          >
                            Neue Meldung
                          </Button>
                        ) : null}
                      </Flex>
                      {blogs.length > 0 ? (
                        blogs.map((blog) => {
                          return (
                            <Accordion allowToggle>
                              <AccordionItem>
                                <h2>
                                  <AccordionButton>
                                    <Box as="span" flex={1} textAlign={"left"}>
                                      {new Date(
                                        blog.createdAt
                                      ).toLocaleString()}
                                      &nbsp;-&nbsp;
                                      {blog.title}
                                    </Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                  <Text fontSize={"md"}>{blog.content}</Text>
                                </AccordionPanel>
                              </AccordionItem>
                            </Accordion>
                          );
                        })
                      ) : (
                        <Text>Keine Meldungen vorhanden</Text>
                      )}
                    </TabPanel>
                    <TabPanel>
                      <Stack>
                        {org.owner === userInfo.id ? (
                          <>
                            <Flex w={"100%"} justifyContent={"flex-end"}>
                              <Button
                                onClick={async () => {
                                  const projectsRes =
                                    await REST.Editor.getProjectsV2(
                                      AccountManager.getActiveToken()
                                    );

                                  if (projectsRes.status === 200) {
                                    const projects: any[] =
                                      projectsRes.payload.projects;

                                    const choice =
                                      await PopupManager.selectAsync({
                                        title: "Projekt auswählen",
                                        helperText:
                                          "Wähle ein Projekt aus, welches als Vorlage verwendet werden soll.",
                                        choices: projects.map((project) => {
                                          return project.name;
                                        }),
                                      });

                                    if (!choice) return;

                                    const project = projects.find(
                                      (project) => project.name === choice
                                    );

                                    const templateRes =
                                      await REST.Orgs.addOrgTemplate({
                                        token: AccountManager.getActiveToken(),
                                        org: org.name,
                                        projectId: project._id,
                                      });

                                    if (templateRes.status === 200) {
                                      reloadTemplates();
                                    } else {
                                      PopupManager.alert({
                                        title: "Fehler",
                                        description:
                                          "Projekt konnte nicht als Vorlage hinzugefügt werden: " +
                                          templateRes.payload.error,
                                      });
                                    }
                                  } else {
                                    PopupManager.alert({
                                      title: "Fehler",
                                      description:
                                        "Projekte konnten nicht geladen werden: " +
                                        projectsRes.payload.error,
                                    });
                                  }
                                }}
                                variant={"brand"}
                                leftIcon={<FaPlus />}
                              >
                                Projekt hinzufügen
                              </Button>
                            </Flex>

                            <StackDivider />
                          </>
                        ) : null}
                        {templates.length === 0 && (
                          <>
                            <Text
                              textAlign={"center"}
                              color={"red.300"}
                              fontSize={"lg"}
                            >
                              In dieser Organisation gibt es noch keine
                              veröffentlichten Vorlagen.
                            </Text>
                          </>
                        )}

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
                          {templates.map((template) => {
                            return (
                              <>
                                <GridItem
                                  key={"new"}
                                  bg={"gray.700"}
                                  p={"1rem"}
                                  borderRadius={"0.5rem"}
                                >
                                  <Stack>
                                    <Heading textAlign={"center"} size={"lg"}>
                                      {template.name}
                                    </Heading>
                                    <StackDivider />
                                    <StackDivider />
                                    <Button
                                      variant={"brand"}
                                      leftIcon={<FaPlus />}
                                      onClick={async (e) => {
                                        if (e.target !== e.currentTarget)
                                          return;

                                        const name =
                                          await PopupManager.promptAsync({
                                            title: "Neues Projekt",
                                            helperText:
                                              "Gib einen Namen für das Projekt ein.",
                                          });

                                        if (!name) return;

                                        const useRes =
                                          await REST.Orgs.useOrgTemplate({
                                            token:
                                              AccountManager.getActiveToken(),
                                            org: org.name,
                                            projectId: template._id,
                                            name,
                                          });

                                        if (useRes.status === 200) {
                                          router.push(
                                            "/editor/" +
                                              useRes.payload.project._id
                                          );
                                        } else {
                                          PopupManager.alert({
                                            title: "Fehler",
                                            description:
                                              "Projekt konnte nicht erstellt werden: " +
                                              useRes.payload.error,
                                          });
                                        }
                                      }}
                                    >
                                      Verwenden
                                    </Button>
                                    {org.owner === userInfo.id ? (
                                      <>
                                        <Button
                                          colorScheme={"red"}
                                          leftIcon={<FaTrash />}
                                          onClick={async () => {
                                            if (
                                              await PopupManager.confirmAsync({
                                                title: "Vorlage löschen",
                                                question:
                                                  "Bist du dir sicher, dass du diese Vorlage löschen möchtest? Dies kann nicht rückgängig gemacht werden.",
                                              })
                                            ) {
                                              const r =
                                                await REST.Orgs.removeOrgTemplate(
                                                  {
                                                    token:
                                                      AccountManager.getActiveToken(),
                                                    projectId: template._id,
                                                    org: org.name,
                                                  }
                                                );

                                              if (r.status === 200) {
                                                reloadTemplates();
                                              } else {
                                                PopupManager.alert({
                                                  title: "Fehler",
                                                  description:
                                                    "Vorlage konnte nicht gelöscht werden: " +
                                                    r.payload.error,
                                                });
                                              }
                                            }
                                          }}
                                        >
                                          Entfernen
                                        </Button>
                                      </>
                                    ) : null}
                                  </Stack>
                                </GridItem>
                              </>
                            );
                          })}
                        </Grid>
                      </Stack>
                    </TabPanel>
                    <TabPanel>
                      <TableContainer>
                        <Table>
                          <Thead>
                            <Tr>
                              <Th></Th>
                              <Th>Name</Th>
                              <Th>Creator</Th>
                              <Th>Beschreibung</Th>
                              <Th>Lektionen</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {courses.map((c) => {
                              return (
                                <>
                                  <Tr
                                    onClick={() => {
                                      router.push("/course/" + c.friendlyName);
                                    }}
                                    cursor={"pointer"}
                                    _hover={{
                                      bg: "gray.700",
                                    }}
                                  >
                                    <Td>
                                      <Image w={"100px"} src={c.splashImage} />
                                    </Td>
                                    <Td>{c.friendlyName}</Td>
                                    <Td>@{c.creator}</Td>
                                    <Td>{c.description}</Td>
                                    <Td>{c.contentPositions.length}</Td>
                                  </Tr>
                                </>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Stack>
            </Box>
          </Flex>
        </>
      )}
    </>
  );
}
