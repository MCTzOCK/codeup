/**
 * packages/components/ide/PublishManager.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.12.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import REST from "@codeup/rest";
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { FaCogs, FaPlus, FaTrash } from "react-icons/fa";
import { HiMail } from "react-icons/hi";

export default function PublishManager(props: {
  projectId?: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [project, setProject] = useState<{
    _id: string;
    owner: string;
    name: string;
    contributors: {
      user: string;
      permissions: string[];
    }[];
    files: {
      path: string;
      content: string;
    }[];
    published: boolean;
    publishedCustomName: string;
  } | null>(null);

  const toast = useToast();

  useEffect(() => {
    if (props.projectId && props.projectId !== "0") {
      REST.IDE.getProject({
        token: localStorage.getItem("token") as string,
        projectId: props.projectId,
      }).then((res) => {
        if (res.status === 200) {
          setProject(res.payload.project);
        } else {
          toast({
            title: "Fehler",
            description: "Das Projekt konnte nicht geladen werden.",
            status: "error",
            duration: 1500,
            isClosable: true,
            position: "bottom-left",
          });
        }
      });
    }
  }, [props.projectId]);

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        size={["full", "5xl"]}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Veröffentlichung verwalten</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {project && !project.published ? (
              <>
                <Text>
                  Du kannst dein Projekt veröffentlichen, um es anderen
                  Benutzern zugänglich zu machen. Du kannst auch andere Benutzer
                  hinzufügen, die an deinem Projekt mitarbeiten können.
                </Text>
                <Divider my={4} />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    const form = new FormData(e.target as HTMLFormElement);

                    const customName = form.get("customName") as string;

                    REST.IDE.publishProject({
                      token: localStorage.getItem("token") as string,
                      projectId: project._id,
                      customName,
                    }).then((res) => {
                      if (res.status === 200) {
                        toast({
                          title: "Erfolg",
                          description: "Das Projekt wurde veröffentlicht.",
                          status: "success",
                          duration: 1500,
                          isClosable: true,
                          position: "bottom-left",
                        });
                        setProject({
                          ...project,
                          published: true,
                        });
                      } else {
                        if (res.status === 700) {
                          toast({
                            title: "Fehler",
                            description: "Dieser Name ist bereits vergeben.",
                            status: "error",
                            duration: 1500,
                            isClosable: true,
                            position: "bottom-left",
                          });
                        } else {
                          toast({
                            title: "Fehler",
                            description:
                              "Das Projekt konnte nicht veröffentlicht werden.",
                            status: "error",
                            duration: 1500,
                            isClosable: true,
                            position: "bottom-left",
                          });
                        }
                      }
                    });
                  }}
                >
                  <SimpleGrid columns={[1, 2]} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Projektname</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>
                          https://codeup.space/project/
                        </InputLeftAddon>
                        <Input
                          name={"customName"}
                          value={project.publishedCustomName}
                          onChange={(e) => {
                            setProject({
                              ...project,
                              publishedCustomName: e.target.value,
                            });
                          }}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Veröffentlichen</FormLabel>
                      <Button colorScheme={"green"} type={"submit"}>
                        Veröffentlichen
                      </Button>
                    </FormControl>
                  </SimpleGrid>
                </form>
              </>
            ) : (
              <>
                <Text>
                  Dein Projekt ist veröffentlicht. Du kannst es jederzeit
                  verstecken, indem du auf &quot;Verstecken&quot; klickst.
                  Außerdem kannst du die URL des Projektes ändern.
                </Text>
                <Divider my={4} />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    const form = new FormData(e.target as HTMLFormElement);

                    const customName = form.get("customName") as string;

                    REST.IDE.publishProject({
                      token: localStorage.getItem("token") as string,
                      projectId: (project as any)._id as string,
                      customName,
                    }).then((res) => {
                      if (res.status === 200) {
                        toast({
                          title: "Erfolg",
                          description: "Das Projekt wurde veröffentlicht.",
                          status: "success",
                          duration: 1500,
                          isClosable: true,
                          position: "bottom-left",
                        });
                        // @ts-ignore
                        setProject({
                          ...project,
                          published: true,
                        });
                      } else {
                        if (res.status === 700) {
                          toast({
                            title: "Fehler",
                            description: "Dieser Name ist bereits vergeben.",
                            status: "error",
                            duration: 1500,
                            isClosable: true,
                            position: "bottom-left",
                          });
                        } else {
                          toast({
                            title: "Fehler",
                            description:
                              "Das Projekt konnte nicht veröffentlicht werden.",
                            status: "error",
                            duration: 1500,
                            isClosable: true,
                            position: "bottom-left",
                          });
                        }
                      }
                    });
                  }}
                >
                  <SimpleGrid columns={[1, 2]} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Projektname</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>
                          https://codeup.space/project/
                        </InputLeftAddon>
                        <Input
                          name={"customName"}
                          value={project?.publishedCustomName}
                          onChange={(e) => {
                            // @ts-ignore
                            setProject({
                              ...project,
                              publishedCustomName: e.target.value,
                            });
                          }}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Veröffentlichen</FormLabel>
                      <Button colorScheme={"green"} type={"submit"}>
                        Übernehmen
                      </Button>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Teilen</FormLabel>
                      <Button
                        colorScheme={"blue"}
                        onClick={() => {
                          if (window.isSecureContext) {
                            navigator.clipboard.writeText(
                              `https://codeup.space/project/${project?.publishedCustomName}`
                            );

                            toast({
                              title: "Erfolg",
                              description:
                                "Die URL wurde in die Zwischenablage kopiert.",
                              status: "success",
                              duration: 1500,
                              isClosable: true,
                              position: "bottom-left",
                            });
                          } else {
                            toast({
                              title: "Fehler",
                              description:
                                "Dieser Browser unterstützt das Teilen nicht.",
                              status: "error",
                              duration: 1500,
                              isClosable: true,
                              position: "bottom-left",
                            });
                          }
                        }}
                      >
                        URL kopieren
                      </Button>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Verstecken</FormLabel>
                      <Button
                        colorScheme={"red"}
                        onClick={() => {
                          REST.IDE.unpublishProject({
                            token: localStorage.getItem("token") as string,
                            // @ts-ignore
                            projectId: project?._id,
                          }).then((res) => {
                            if (res.status === 200) {
                              toast({
                                title: "Erfolg",
                                description: "Das Projekt wurde versteckt.",
                                status: "success",
                                duration: 1500,
                                isClosable: true,
                                position: "bottom-left",
                              });
                              // @ts-ignore
                              setProject({
                                ...project,
                                published: false,
                              });
                            } else {
                              toast({
                                title: "Fehler",
                                description:
                                  "Das Projekt konnte nicht versteckt werden.",
                                status: "error",
                                duration: 1500,
                                isClosable: true,
                                position: "bottom-left",
                              });
                            }
                          });
                        }}
                      >
                        Verstecken
                      </Button>
                    </FormControl>
                  </SimpleGrid>
                </form>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={props.onClose}>
              Schließen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
