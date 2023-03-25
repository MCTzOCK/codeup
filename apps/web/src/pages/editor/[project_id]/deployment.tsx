/**
 * apps/web/src/pages/editor/[project_id]/deployment.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.01.23
 *
 */
import * as React from "react";
import EditorProjectLayout from "@codeup/components/editor/EditorProjectLayout";
import CollaboratorManagerBody from "@codeup/components/editor/CollaboratorManagerBody";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import PopupManager from "../../../global/PopupManager";
import { useLoggedIn } from "@codeup/hooks";
import { useId } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { v4 } from "uuid";

export default function Contributors() {
  const router = useRouter();
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const [reactSocket, setReactSocket] = React.useState<Socket | null>(null);
  let socket: Socket | null = null;
  const [project, setProject] = React.useState<any>({});
  const [customDomain, setCustomDomain] = React.useState<string>("");

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
          if (!data.project.customDomain.startsWith("disabled:")) {
            setCustomDomain(data.project.customDomain.split(".")[0]);
          }
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

  const inputId = useId();

  return (
    <>
      <EditorProjectLayout>
        <Heading textAlign={"center"} size={"2xl"} mt={8}>
          Deployment
        </Heading>
        {reactSocket ? (
          <>
            <Flex w={"100%"} alignItems={"center"} justifyContent={"center"}>
              <Box w={"50%"} mt={4}>
                <Stack>
                  <Text>
                    Wenn du möchtest, dass andere mit einem Link auf dein
                    gesamtes Projekt zugreifen können, kannst du es hier
                    veröffentlichen. Du kannst dir eine eigene Domain aussuchen.
                    Zum Beispiel kann dein Projekt so unter
                    https://mein-projekt.codeup.space erreichbar sein. Gib
                    einfach deine Wunsch-Domain in das Feld unten ein und wir
                    schauen, ob diese verfügbar ist. Wenn du die Freigabe
                    entfernen möchtest, kannst du das Feld einfach leer lassen.
                    Nach einer Änderung musst du auf den Knopf
                    &quot;Speichern&quot; klicken.
                  </Text>
                  <StackDivider />
                  <FormControl>
                    <InputGroup>
                      <Input
                        id={inputId}
                        placeholder={
                          "Sub-Domain Name (ohne https://, Beispiel: mein-projekt)"
                        }
                        defaultValue={customDomain}
                      />
                      <InputRightAddon>.codeup.space</InputRightAddon>
                    </InputGroup>
                  </FormControl>
                  <Button
                    onClick={() => {
                      const newDomain = (
                        document.getElementById(inputId) as HTMLInputElement
                      ).value;

                      let d =
                        newDomain +
                        "." +
                        (window.location.hostname.includes(":")
                          ? window.location.hostname.split(":")[0]
                          : window.location.hostname);

                      if (newDomain === "") d = "disabled:" + v4();

                      if (reactSocket) {
                        reactSocket.on(
                          "editor:projects:settings",
                          (data: any) => {
                            if (data.success) {
                              if (newDomain === "") {
                                PopupManager.alert({
                                  title: "Erfolgreich",
                                  description:
                                    "Deine App ist nun nicht mehr öffentlich erreichbar.",
                                });
                                return;
                              }

                              PopupManager.alert({
                                title: "Erfolgreich",
                                description:
                                  "Deine App ist nun unter http://" +
                                  d +
                                  " erreichbar.",
                              });
                            } else {
                              PopupManager.alert({
                                title: "Fehler",
                                description: data.error,
                              });
                            }
                          }
                        );

                        reactSocket.emit("editor:projects:settings", {
                          id: router.query.project_id,
                          update: {
                            customDomain: d,
                          },
                        });
                      }
                    }}
                  >
                    Speichern
                  </Button>
                  {customDomain !== "" ? (
                    <Button
                      leftIcon={<FaExternalLinkAlt />}
                      colorScheme={"blue"}
                      onClick={() => {
                        window.open(
                          `http://${customDomain}.codeup.space`,
                          "_blank"
                        );
                      }}
                    >
                      Deploment Öffnen
                    </Button>
                  ) : null}
                </Stack>
              </Box>
            </Flex>
          </>
        ) : (
          <></>
        )}
      </EditorProjectLayout>
    </>
  );
}
