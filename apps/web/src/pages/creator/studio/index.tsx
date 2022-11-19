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
  InputLeftAddon,
  InputLeftElement,
  Select,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  FaBookReader,
  FaCheckCircle,
  FaEye,
  FaPen,
  FaPlus,
  FaSearch,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";
import { useEffect } from "react";
import REST from "@codeup/rest";
import { useRouter } from "next/router";
import CourseEditor from "@codeup/components/creator/studio/CourseEditor";

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
      available: boolean;
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
    available: boolean;
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
      <CreatorStudioLayout>
        <Flex
          w={"100%"}
          h={"fit-content"}
          direction={"column"}
          alignItems={"center"}
          mt={"4rem"}
        >
          <Heading
            fontSize={["3xl", "6xl"]}
            color={"white"}
            textAlign={"center"}
            fontWeight={"bold"}
            fontFamily={"Seymour One"}
            maxW={["75%", "50%"]}
            textShadow={"0px 10px 100px #000000"}
          >
            Willkommen im Creator Studio
          </Heading>
          <InputGroup
            w={["75%", "50%"]}
            mt={"2rem"}
            maxW={["75%", "50%"]}
            boxShadow={"xl"}
          >
            <InputLeftElement pointerEvents="none">
              <FaSearch />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Meine Kurse durchsuchen"
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              colorScheme={"blue"}
              ml={2}
              onClick={() => {
                router.push("/creator/studio/create/course");
              }}
            >
              Neu
            </Button>
          </InputGroup>
          <Grid
            templateColumns={["1fr", "1fr 1fr", "1fr 1fr 1fr"]}
            gap={6}
            mt={"2rem"}
            w={"100%"}
          >
            {courses &&
              courses
                .filter((c) =>
                  c.name.toLowerCase().includes(query.toLowerCase())
                )
                .map((course) => (
                  <GridItem m={4}>
                    <Box
                      bg={"gray.900"}
                      color={"white"}
                      rounded={"lg"}
                      p={6}
                      h={"100%"}
                    >
                      <Flex
                        justifyContent={"space-between"}
                        direction={"column"}
                        gap={2}
                      >
                        <>
                          <Image
                            src={course.splashImage}
                            alt={course.name}
                            shadow={"xl"}
                            w={"100%"}
                            h={"150px"}
                          />
                          <Heading
                            size={"lg"}
                            color={"white"}
                            fontWeight={"bold"}
                            textAlign={"left"}
                            mt={4}
                          >
                            {course.name}
                          </Heading>
                          <Heading
                            size={"md"}
                            color={"gray.400"}
                            fontWeight={"normal"}
                            textAlign={"left"}
                          >
                            {course.available ? (
                              <>
                                <Badge colorScheme={"green"} fontSize={"md"}>
                                  Öffentlich
                                </Badge>
                              </>
                            ) : (
                              <>
                                <Badge colorScheme={"red"} fontSize={"md"}>
                                  Privat
                                </Badge>
                              </>
                            )}
                          </Heading>
                          <Heading
                            size={"md"}
                            color={"gray.400"}
                            fontWeight={"normal"}
                            textAlign={"left"}
                          >
                            {course.description}
                          </Heading>
                          <ButtonGroup mt={4} w={"100%"}>
                            <Button
                              w={"100%"}
                              colorScheme={"blue"}
                              leftIcon={<FaPen />}
                              onClick={() => {
                                setCurrentCourse(course);
                                onCourseEditorOpen();
                              }}
                            >
                              Bearbeiten
                            </Button>
                            <Button
                              w={"100%"}
                              colorScheme={"red"}
                              leftIcon={<FaTrash />}
                              onClick={async () => {
                                if (
                                  confirm(
                                    "Willst du diesen Kurs wirklich löschen?"
                                  )
                                ) {
                                  const res = await REST.Creator.deleteCourse({
                                    token: localStorage.getItem(
                                      "token"
                                    ) as string,
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
                                      courses.filter(
                                        (c) => c._id !== course._id
                                      )
                                    );
                                  } else {
                                    toast({
                                      title: "Fehler",
                                      description:
                                        "Löschen fehlgeschlagen: " +
                                        res.payload.error,
                                      status: "error",
                                      duration: 1500,
                                      isClosable: true,
                                    });
                                  }
                                }
                              }}
                            >
                              Löschen
                            </Button>
                          </ButtonGroup>
                          <Button
                            w={"100%"}
                            colorScheme={"green"}
                            leftIcon={<FaEye />}
                            mt={4}
                            onClick={() => {
                              router.push("/creator/studio/" + course._id);
                            }}
                          >
                            Lektionen
                          </Button>
                        </>
                      </Flex>
                    </Box>
                  </GridItem>
                ))}
          </Grid>
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
