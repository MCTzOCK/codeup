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

  useEffect(() => {
    console.log(quizQuestions);
  }, [quizQuestions]);

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
                  <FormLabel>Kurs</FormLabel>
                  <Select name={"course"}>
                    <option value={"__codeup.no_course"}>Kein Kurs</option>
                    {courses?.map((course: string) => (
                      <option value={course}>{course}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl mt={"2rem"} isRequired>
                  <FormLabel>Transkript</FormLabel>
                  <Textarea
                    name={"transcript"}
                    placeholder={"Transkript"}
                    required
                  />
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
