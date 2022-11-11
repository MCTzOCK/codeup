/**
 * apps/web/src/pages/admin/contents/courses/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import REST from "@codeup/rest";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import AdminContentsLayout from "@codeup/components/admin/AdminContentsLayout";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Heading,
  IconButton,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  FaEye,
  FaFile,
  FaTrash,
  FaYoutube,
  FaYoutubeSquare,
} from "react-icons/fa";

export default function Course() {
  const router = useRouter();

  const { id } = router.query;

  const [courseName, setCourseName] = React.useState<string[]>([
    "Inhalte Laden...",
  ]);

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
      REST.Admin.listCourses(
        localStorage.getItem("token") as string,
        true
      ).then((res) => {
        if (res.status === 200) {
          const course = res.payload.courses.filter((c: any) => c.id === id)[0];
          setCourseName([course.name, course.url]);

          reloadContents();
        } else {
          console.error(res);
          alert("Fehler beim Laden der Inhalte. Details siehe Konsole.");
        }
      });
    }
  }, [id]);

  const reloadContents = () => {
    REST.Admin.getContents({
      token: localStorage.getItem("token") as string,
      course: id as string,
    }).then((res) => {
      if (res.status === 200) {
        setContents(res.payload.contents);
      } else {
        console.error(res);
        alert("Fehler beim Laden der Inhalte. Details siehe Konsole.");
      }
    });
  };

  const toast = useToast();

  return (
    <>
      <AdminLayout>
        <AdminContentsLayout>
          <Box p={"2rem"}>
            <Heading size={"lg"}>{courseName[0]}</Heading>
          </Box>
          <Grid templateColumns={"repeat(3, 1fr)"} gap={6} p={"2rem"}>
            {contents.map((c) => (
              <>
                <Box
                  bg={"gray.900"}
                  color={"white"}
                  rounded={"lg"}
                  p={6}
                  h={"100%"}
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
                      <Heading size={"md"}>{c.displayName}</Heading>
                      <Text size={"sm"} color={"gray.400"}>
                        /course/{courseName[1]}/{c.url}
                      </Text>
                      <Badge colorScheme={c.type === "TEXT" ? "green" : "blue"}>
                        {c.type === "TEXT" ? "Text" : "Video"}
                      </Badge>
                      <IconButton
                        aria-label={"Löschen"}
                        icon={<FaTrash />}
                        variant={"ghost"}
                        colorScheme={"red"}
                        onClick={async () => {
                          const res = await REST.Admin.deleteContent({
                            token: localStorage.getItem("token") as string,
                            cid: c._id,
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
                    >{`Erstellt am: ${new Date(c.createdAt)
                      .toLocaleString()
                      .replace(",", " um")}`}</Text>
                    <ButtonGroup mt={6}>
                      <Button
                        w={"100%"}
                        leftIcon={<FaFile />}
                        onClick={() => {
                          // create blob url that shows the text content in a new window
                          const blob = new Blob([c.textContent], {
                            type: "text/plain",
                          });

                          const url = URL.createObjectURL(blob);

                          window.open(url, "_blank");
                        }}
                      >
                        Text Anzeigen
                      </Button>
                      {c.type === "VIDEO" ? (
                        <>
                          <Button
                            leftIcon={<FaYoutube />}
                            w={"100%"}
                            onClick={() => {
                              window.open(c.videoUrl, "_blank");
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
                          router.push(`/course/${courseName[1]}/${c.url}`);
                        }}
                      >
                        Anzeigen
                      </Button>
                    </ButtonGroup>
                  </Flex>
                </Box>
              </>
            ))}
          </Grid>
        </AdminContentsLayout>
      </AdminLayout>
    </>
  );
}
