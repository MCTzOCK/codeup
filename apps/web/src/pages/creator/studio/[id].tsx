/**
 * apps/web/src/pages/creator/studio/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.11.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import REST from "@codeup/rest";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import AdminContentsLayout from "@codeup/components/admin/AdminContentsLayout";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  FaEye,
  FaFile,
  FaHome,
  FaPen,
  FaTrash,
  FaYoutube,
} from "react-icons/fa";
import CreatorStudioLayout from "@codeup/components/creator/studio/CreatorStudioLayout";
import course from "../../api/course/[course]";
import ErrorComponent from "@codeup/components/global/ErrorComponent";
import Head from "next/head";
import { sProp } from "../../../global/i18nstaticProps";
import { useTransform } from "framer-motion";
import { useTranslation } from "next-i18next";

export default function CourseViewer() {
  const router = useRouter();

  const { id } = router.query;
  const { t } = useTranslation("creator-studio");

  const [courseName, setCourseName] = React.useState<string[]>([
    t("loading.contents"),
  ]);

  const [_rawCourseObject, _setRawCourseObject] = React.useState<any>(null);

  const [contentPositions, setContentPositions] = React.useState<string[]>([]);

  const [contents, setContents] = React.useState<
    {
      _id: string;
      displayName: string;
      course: string;
      url: string;
      createdAt: string;
      type: "TEXT" | "VIDEO";
      textContent: string;
      quiz: {
        question: string;
        answers: {
          answer: string;
          correct: boolean;
        };
      }[];
      videoUrl?: string;
    }[]
  >([]);

  React.useEffect(() => {
    if (id && id !== "") {
      REST.Creator.getCourses(localStorage.getItem("token") as string).then(
        (res) => {
          if (res.status === 200) {
            const course = res.payload.courses.filter(
              (c: any) => c._id === id
            )[0];
            setCourseName([course.name, course.friendlyName]);
            setContentPositions(course.contentPositions);
            _setRawCourseObject(course);
          } else {
            console.error(res);
            alert(t("loading.contents.error"));
          }
        }
      );
    }
  }, [id]);

  React.useEffect(() => {
    reloadContents();
  }, [contentPositions]);

  const reloadContents = () => {
    REST.Creator.getContents({
      token: localStorage.getItem("token") as string,
      courseId: id as string,
    }).then((res) => {
      if (res.status === 200) {
        setContents(res.payload.contents);

        const sortedContents = contentPositions.map((id) => {
          return res.payload.contents.filter((c: any) => c._id === id)[0];
        });

        const missingContents = res.payload.contents.filter(
          (c: any) => !contentPositions.includes(c._id)
        );

        let x: any = [];

        if (sortedContents && missingContents) {
          x = [...sortedContents, ...missingContents];
        } else if (sortedContents) {
          x = [...sortedContents];
        } else if (missingContents) {
          x = [...missingContents];
        }

        x = x.filter((c: any) => c !== undefined);

        setItems(x);
      } else {
        console.error(res);
        toast({
          title: t("loading.contents.error.title"),
          description: t("loading.contents.error.details"),
          status: "error",
          duration: 1500,
          isClosable: true,
        });
      }
    });
  };

  const toast = useToast();

  const [items, setItems] = React.useState<any[]>([]);

  return (
    <>
      <Head>
        <title>{t("course.editor.doc.title")}</title>
      </Head>
      <CreatorStudioLayout>
        <Flex p={"2rem"} gap={6} alignItems={"center"}>
          <IconButton
            aria-label={t("back")}
            onClick={() => router.push("/creator/studio")}
            icon={<FaHome />}
          />

          <Heading size={"lg"}>{courseName[0]}</Heading>

          <Button
            variant={"brand"}
            ml={2}
            onClick={() => {
              router.push("/creator/studio/create/content/" + id);
            }}
          >
            {t("new")}
          </Button>
        </Flex>
        {contents.length === 0 ? (
          <ErrorComponent
            description={t("course.no.contents")}
            title={t("course.no.contents.title")}
          />
        ) : null}
        <Flex alignItems={"center"} p={6} w={"100%"} justifyContent={"center"}>
          <Box maxW={["100%", "50%"]} w={"100%"} id={"_tmp.up"}>
            <DragDropContext
              onDragEnd={(result) => {
                if (!result.destination) return;

                const items0 = Array.from(items);

                const [reorderedItem] = items0.splice(result.source.index, 1);
                items0.splice(result.destination.index, 0, reorderedItem);

                setItems(items0);

                REST.Creator.updateCourse({
                  token: localStorage.getItem("token") as string,
                  id: id as string,
                  update: {
                    // @ts-ignore
                    contentPositions: items0.map((i) => i._id),
                  },
                });
              }}
            >
              <Droppable droppableId={"contents"}>
                {(provided, snapshopt) => (
                  <>
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      p={"2rem"}
                    >
                      {items.map((content, index) => (
                        <>
                          {content !== undefined ? (
                            <>
                              <Draggable
                                key={content._id}
                                draggableId={content._id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <>
                                    <Box
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      bg={"gray.900"}
                                      color={"white"}
                                      rounded={"lg"}
                                      p={6}
                                      mt={6}
                                      borderWidth="1px"
                                      borderRadius="lg"
                                      _hover={{
                                        borderColor: "brand.500",
                                      }}
                                      cursor={"pointer"}
                                    >
                                      <Flex
                                        justifyContent={"space-between"}
                                        direction={"column"}
                                        gap={2}
                                      >
                                        <Flex
                                          direction={"row"}
                                          w={"100%"}
                                          gap={8}
                                        >
                                          <Flex
                                            direction={"column"}
                                            flex="50%"
                                            gap={4}
                                          >
                                            <Heading size={"md"}>
                                              {content.displayName}
                                            </Heading>
                                            <Text
                                              size={"sm"}
                                              color={"gray.400"}
                                            >
                                              /course/{courseName[1]}/
                                              {content.url}
                                            </Text>
                                          </Flex>
                                          <Box flex={"50%"}>
                                            <Stack>
                                              <Button
                                                w={"100%"}
                                                variant={"brand"}
                                                leftIcon={<FaEye />}
                                                onClick={() => {
                                                  if (
                                                    !_rawCourseObject.available
                                                  ) {
                                                    if (
                                                      confirm(
                                                        t(
                                                          "publish.course.to.see.user.view"
                                                        )
                                                      )
                                                    ) {
                                                      REST.Creator.updateCourse(
                                                        {
                                                          token:
                                                            localStorage.getItem(
                                                              "token"
                                                            ) as string,
                                                          update: {
                                                            available: true,
                                                          },
                                                          id: _rawCourseObject._id,
                                                        }
                                                      ).then((res) => {
                                                        if (
                                                          res.status === 200
                                                        ) {
                                                          router.push(
                                                            `/course/${courseName[1]}/${content.url}`
                                                          );
                                                        } else {
                                                          toast({
                                                            title: t(
                                                              "publish.course.error"
                                                            ),
                                                            description:
                                                              t(
                                                                "publish.course.error.text"
                                                              ) +
                                                              ": " +
                                                              res.payload.error,
                                                            status: "error",
                                                            duration: 1500,
                                                            isClosable: true,
                                                          });
                                                        }
                                                      });
                                                    } else {
                                                      return;
                                                    }
                                                  }

                                                  router.push(
                                                    `/course/${courseName[1]}/${content.url}`
                                                  );
                                                }}
                                              >
                                                {t("course.user.view")}
                                              </Button>
                                              <HStack>
                                                <Button
                                                  w={"100%"}
                                                  leftIcon={<FaPen />}
                                                  variant={"brand"}
                                                  onClick={() => {
                                                    router.push(
                                                      `/creator/studio/edit/${content._id}/info`
                                                    );
                                                  }}
                                                >
                                                  {t("edit")}
                                                </Button>
                                                <Button
                                                  w={"100%"}
                                                  leftIcon={<FaPen />}
                                                  variant={"brand"}
                                                  onClick={() => {
                                                    router.push(
                                                      `/creator/studio/edit/${content._id}`
                                                    );
                                                  }}
                                                >
                                                  {t("edit.content")}
                                                </Button>
                                              </HStack>
                                              <Button
                                                w={"100%"}
                                                leftIcon={<FaTrash />}
                                                colorScheme={"red"}
                                                onClick={async () => {
                                                  if (
                                                    !confirm(
                                                      t(
                                                        "delete.content.confirm"
                                                      )
                                                    )
                                                  ) {
                                                    return;
                                                  }

                                                  const res =
                                                    await REST.Creator.deleteContent(
                                                      {
                                                        token:
                                                          localStorage.getItem(
                                                            "token"
                                                          ) as string,
                                                        cid: content._id,
                                                      }
                                                    );

                                                  if (res.status === 200) {
                                                    reloadContents();
                                                    toast({
                                                      title:
                                                        t("deleted.content"),
                                                      description: t(
                                                        "deleted.content.text"
                                                      ),
                                                      status: "success",
                                                      duration: 1500,
                                                      isClosable: true,
                                                      position: "bottom-right",
                                                    });
                                                  } else {
                                                    console.error(res);
                                                    toast({
                                                      title: t(
                                                        "deleted.content.error"
                                                      ),
                                                      description: t(
                                                        "deleted.content.error.text"
                                                      ),
                                                      status: "error",
                                                      duration: 1500,
                                                      isClosable: true,
                                                      position: "bottom-right",
                                                    });
                                                  }
                                                }}
                                              >
                                                {t("delete")}
                                              </Button>
                                            </Stack>
                                          </Box>
                                        </Flex>
                                        <Text
                                          fontSize={"sm"}
                                          color={"gray.400"}
                                        >{`${t("created.at")}: ${new Date(
                                          content.createdAt
                                        )
                                          .toLocaleString()
                                          .replace(",", " um")}`}</Text>
                                      </Flex>
                                    </Box>
                                  </>
                                )}
                              </Draggable>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </Box>
                  </>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
        </Flex>
      </CreatorStudioLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["creator-studio"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
