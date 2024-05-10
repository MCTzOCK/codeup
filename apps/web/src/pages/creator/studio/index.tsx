/**
 * apps/web/src/pages/creator/studio/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.11.2022
 *
 */

import * as React from "react";
import { useEffect } from "react";
import CreatorStudioLayout from "@codeup/components/creator/studio/CreatorStudioLayout";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  FaCertificate,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaPen,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import REST from "@codeup/rest";
import { useRouter } from "next/router";
import CourseEditor from "@codeup/components/creator/studio/CourseEditor";
import Head from "next/head";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import GridLayoutV2 from "@codeup/components/global/GridLayoutV2";
import PopupManager from "../../../global/PopupManager";

export default function Index() {
  const [query, setQuery] = React.useState("");

  const {
    onOpen: onCourseEditorOpen,
    onClose: onCourseEditorClose,
    isOpen: isCourseEditorOpen,
  } = useDisclosure();

  const [courses, setCourses] = React.useState<
    {
      __v: number;
      _id: string;
      available: string;
      contentPositions: string[];
      createdAt: string;
      creator: string;
      description: string;
      friendlyName: string;
      name: string;
      splashImage: string;
    }[]
  >([]);

  const [currentCourse, setCurrentCourse] = React.useState<{
    __v: number;
    _id: string;
    available: string;
    contentPositions: string[];
    createdAt: string;
    creator: string;
    description: string;
    friendlyName: string;
    name: string;
    splashImage: string;
  }>();

  useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    REST.Creator.getCourses(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setCourses(res.payload.courses);
        } else {
          toast({
            title: "Fehler",
            description:
              "Kurse konnten nicht geladen werden: " + res.payload.error,
            status: "error",
            duration: 1500,
            isClosable: true,
          });
        }
      }
    );
  };

  const router = useRouter();
  const toast = useToast();

  return (
    <>
      <Head>
        <title>Creator Studio - CodeUp</title>
      </Head>
      <CreatorStudioLayout>
        <Flex
          w={"100%"}
          h={"fit-content"}
          direction={"column"}
          bg={"#000"}
          minH={"100vh"}
        >
          <GridLayoutV2
            pageTitle={"Creator Studio"}
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
                  router.push("/creator/studio/create/course");
                },
              },
            ]}
            entries={courses.map((course) => {
              return {
                title: course.name,
                image: course.splashImage,
                fields: [
                  {
                    icon:
                      course.available === "public" ? (
                        <FaEye />
                      ) : course.available === "private" ? (
                        <FaEyeSlash />
                      ) : (
                        <FaLock />
                      ),
                    text:
                      course.available === "public"
                        ? "Öffentlich"
                        : course.available === "private"
                        ? "Privat"
                        : "Organisation",
                  },
                ],
                buttonRows: [
                  [
                    {
                      text: "Bearbeiten",
                      variant: "brand",
                      leftIcon: <FaPen />,
                      onClick: async () => {
                        setCurrentCourse(course);
                        onCourseEditorOpen();
                      },
                    },
                    {
                      text: "Löschen",
                      colorScheme: "red",
                      leftIcon: <FaTrash />,
                      onClick: async () => {
                        if (
                          await PopupManager.confirmAsync({
                            title: "Kurs löschen",
                            question: "Willst du diesen Kurs wirklich löschen?",
                          })
                        ) {
                          const res = await REST.Creator.deleteCourse({
                            token: localStorage.getItem("token") as string,
                            id: course._id,
                          });

                          if (res.status === 200) {
                            toast({
                              title: "Kurs gelöscht",
                              description:
                                "Der Kurs wurde erfolgreich gelöscht",
                              status: "success",
                              duration: 1500,
                              isClosable: true,
                            });

                            setCourses(
                              courses.filter((c) => c._id !== course._id)
                            );
                          } else {
                            toast({
                              title: "Fehler",
                              description:
                                "Löschen fehlgeschlagen: " + res.payload.error,
                              status: "error",
                              duration: 1500,
                              isClosable: true,
                            });
                          }
                        }
                      },
                    },
                  ],
                  [
                    {
                      text: "Lektionen",
                      variant: "brand",
                      leftIcon: <FaEye />,
                      onClick: () => {
                        router.push("/creator/studio/" + course._id);
                      },
                    },
                    {
                      text: "Zertifikat",
                      variant: "brand",
                      leftIcon: <FaCertificate />,
                      onClick: () => {
                        router.push(
                          "/creator/studio/certificate/" + course._id
                        );
                      },
                    },
                  ],
                ],
              };
            })}
          />
          {courses &&
            courses.length !== 0 &&
            courses.filter((c) =>
              c.name.toLowerCase().includes(query.toLowerCase())
            ).length === 0 && (
              <>
                <Heading
                  size={"md"}
                  color={"gray.400"}
                  fontWeight={"normal"}
                  textAlign={"center"}
                >
                  Keine Kurse gefunden
                </Heading>
              </>
            )}
          {courses && courses.length === 0 && (
            <>
              <Heading
                size={"md"}
                color={"gray.400"}
                fontWeight={"normal"}
                textAlign={"center"}
              >
                Du hast noch keine Kurse erstellt
              </Heading>
            </>
          )}
        </Flex>
      </CreatorStudioLayout>
      <CourseEditor
        course={currentCourse ? currentCourse : null}
        reload={reload}
        onOpen={onCourseEditorOpen}
        onClose={onCourseEditorClose}
        isOpen={isCourseEditorOpen}
      />
    </>
  );
}
