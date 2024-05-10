/**
 * apps/web/src/pages/planning/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.12.2022
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { useEffect } from "react";
import { useRouter } from "next/router";
import REST from "@codeup/rest";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import GridLayout from "@codeup/components/global/GridLayout";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa";
import PopupManager from "../../global/PopupManager";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import byteSize from "byte-size";

export default function Index() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();
  const router = useRouter();

  const [projects, setProjects] = React.useState<any[]>([]);

  useEffect(() => {
    if (!loggedIn && loaded) {
      router.push("/");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    } else if (loaded && loggedIn) {
      reload();
    }
  }, [userInfo, loggedIn, loaded]);

  const toast = useToast();

  const reload = () => {
    REST.ToDo.getV2Projects(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setProjects(res.payload.projects);
        } else {
          toast({
            title: "Fehler",
            description:
              "Beim Laden der Projekte ist ein Fehler aufgetreten: " +
              res.payload.error,
            status: "error",
            duration: 1500,
            isClosable: true,
            position: "bottom-right",
          });
        }
      }
    );
  };

  return (
    <>
      <Head>
        <title>Projektplanung - CodeUp</title>
      </Head>
      <Box h={"fit-content"} minH={"100vh"} bg={"#000"}>
        <GridLayoutV2
          pageTitle={"Projekte"}
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
                const name = await PopupManager.promptAsync({
                  title: "Neues Projekt",
                  helperText: "Gib den Namen des Projektes ein",
                });

                if (!name) return;

                const res = await REST.ToDo.createV2Project({
                  token: localStorage.getItem("token") as string,
                  name: name,
                });
                if (res.status === 200) {
                  reload();
                  toast({
                    position: "bottom-right",
                    status: "success",
                    title: "Erfolgreich",
                    description: "Das Projekt wurde erstellt",
                    isClosable: true,
                    duration: 1500,
                  });
                } else {
                  toast({
                    position: "bottom-right",
                    status: "error",
                    title: "Fehler",
                    description: res.payload.error,
                    isClosable: true,
                    duration: 1500,
                  });
                }
              },
            },
          ]}
          entries={projects.map((p) => {
            return {
              title: p.name,
              fields: [
                {
                  text:
                    "Gespeicherte Daten: " +
                    byteSize(p.saved.length).toString(),
                },
              ],
              buttonRows: [
                [
                  {
                    text: "Öffnen",
                    leftIcon: <FaEye />,
                    variant: "brand",
                    onClick: () => {
                      router.push("/planning/" + p._id);
                    },
                  },
                  {
                    text: "Löschen",
                    leftIcon: <FaTrash />,
                    colorScheme: "red",
                    onClick: async () => {
                      REST.ToDo.deleteV2Project({
                        token: localStorage.getItem("token") as string,
                        id: p._id,
                      }).then((res) => {
                        if (res.status === 200) {
                          toast({
                            position: "bottom-right",
                            status: "success",
                            title: "Erfolgreich",
                            description: "Das Projekt wurde gelöscht",
                            isClosable: true,
                            duration: 1500,
                          });
                          reload();
                        } else {
                          toast({
                            position: "bottom-right",
                            status: "error",
                            title: "Fehler",
                            description: res.payload.error,
                            isClosable: true,
                            duration: 1500,
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
      </Box>
      <Heading size="2xl" textAlign={"center"} mt={"2rem"}>
        Projekte
      </Heading>
      <GridLayout
        search={{
          allow: true,
          searchFields: true,
        }}
        specialEntries={[
          {
            icon: <FaPlus />,
            onClick: async () => {
              const name = await PopupManager.promptAsync({
                title: "Neues Projekt",
                helperText: "Gib den Namen des Projektes ein",
              });

              if (!name) return;

              const res = await REST.ToDo.createV2Project({
                token: localStorage.getItem("token") as string,
                name: name,
              });
              if (res.status === 200) {
                reload();
                toast({
                  position: "bottom-right",
                  status: "success",
                  title: "Erfolgreich",
                  description: "Das Projekt wurde erstellt",
                  isClosable: true,
                  duration: 1500,
                });
              } else {
                toast({
                  position: "bottom-right",
                  status: "error",
                  title: "Fehler",
                  description: res.payload.error,
                  isClosable: true,
                  duration: 1500,
                });
              }
            },
          },
        ]}
        entries={projects.map((p) => {
          return {
            title: p.name,
            fields: [],
            buttonRows: [
              {
                buttons: [
                  {
                    text: "Öffnen",
                    icon: <FaEye />,
                    colorScheme: "blue",
                    onClick: () => {
                      router.push("/planning/" + p._id);
                    },
                  },
                ],
              },
              {
                buttons: [
                  {
                    text: "Löschen",
                    icon: <FaTrash />,
                    colorScheme: "red",
                    onClick: async () => {
                      REST.ToDo.deleteV2Project({
                        token: localStorage.getItem("token") as string,
                        id: p._id,
                      }).then((res) => {
                        if (res.status === 200) {
                          toast({
                            position: "bottom-right",
                            status: "success",
                            title: "Erfolgreich",
                            description: "Das Projekt wurde gelöscht",
                            isClosable: true,
                            duration: 1500,
                          });
                          reload();
                        } else {
                          toast({
                            position: "bottom-right",
                            status: "error",
                            title: "Fehler",
                            description: res.payload.error,
                            isClosable: true,
                            duration: 1500,
                          });
                        }
                      });
                    },
                  },
                ],
              },
            ],
          };
        })}
      />
    </>
  );
}
