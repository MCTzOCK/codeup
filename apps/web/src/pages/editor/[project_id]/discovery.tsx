/**
 * apps/web/src/pages/editor/[project_id]/discovery.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.03.2023
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { useLoggedIn } from "@codeup/hooks";
import { io, Socket } from "socket.io-client";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/editor/EditorProjectLayout";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Link,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";

export default function Discovery() {
  const router = useRouter();
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const [reactSocket, setReactSocket] = React.useState<Socket | null>(null);
  let socket: Socket | null = null;
  const [project, setProject] = React.useState<any>({});

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
        if (!data.authenticated) {
          router.push("/#login");
          window.dispatchEvent(new CustomEvent("codeup::open_login"));
        } else {
          socket?.emit("editor:projects:info", { id: router.query.project_id });
        }
      });

      socket.on("editor:projects:info", (data: any) => {
        if (data.success) {
          setProject(data.project);
        } else {
          PopupManager.alert({
            title: "Fehler",
            description: data.error,
          });
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
        {reactSocket ? (
          <>
            <Heading textAlign={"center"} size={"2xl"} mt={8}>
              Discovery
            </Heading>
            <Flex w={"100%"} alignItems={"center"} justifyContent={"center"}>
              <Box w={"50%"} mt={4}>
                {project && project.customDomain && (
                  <>
                    <Stack>
                      <Text fontSize={"lg"}>
                        Wenn du deine App mit einer eigenen Domain
                        (*.codeup.space) verbunden hast, kannst du diese im
                        Discovery anzeigen. Hierdurch können andere Benutzer
                        deine App finden und verwenden.
                      </Text>
                      <Flex fontSize={"lg"}>
                        {project.customDomain.startsWith("disabled:") ? (
                          <Flex color={"red.300"} alignItems={"center"} gap={4}>
                            <FaExclamationTriangle /> Du hast deine App noch
                            nicht mit einer Domain verbunden. Dies kannst du
                            <Text
                              color={"blue.400"}
                              cursor={"pointer"}
                              _hover={{
                                textDecoration: "underline",
                              }}
                              onClick={() => {
                                router.push(
                                  "/editor/" + project._id + "/deployment"
                                );
                              }}
                            >
                              Hier
                            </Text>
                            nachholen.
                          </Flex>
                        ) : (
                          <>
                            <Stack>
                              <Flex
                                color={"green.300"}
                                alignItems={"center"}
                                gap={4}
                              >
                                <FaCheck /> Du hast deine App mit einer Domain
                                verbunden. Diese lautet: {project.customDomain}
                              </Flex>
                              {project.discovery ? (
                                <>
                                  <Flex
                                    color={"green.300"}
                                    alignItems={"center"}
                                    gap={4}
                                  >
                                    <FaCheck /> Deine App ist im Discovery
                                    verfügbar
                                  </Flex>
                                </>
                              ) : (
                                <>
                                  <Flex
                                    color={"red.300"}
                                    alignItems={"center"}
                                    gap={4}
                                  >
                                    <FaExclamationTriangle /> Deine App ist
                                    nicht im Discovery verfügbar
                                  </Flex>
                                </>
                              )}
                              <StackDivider />
                              <Button
                                colorScheme={"blue"}
                                onClick={async () => {
                                  if (project.discovery) {
                                    reactSocket?.emit(
                                      "editor:projects:settings",
                                      {
                                        id: project._id,
                                        update: {
                                          discovery: false,
                                          discoveryDescription: "",
                                        },
                                      }
                                    );

                                    reactSocket?.on(
                                      "editor:projects:settings",
                                      (data: any) => {
                                        if (data.success) {
                                          setProject({
                                            ...project,
                                            discovery: false,
                                            discoveryDescription: "",
                                          });
                                          PopupManager.alert({
                                            title: "Erfolg",
                                            description:
                                              "Deine App wurde erfolgreich aus dem Discovery entfernt.",
                                          });
                                        } else {
                                          PopupManager.alert({
                                            title: "Fehler",
                                            description:
                                              "Deine App konnte nicht aus dem Discovery entfernt werden: " +
                                              data.error,
                                          });
                                        }
                                      }
                                    );
                                  } else {
                                    const description =
                                      await PopupManager.promptAsync({
                                        title: "Beschreibung",
                                        helperText:
                                          "Bitte gib eine Beschreibung für deine App an",
                                        inputType: "TEXTAREA",
                                      });

                                    if (!description) return;
                                    if (description.length > 1000)
                                      return PopupManager.alert({
                                        title: "Fehler",
                                        description:
                                          "Die Beschreibung darf nicht länger als 1000 Zeichen sein.",
                                      });

                                    if (description.length < 100)
                                      return PopupManager.alert({
                                        title: "Fehler",
                                        description:
                                          "Die Beschreibung muss mindestens 100 Zeichen lang sein.",
                                      });

                                    reactSocket?.emit(
                                      "editor:projects:settings",
                                      {
                                        id: project._id,
                                        update: {
                                          discovery: true,
                                          discoveryDescription: description,
                                        },
                                      }
                                    );

                                    reactSocket?.on(
                                      "editor:projects:settings",
                                      (data: any) => {
                                        if (data.success) {
                                          setProject({
                                            ...project,
                                            discovery: true,
                                            discoveryDescription: description,
                                          });
                                          PopupManager.alert({
                                            title: "Erfolg",
                                            description:
                                              "Deine App wurde erfolgreich im Discovery veröffentlicht.",
                                          });
                                        } else {
                                          PopupManager.alert({
                                            title: "Fehler",
                                            description:
                                              "Deine App konnte nicht im Discovery veröffentlicht werden: " +
                                              data.error,
                                          });
                                        }
                                      }
                                    );
                                  }
                                }}
                              >
                                {project.discovery
                                  ? "Discovery Deaktivieren"
                                  : "Discovery Aktivieren"}
                              </Button>
                            </Stack>
                          </>
                        )}
                      </Flex>
                    </Stack>
                  </>
                )}
              </Box>
            </Flex>
          </>
        ) : (
          <AuthenticateLoadingIndicator />
        )}
      </EditorProjectLayout>
    </>
  );
}
