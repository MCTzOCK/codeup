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
  IconButton,
  Text,
  useToast,
} from "@chakra-ui/react";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import AdminContentsLayout from "@codeup/components/admin/AdminContentsLayout";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { FaEye, FaFile, FaHome, FaTrash, FaYoutube } from "react-icons/fa";
import CreatorStudioLayout from "@codeup/components/creator/studio/CreatorStudioLayout";

export default function CourseViewer() {
  const router = useRouter();

  const { id } = router.query;

  const [courseName, setCourseName] = React.useState<string[]>([
    "Inhalte Laden...",
  ]);

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
          } else {
            console.error(res);
            alert("Fehler beim Laden der Inhalte. Details siehe Konsole.");
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
          title: "Fehler beim Laden der Inhalte",
          description: "Details siehe Konsole",
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
      <CreatorStudioLayout>
        <Flex p={"2rem"} gap={6} alignItems={"center"}>
          <IconButton
            aria-label={"Zurück"}
            onClick={() => router.push("/creator/studio")}
            icon={<FaHome />}
          />

          <Heading size={"lg"}>{courseName[0]}</Heading>

          <Button
            colorScheme={"blue"}
            ml={2}
            onClick={() => {
              router.push("/creator/studio/create/content/" + id);
            }}
          >
            Neu
          </Button>
        </Flex>
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
                                    borderColor: "blue.500",
                                  }}
                                  cursor={"pointer"}
                                >
                                  <Flex
                                    justifyContent={"space-between"}
                                    direction={"column"}
                                    gap={2}
                                  >
                                    <Flex
                                      justifyContent={"space-between"}
                                      direction={"row"}
                                      alignItems={"center"}
                                    >
                                      <Heading size={"md"}>
                                        {content.displayName}
                                      </Heading>
                                      <Text size={"sm"} color={"gray.400"}>
                                        /course/{courseName[1]}/{content.url}
                                      </Text>
                                      <Badge
                                        colorScheme={
                                          content.type === "TEXT"
                                            ? "green"
                                            : "blue"
                                        }
                                      >
                                        {content.type === "TEXT"
                                          ? "Text"
                                          : "Video"}
                                      </Badge>
                                      <IconButton
                                        aria-label={"Löschen"}
                                        icon={<FaTrash />}
                                        variant={"ghost"}
                                        colorScheme={"red"}
                                        onClick={async () => {
                                          if (
                                            !confirm(
                                              "Willst du den Inhalt wirklich löschen?"
                                            )
                                          ) {
                                            return;
                                          }

                                          const res =
                                            await REST.Creator.deleteContent({
                                              token: localStorage.getItem(
                                                "token"
                                              ) as string,
                                              cid: content._id,
                                            });

                                          if (res.status === 200) {
                                            reloadContents();
                                            toast({
                                              title: "Inhalt gelöscht",
                                              description:
                                                "Der Inhalt wurde erfolgreich gelöscht.",
                                              status: "success",
                                              duration: 1500,
                                              isClosable: true,
                                              position: "bottom-right",
                                            });
                                          } else {
                                            console.error(res);
                                            toast({
                                              title: "Fehler beim Löschen",
                                              description:
                                                "Der Inhalt konnte nicht gelöscht werden. Details siehe Konsole.",
                                              status: "error",
                                              duration: 1500,
                                              isClosable: true,
                                              position: "bottom-right",
                                            });
                                          }
                                        }}
                                      />
                                    </Flex>
                                    <Text
                                      fontSize={"sm"}
                                      color={"gray.400"}
                                    >{`Erstellt am: ${new Date(
                                      content.createdAt
                                    )
                                      .toLocaleString()
                                      .replace(",", " um")}`}</Text>
                                    <ButtonGroup mt={6}>
                                      <Button
                                        w={"100%"}
                                        leftIcon={<FaFile />}
                                        onClick={() => {
                                          // create blob url that shows the text content in a new window
                                          const blob = new Blob(
                                            [content.textContent],
                                            {
                                              type: "text/plain",
                                            }
                                          );

                                          const url = URL.createObjectURL(blob);

                                          window.open(url, "_blank");
                                        }}
                                      >
                                        Text Anzeigen
                                      </Button>
                                      {content.type === "VIDEO" ? (
                                        <>
                                          <Button
                                            leftIcon={<FaYoutube />}
                                            w={"100%"}
                                            onClick={() => {
                                              window.open(
                                                content.videoUrl,
                                                "_blank"
                                              );
                                            }}
                                          >
                                            Video Anzeigen
                                          </Button>
                                        </>
                                      ) : null}
                                    </ButtonGroup>
                                    <ButtonGroup mt={3}>
                                      <Button
                                        w={"100%"}
                                        leftIcon={<FaEye />}
                                        onClick={() => {
                                          router.push(
                                            `/course/${courseName[1]}/${content.url}`
                                          );
                                        }}
                                      >
                                        Anzeigen
                                      </Button>
                                    </ButtonGroup>
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
      </CreatorStudioLayout>
    </>
  );
}
