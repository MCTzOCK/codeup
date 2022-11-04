/**
 * apps/web/src/pages/admin/contents/videos/[vid].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.11.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import REST from "@codeup/rest";
import AdminContentsLayout from "@codeup/components/admin/AdminContentsLayout";
import { useEffect, useState } from "react";
import { FaBookOpen, FaCheck, FaGlobe, FaTrash } from "react-icons/fa";
import dynamic from "next/dynamic";
const SimpleMdeReact = dynamic(import("react-simplemde-editor"), {
  ssr: false,
});
import "easymde/dist/easymde.min.css";

export default function VideoViewer() {
  const router = useRouter();

  const [video, setVideo] = React.useState<{
    name: string;
    _id: string;
    course: string;
    friendlyName: string;
    transcript: string;
    youtube: string;
    quiz: {
      question: string;
      answers: {
        answer: string;
        correct: boolean;
      }[];
    }[];
    createdAt: string;
    __v: number;
  }>();
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (router.query.vid) {
      REST.Admin.getVideo({
        token: localStorage.getItem("token") as string,
        vid: router.query.vid as string,
      }).then((res) => {
        if (res.status === 200) {
          setVideo(res.payload.video);
          setLoaded(true);
          setQuizQuestions(res.payload.video.quiz);
          setTranscript(res.payload.video.transcript);
        } else {
          router.push("/admin/contents/videos");
        }
      });
    }
  }, [router]);

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
          {!loaded ? (
            <>
              <Flex
                w={"100%"}
                h={"100vh"}
                justifyContent={"center"}
                alignItems={"center"}
                direction={"column"}
              >
                <CircularProgress
                  size={"80px"}
                  isIndeterminate
                  color="red.300"
                />
                <Heading size={"lg"} mt={4}>
                  Laden...
                </Heading>
              </Flex>
            </>
          ) : (
            <>
              <Box w={"full"} mt={"2rem"} p={"2rem"}>
                <Heading size={"lg"} mb={"2rem"}>
                  Video Bearbeiten
                </Heading>
                <Box w={["100%", "50%"]}>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      const data = new FormData(e.target as HTMLFormElement);

                      const title = data.get("title") as string;
                      const friendlyName = data.get("friendlyName") as string;
                      const course = data.get("course") as string;
                      const quiz = quizQuestions;

                      const res = await REST.Admin.updateVideo({
                        token: localStorage.getItem("token") as string,
                        vid: router.query.vid as string,
                        update: {
                          name: title,
                          friendlyName,
                          transcript,
                          // @ts-ignore
                          quiz,
                        },
                      });

                      if (res.status === 200) {
                        router.push("/admin/contents/videos");
                      } else {
                        alert("Fehler beim Speichern!");
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
                          defaultValue={video?.name}
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
                          defaultValue={video?.friendlyName}
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
                          defaultValue={video?.youtube.split("=")[1]}
                          disabled
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl mt={"2rem"} isRequired>
                      <FormLabel>Transkript / Beschreibung</FormLabel>
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
                                            if (
                                              q.question === question.question
                                            ) {
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
                                      colorScheme={
                                        answer.correct ? "green" : "red"
                                      }
                                      onClick={() => {
                                        setQuizQuestions(
                                          quizQuestions.map((q) => {
                                            if (
                                              q.question === question.question
                                            ) {
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
                                Erstellen
                              </Button>
                            </Td>
                            <Td></Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                    <ButtonGroup w={"100%"} mt={"2rem"}>
                      <Button
                        type={"submit"}
                        colorScheme={"green"}
                        flex={"100%"}
                        leftIcon={<FaCheck />}
                      >
                        Bestätigen
                      </Button>

                      <Button
                        colorScheme={"red"}
                        flex={"100%"}
                        leftIcon={<FaTrash />}
                        onClick={async () => {
                          if (
                            confirm("Soll das Video wirklich gelöscht werden?")
                          ) {
                            await REST.Admin.deleteVideo({
                              token: localStorage.getItem("token") as string,
                              vid: router.query.vid as string,
                            });

                            router.push("/admin/contents/videos");
                          }
                        }}
                      >
                        Löschen
                      </Button>
                    </ButtonGroup>
                  </form>
                </Box>
              </Box>
            </>
          )}
        </AdminContentsLayout>
      </AdminLayout>
    </>
  );
}
