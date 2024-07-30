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
  Heading,
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
  Textarea,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { FaCogs, FaPlus, FaTrash } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { useTranslation } from "next-i18next";

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
    discovery: boolean;
    discoveryDescription: string;
  } | null>(null);

  const { t } = useTranslation("ide");

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
            title: t("base:control.error"),
            description: t("project.loading.error"),
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
          <ModalHeader>{t("project.manage.publish")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {project && !project.published ? (
              <>
                <Text>{t("project.publish.text")}</Text>
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
                          title: t("success"),
                          description: t("project.published"),
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
                            title: t("base:control.error"),
                            description: t("project.publish.error.name"),
                            status: "error",
                            duration: 1500,
                            isClosable: true,
                            position: "bottom-left",
                          });
                        } else {
                          toast({
                            title: t("base:control.error"),
                            description: t("project.publish.error"),
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
                      <FormLabel>{t("project.name")}</FormLabel>
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
                      <FormLabel>{t("publish")}</FormLabel>
                      <Button colorScheme={"green"} type={"submit"}>
                        {t("publish")}
                      </Button>
                    </FormControl>
                  </SimpleGrid>
                </form>
              </>
            ) : (
              <>
                <Text>{t("projcet.published.text")}</Text>
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
                          title: t("success"),
                          description: t("project.published"),
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
                            title: t("base:control.error"),
                            description: t("project.publish.error.name"),
                            status: "error",
                            duration: 1500,
                            isClosable: true,
                            position: "bottom-left",
                          });
                        } else {
                          toast({
                            title: t("base:control.error"),
                            description: t("project.publish.error"),
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
                      <FormLabel>{t("project.name")}</FormLabel>
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
                      <FormLabel>{t("publish")}</FormLabel>
                      <Button colorScheme={"green"} type={"submit"}>
                        {t("accept")}
                      </Button>
                    </FormControl>
                    <FormControl>
                      <FormLabel>{t("share")}</FormLabel>
                      <Button
                        colorScheme={"blue"}
                        onClick={() => {
                          if (window.isSecureContext) {
                            navigator.clipboard.writeText(
                              `https://codeup.space/project/${project?.publishedCustomName}`
                            );

                            toast({
                              title: t("success"),
                              description: t("share.copied"),
                              status: "success",
                              duration: 1500,
                              isClosable: true,
                              position: "bottom-left",
                            });
                          } else {
                            toast({
                              title: t("base:control.error"),
                              description: t("share.error"),
                              status: "error",
                              duration: 1500,
                              isClosable: true,
                              position: "bottom-left",
                            });
                          }
                        }}
                      >
                        {t("share.copy.url")}
                      </Button>
                    </FormControl>

                    <FormControl>
                      <FormLabel>{t("hide")}</FormLabel>
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
                                title: t("success"),
                                description: t("hidden"),
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
                                title: t("base:control.error"),
                                description: t("hide.error"),
                                status: "error",
                                duration: 1500,
                                isClosable: true,
                                position: "bottom-left",
                              });
                            }
                          });
                        }}
                      >
                        {t("hide")}
                      </Button>
                    </FormControl>
                  </SimpleGrid>
                </form>
                <Divider my={4} />
                <Heading size={"md"}>{t("discovery")}</Heading>
                <Text>{t("discovery.text")}</Text>
                <SimpleGrid columns={[1, 2]} spacing={4} mt={4}>
                  {!project?.discovery ? (
                    <>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();

                          const data = new FormData(
                            e.target as HTMLFormElement
                          );

                          const description = data.get("description") as string;

                          if (description.length < 50) {
                            toast({
                              title: t("base:control.error"),
                              description: t("discovery.error.description"),
                              status: "error",
                              duration: 1500,
                              isClosable: true,
                              position: "bottom-left",
                            });
                            return;
                          }

                          const r = await REST.IDE.enableDiscovery({
                            token: localStorage.getItem("token") as string,
                            projectId: (project as any)._id as string,
                            description,
                          });

                          if (r.status === 200) {
                            toast({
                              title: t("success"),
                              description: t("discovery.success"),
                              status: "success",
                              duration: 1500,
                              isClosable: true,
                              position: "bottom-left",
                            });

                            setProject({
                              ...project,
                              discovery: true,
                              discoveryDescription: description,
                            } as any);
                          } else {
                            toast({
                              title: t("base:control.error"),
                              description: t("discovery.error"),
                              status: "error",
                              duration: 1500,
                              isClosable: true,
                              position: "bottom-left",
                            });
                          }
                        }}
                      >
                        <Box>
                          <FormControl isRequired mb={2}>
                            <Textarea
                              name={"description"}
                              placeholder={t("description")}
                            />
                          </FormControl>
                          <Button colorScheme={"green"} type={"submit"}>
                            {t("publish")}
                          </Button>
                        </Box>
                      </form>
                    </>
                  ) : (
                    <>
                      <Button
                        colorScheme={"red"}
                        onClick={async () => {
                          const r = await REST.IDE.disableDiscovery({
                            token: localStorage.getItem("token") as string,
                            projectId: (project as any)._id as string,
                          });

                          if (r.status === 200) {
                            toast({
                              title: t("success"),
                              description: t("discovery.remove.success"),
                              status: "success",
                              duration: 1500,
                              isClosable: true,
                              position: "bottom-left",
                            });

                            setProject({
                              ...project,
                              discovery: false,
                              discoveryDescription: "",
                            });
                          } else {
                            toast({
                              title: t("base:control.error"),
                              description: t("discovery.remove.error"),
                              status: "error",
                              duration: 1500,
                              isClosable: true,
                              position: "bottom-left",
                            });
                          }
                        }}
                      >
                        {t("hide")}
                      </Button>
                    </>
                  )}
                </SimpleGrid>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={props.onClose}>
              {t("close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
