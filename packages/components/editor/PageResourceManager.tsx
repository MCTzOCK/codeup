/**
 * packages/components/editor/PageResourceManager.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.01.23
 *
 */

import * as React from "react";
import { Socket } from "socket.io-client";
import {
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  chakra,
  Badge,
} from "@chakra-ui/react";
import { FaLink, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { useRouter } from "next/router";
import REST from "@codeup/rest/dist";
import PopupManager from "@codeup/web/src/global/PopupManager";
import { useTranslation } from "next-i18next";

export default function PageResourceManager(props: {
  page: any;
  setPage: (newPage: any) => void;
  socket: Socket;
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  setCurrentResource: (xx: string) => void;
}) {
  const router = useRouter();

  const { t } = useTranslation("editor");
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        size={["full", "4xl"]}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>{t("page.res.manage")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>
                <chakra.span color={"brand.500"} fontWeight={"bold"}>
                  {t("page.res.info")}
                </chakra.span>
                :&nbsp;{t("page.res.info.text")}
              </Text>
              <Grid templateColumns={"repeat(2, 1fr)"} gap={6}>
                <GridItem
                  key={"new"}
                  bg={"gray.900"}
                  p={"1rem"}
                  borderRadius={"0.5rem"}
                  _hover={{
                    cursor: "pointer",
                    borderColor: "brand.500",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                  onClick={async () => {
                    const name = (
                      await PopupManager.promptAsync({
                        title: t("name"),
                        helperText: t("page.res.new.name"),
                      })
                    ).replace(/_/g, "-");

                    const type = await PopupManager.selectAsync({
                      title: t("page.res.type"),
                      helperText: t("page.res.type.helper"),
                      choices: [
                        "CSS",
                        "SCSS",
                        "Sass",
                        "JavaScript",
                        "TypeScript",
                        "JSON",
                        "Text (Beliebig)",
                      ],
                    });

                    if (name && type) {
                      props.socket.emit("editor:projects:page:content:set", {
                        projectId: router.query.project_id as string,
                        pageId: router.query.page_id as string,
                        resource: name,
                        resourceType: type,
                        content: t("page.res.insert.code"),
                      });

                      props.socket.emit("editor:projects:page:content", {
                        projectId: router.query.project_id as string,
                        pageId: router.query.page_id as string,
                      });

                      props.setPage({
                        ...props.page,
                        resources: [
                          ...props.page.resources,
                          {
                            name,
                            type,
                            content: t("page.res.insert.code"),
                          },
                        ],
                      });
                    }
                  }}
                >
                  <Heading
                    fontSize={"8xl"}
                    textAlign={"center"}
                    color={"brand.500"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    display={"flex"}
                    h={"100%"}
                  >
                    <FaPlus />
                  </Heading>
                </GridItem>
                {props.page.resources.map((r: any) => (
                  <>
                    <GridItem
                      key={r.name}
                      bg={"gray.800"}
                      p={"1rem"}
                      borderRadius={"0.5rem"}
                    >
                      <Heading size={"lg"}>{r.name}</Heading>
                      <Badge>{r.type}</Badge>
                      <Stack mt={"2rem"}>
                        <Button
                          colorScheme={"red"}
                          leftIcon={<FaTrash />}
                          onClick={async () => {
                            if (
                              await PopupManager.confirmAsync({
                                title: t("delete"),
                                question: t("page.res.delete"),
                              })
                            ) {
                              props.socket.emit(
                                "editor:projects:page:content:set",
                                {
                                  projectId: router.query.project_id as string,
                                  pageId: router.query.page_id as string,
                                  resource: r.name,
                                  content: "codeup.delete_resource",
                                }
                              );
                              props.setPage({
                                ...props.page,
                                resources: props.page.resources.filter(
                                  (rx: any) => rx.name !== r.name
                                ),
                              });
                            }
                          }}
                        >
                          {t("delete")}
                        </Button>
                        <Button
                          colorScheme={"blue"}
                          leftIcon={<FaPen />}
                          onClick={() => {
                            // @ts-ignore
                            window.__editor_current_resource = r.name;
                            props.setCurrentResource(r.name);
                            props.onClose();
                          }}
                        >
                          {t("edit")}
                        </Button>
                        <Button
                          colorScheme={"green"}
                          leftIcon={<FaLink />}
                          onClick={() => {
                            const url =
                              window.location.protocol +
                              "//" +
                              window.location.host +
                              "/editor-static/page-res/" +
                              router.query.page_id +
                              "/" +
                              r.name;

                            navigator.clipboard.writeText(url);
                            PopupManager.alert({
                              title: t("copied.url"),
                              description: t("url") + ": " + url,
                              callback: () => {},
                            });
                          }}
                        >
                          {t("copy.static.url")}
                        </Button>
                      </Stack>
                    </GridItem>
                  </>
                ))}
              </Grid>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup>
                <Button
                  colorScheme={"red"}
                  variant={"outline"}
                  onClick={props.onClose}
                >
                  {t("close")}
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
