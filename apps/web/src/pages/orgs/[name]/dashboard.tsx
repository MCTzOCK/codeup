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
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaCogs, FaInfo, FaPlus } from "react-icons/fa";
import PopupManager from "../../../global/PopupManager";

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

  const [templates, setTemplates] = React.useState<
    {
      name: string;
      projectId: string;
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
        reloadTemplates();
      } else {
        setError(data.payload.error);
      }
    });
  }, [router, loggedIn, loaded]);

  const reloadTemplates = async () => {
    const templateRes = await REST.Orgs.getOrgTemplates({
      token: AccountManager.getActiveToken(),
      org: router.query.name as string,
    });

    if (templateRes.status === 200) {
      setTemplates(templateRes.payload.templates);
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
            mt={"2rem"}
            justifyContent={"center"}
            alignItems={"center"}
            w={"100%"}
            minH={"100%"}
            h={"fit-content"}
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
                <Heading size="2xl" textAlign={"center"}>
                  {org.name}
                </Heading>
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
                <Heading>Kurse</Heading>
                <Heading>Projektvorlagen</Heading>
                <StackDivider />
                <StackDivider />
                <StackDivider />
                <Stack>
                  {org.owner === userInfo.id ? (
                    <>
                      <Box
                        p={6}
                        backgroundColor={"gray.700"}
                        rounded={"xl"}
                        userSelect={"none"}
                        cursor={"pointer"}
                        boxShadow={"xl"}
                        onClick={async () => {
                          const projectsRes = await REST.Editor.getProjectsV2(
                            AccountManager.getActiveToken()
                          );

                          if (projectsRes.status === 200) {
                            const projects: any[] =
                              projectsRes.payload.projects;

                            const choice = await PopupManager.selectAsync({
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

                            const templateRes = await REST.Orgs.addOrgTemplate({
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
                      >
                        <Heading
                          fontSize={"4xl"}
                          color={"blue.300"}
                          alignItems={"center"}
                          display={"flex"}
                          gap={4}
                        >
                          <FaPlus />
                          Neue Vorlage
                        </Heading>
                      </Box>

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
                  {templates.map((template) => {
                    return (
                      <Box
                        p={6}
                        backgroundColor={"gray.700"}
                        rounded={"xl"}
                        userSelect={"none"}
                        cursor={"pointer"}
                        boxShadow={"xl"}
                        onClick={async () => {
                          const name = await PopupManager.promptAsync({
                            title: "Neues Projekt",
                            helperText: "Gib einen Namen für das Projekt ein.",
                          });

                          if (!name) return;

                          const useRes = await REST.Orgs.useOrgTemplate({
                            token: AccountManager.getActiveToken(),
                            org: org.name,
                            projectId: template._id,
                            name,
                          });

                          if (useRes.status === 200) {
                            router.push(
                              "/editor/" + useRes.payload.project._id
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
                        <Heading
                          fontSize={"4xl"}
                          color={"blue.300"}
                          alignItems={"center"}
                          display={"flex"}
                          gap={4}
                        >
                          {template.name}
                        </Heading>
                      </Box>
                    );
                  })}
                </Stack>
              </Stack>
            </Box>
          </Flex>
        </>
      )}
    </>
  );
}
