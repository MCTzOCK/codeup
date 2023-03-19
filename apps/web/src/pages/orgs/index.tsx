/**
 * apps/web/src/pages/orgs/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.03.2023
 *
 */

import * as React from "react";
import { useEffect } from "react";
import { useLoggedIn } from "@codeup/hooks";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import REST from "@codeup/rest";
import AccountManager from "@codeup/util/src/AccountManager";
import PopupManager from "../../global/PopupManager";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import {
  FaCogs,
  FaDoorOpen,
  FaExternalLinkAlt,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

export default function Index() {
  const { loggedIn, loaded, userInfo } = useLoggedIn();
  const [query, setQuery] = React.useState<string>("");
  const router = useRouter();

  const [orgs, setOrgs] = React.useState<
    {
      owner: string;
      name: string;
      members: string[];
      icon: string;
      subscription: string;
      createdAt: string;
      _id: string;
    }[]
  >([]);

  useEffect(() => {
    if (loaded && loggedIn) {
      REST.Orgs.getOrgs(AccountManager.getActiveToken()).then((r) => {
        if (r.status === 200) {
          setOrgs(r.payload.orgs);
        } else {
          PopupManager.alert({
            title: "Fehler",
            description:
              "Organisationen konnten nicht geladen werden: " + r.payload.error,
          });
        }
      });
    } else if (loaded && !loggedIn) {
      router.push("/#login");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    }
  }, [loaded]);

  if (!loaded)
    return (
      <>
        <AuthenticateLoadingIndicator />
      </>
    );

  return (
    <>
      <Flex
        w={"100%"}
        h={"fit-content"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        mt={4}
      >
        <Heading>Organisationen</Heading>
        <Box
          w={["100%", "75%", "50%"]}
          h={"100%"}
          p={4}
          mt={4}
          overflow={"auto"}
        >
          <Flex w={"100%"} direction={"row"} gap={4}>
            <InputGroup w={"100%"}>
              <InputLeftElement>
                <FaSearch />
              </InputLeftElement>
              <Input
                placeholder={"Suche nach Organisationen"}
                onChange={(e) => {
                  setQuery(e.target.value.trim());
                }}
              />
            </InputGroup>
            <Button
              colorScheme={"blue"}
              onClick={async () => {
                const name = await PopupManager.promptAsync({
                  title: "Neue Organisation",
                  helperText: "Gib den Namen der Organisation ein.",
                });

                const res = await REST.Orgs.createOrg({
                  token: AccountManager.getActiveToken(),
                  name: name,
                });

                if (res.status === 200) {
                  PopupManager.alert({
                    title: "Erfolg",
                    description: "Die Organisation wurde erfolgreich erstellt.",
                  });
                  setOrgs([...orgs, res.payload.org]);
                } else {
                  PopupManager.alert({
                    title: "Fehler",
                    description:
                      "Die Organisation konnte nicht erstellt werden: " +
                      res.payload.error,
                  });
                }
              }}
            >
              Neu
            </Button>
          </Flex>
          {orgs
            .filter((org) =>
              org.name.toLowerCase().includes(query.toLowerCase())
            )
            .map((org, i) => (
              <Flex
                key={i}
                w={"100%"}
                h={"100%"}
                p={4}
                mt={4}
                overflow={"auto"}
                justifyContent={"space-between"}
                alignItems={"center"}
                flexDirection={["column", "row"]}
                bg={"black"}
                borderRadius={"md"}
                shadow={"xl"}
                onClick={(e) => {
                  if (e.target !== e.currentTarget) return;

                  router.push("/orgs/" + org.name + "/dashboard");
                }}
                cursor={"pointer"}
              >
                <Flex
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"row"}
                >
                  <chakra.img
                    src={org.icon}
                    w={"50px"}
                    h={"50px"}
                    objectFit={"cover"}
                    borderRadius={"50%"}
                    mr={4}
                  />
                  <Flex
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"column"}
                  >
                    <Heading size={"md"}>{org.name}</Heading>
                  </Flex>
                </Flex>
                <Flex
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"row"}
                  gap={2}
                >
                  {org.owner === userInfo?.id ? (
                    <>
                      <Text color={"red.300"}>Von dir verwaltet</Text>
                      <ButtonGroup isAttached>
                        <IconButton
                          aria-label={"Verwalten"}
                          icon={<FaCogs />}
                          onClick={() => {
                            router.push("/orgs/" + org.name + "/manage");
                          }}
                          variant={"ghost"}
                          colorScheme={"blue"}
                        />
                        <IconButton
                          aria-label={"Löschen"}
                          icon={<FaTrash />}
                          onClick={async () => {
                            if (
                              await PopupManager.confirmAsync({
                                title: org.name + " löschen",
                                question:
                                  "Bist du dir sicher, dass du diese Organisation löschen möchtest? Dieser Vorgang kann nicht rückgängig gemacht werden. Alle Daten werden unwiederbringlich gelöscht. Alle Mitglieder werden aus der Organisation entfernt. Alle Projekte werden gelöscht.",
                              })
                            ) {
                              if (
                                (await PopupManager.promptAsync({
                                  title: "Bestätigung",
                                  helperText:
                                    "Gib den Namen der Organisation ein, um sie zu löschen.",
                                })) !== org.name
                              )
                                return PopupManager.alert({
                                  title: "Fehler",
                                  description:
                                    "Der Name der Organisation ist nicht korrekt.",
                                });

                              const res = await REST.Orgs.deleteOrg({
                                token: AccountManager.getActiveToken(),
                                name: org.name,
                              });

                              if (res.status === 200) {
                                PopupManager.alert({
                                  title: "Erfolg",
                                  description:
                                    "Die Organisation wurde erfolgreich gelöscht.",
                                });
                                setOrgs(orgs.filter((o) => o._id !== org._id));
                              } else {
                                PopupManager.alert({
                                  title: "Fehler",
                                  description:
                                    "Die Organisation konnte nicht gelöscht werden: " +
                                    res.payload.error,
                                });
                              }
                            }
                          }}
                          variant={"ghost"}
                          colorScheme={"red"}
                        />
                      </ButtonGroup>
                    </>
                  ) : (
                    <>
                      <Button
                        leftIcon={<FaDoorOpen />}
                        colorScheme={"red"}
                        onClick={async () => {
                          if (
                            await PopupManager.confirmAsync({
                              title: "Verlassen",
                              question:
                                "Bist du dir sicher, dass du die Organisation verlassen möchtest?",
                            })
                          ) {
                            const res = await REST.Orgs.removeOrgMember({
                              token: AccountManager.getActiveToken(),
                              name: org.name,
                              userId: userInfo?.id,
                            });

                            if (res.status === 200) {
                              PopupManager.alert({
                                title: "Erfolg",
                                description:
                                  "Du hast die Organisation erfolgreich verlassen.",
                              });
                              setOrgs(orgs.filter((o) => o._id !== org._id));
                            } else {
                              PopupManager.alert({
                                title: "Fehler",
                                description:
                                  "Die Organisation konnte nicht verlassen werden: " +
                                  res.payload.error,
                              });
                            }
                          }
                        }}
                      >
                        Verlassen
                      </Button>
                    </>
                  )}
                </Flex>
                <Flex
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"column"}
                >
                  <Text mr={4}>
                    <b>Mitglieder:</b> {org.members.length}
                  </Text>
                  <Text mr={4}>
                    <b>Abonnement:</b> {org.subscription}
                  </Text>
                  <Text mr={4}>
                    <b>Erstellt am:</b>{" "}
                    {new Date(org.createdAt).toLocaleString()}
                  </Text>
                </Flex>
              </Flex>
            ))}
          {orgs.filter((org) =>
            org.name.toLowerCase().includes(query.toLowerCase())
          ).length === 0 ? (
            <>
              <Text color={"red.300"} mt={4}>
                Keine Organisationen gefunden
              </Text>
            </>
          ) : null}
        </Box>
      </Flex>
    </>
  );
}
