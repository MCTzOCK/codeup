/**
 * apps/web/src/pages/admin/contents/videos/new.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.10.2022
 *
 */

import * as React from "react";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import AdminContentsLayout from "@codeup/components/admin/AdminContentsLayout";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { FaBookOpen, FaGlobe, FaTrash } from "react-icons/fa";
import REST from "@codeup/rest";
import { Promise } from "mongoose";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const SimpleMdeReact = dynamic(import("react-simplemde-editor"), {
  ssr: false,
});
import "easymde/dist/easymde.min.css";

export default function New() {
  const router = useRouter();

  const [courses, setCourses] = useState<string[]>([]);

  const [newQuestion, setNewQuestion] = useState<string>("");

  const [quizQuestions, setQuizQuestions] = useState<
    {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    }[]
  >([]);

  useEffect(() => {
    REST.Admin.listCourses(localStorage.getItem("token") as string, true).then(
      (res) => {
        setCourses(res.payload.courses);
      }
    );
  }, []);
  const [transcript, setTranscript] = useState<string>("");

  return (
    <>
      <AdminLayout>
        <AdminContentsLayout>
          <Box w={"full"} mt={"2rem"} p={"2rem"}>
            <Heading size={"lg"} mb={"2rem"}>
              Neues Video
            </Heading>
            <Box w={["100%", "50%"]}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const data = new FormData(e.target as HTMLFormElement);

                  const title = data.get("title") as string;
                  const friendlyName = data.get("friendlyName") as string;
                  const youtubeURL = ("https://www.youtube.com/watch?v=" +
                    data.get("youtubeId")) as string;
                  const course = data.get("course") as string;
                  const quiz = quizQuestions;

                  const res = await REST.Admin.createVideo({
                    token: localStorage.getItem("token") as string,
                    title,
                    friendlyName,
                    youtubeURL,
                    course,
                    transcript,
                    quiz,
                  });

                  if (res.status === 200) {
                    router.push("/admin/contents/videos");
                  } else {
                    alert("Error. View console for more information.");
                    console.error(res);
                  }
                }}
              >
                <FormControl isRequired>
                  <FormLabel>Titel</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>
                      <FaBookOpen />
                    </InputLeftAddon>
                    <Input
                      type={"text"}
                      name={"title"}
                      placeholder={"Titel"}
                      required
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mt={"2rem"} isRequired>
                  <FormLabel>URL Freundlicher Name</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>
                      <FaGlobe />
                    </InputLeftAddon>
                    <Input
                      type={"text"}
                      name={"friendlyName"}
                      placeholder={"URL Freundlicher Name"}
                      required
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mt={"2rem"} isRequired>
                  <FormLabel>YouTube URL</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>youtube.com/watch?v=</InputLeftAddon>
                    <Input
                      type={"text"}
                      name={"youtubeId"}
                      placeholder={"Video-ID"}
                      required
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mt={"2rem"} isRequired>
                  <FormLabel>Kurs Zugehörigkeit</FormLabel>
                  <Select name={"course"}>
                    <option value={"__codeup.no_course"}>Kein Kurs</option>
                    {courses?.map((course: any) => (
                      <option value={course.id}>{course.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl mt={"2rem"} isRequired>
                  <FormLabel>Transkript</FormLabel>
                  {navigator ? (
                    <>
                      <SimpleMdeReact
                        value={transcript}
                        onChange={(e) => setTranscript(e)}
                      />
                    </>
                  ) : null}
                </FormControl>
                <Heading size={"md"} mt={"2rem"}>
                  Quiz
                </Heading>
                <TableContainer mt={"2rem"}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Frage</Th>
                        <Th>Antworten</Th>
                        <Th>Aktion</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {quizQuestions.map((question, index) => (
                        <Tr>
                          <Td>
                            {question.question}
                            <IconButton
                              aria-label={"Löschen"}
                              icon={<FaTrash />}
                              ml={"1rem"}
                              colorScheme={"red"}
                              variant={"ghost"}
                              onClick={() => {
                                setQuizQuestions(
                                  quizQuestions.filter(
                                    (q) => q.question !== question.question
                                  )
                                );
                              }}
                            />
                          </Td>
                          <Td>
                            {question.answers.map((answer, i) => (
                              <Box>
                                <Input
                                  mt={2}
                                  type={"text"}
                                  defaultValue={answer.answer}
                                  onChange={(e) => {
                                    setQuizQuestions(
                                      quizQuestions.map((q) => {
                                        if (q.question === question.question) {
                                          q.answers[i].answer = e.target
                                            .value as string;
                                        }
                                        return q;
                                      })
                                    );
                                  }}
                                />
                              </Box>
                            ))}
                          </Td>
                          <Td>
                            {question.answers.map((answer, j) => (
                              <Box>
                                <Button
                                  mt={2}
                                  colorScheme={answer.correct ? "green" : "red"}
                                  onClick={() => {
                                    setQuizQuestions(
                                      quizQuestions.map((q) => {
                                        if (q.question === question.question) {
                                          q.answers[j].correct =
                                            !q.answers[j].correct;
                                        }
                                        return q;
                                      })
                                    );
                                  }}
                                >
                                  {answer.correct ? "Richtig" : "Falsch"}
                                </Button>
                              </Box>
                            ))}
                          </Td>
                        </Tr>
                      ))}
                      <Tr>
                        <Td>
                          <Input
                            type={"text"}
                            placeholder={"Frage"}
                            id={"new-question-input"}
                            onChange={(e) => {
                              setNewQuestion(e.target.value as string);
                            }}
                          />
                        </Td>
                        <Td>
                          <Button
                            colorScheme={"green"}
                            onClick={() => {
                              setQuizQuestions([
                                ...quizQuestions,
                                {
                                  question: newQuestion,
                                  answers: [
                                    {
                                      answer: "",
                                      correct: false,
                                    },
                                    {
                                      answer: "",
                                      correct: false,
                                    },
                                    {
                                      answer: "",
                                      correct: false,
                                    },
                                    {
                                      answer: "",
                                      correct: false,
                                    },
                                  ],
                                },
                              ]);

                              setNewQuestion("");

                              (
                                document.getElementById(
                                  "new-question-input"
                                ) as HTMLInputElement
                              ).value = "";
                            }}
                          >
                            Erstelen
                          </Button>
                        </Td>
                        <Td></Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <Button
                  type={"submit"}
                  colorScheme={"green"}
                  mt={"2rem"}
                  w={"100%"}
                >
                  Erstellen
                </Button>
              </form>
            </Box>
          </Box>
        </AdminContentsLayout>
      </AdminLayout>
    </>
  );
}
