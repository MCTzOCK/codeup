/**
 * packages/components/admin/AdminQuizMaker.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.11.2022
 *
 */

import * as React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  IconButton,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

export default function AdminQuizMaker(props: {
  quizQuestions: {
    question: string;
    answers: {
      answer: string;
      correct: boolean;
    }[];
  }[];
  setQuizQuestions: React.Dispatch<
    React.SetStateAction<
      {
        question: string;
        answers: {
          answer: string;
          correct: boolean;
        }[];
      }[]
    >
  >;
}) {
  const [newQuestion, setNewQuestion] = useState<string>("");

  const quizQuestions = props.quizQuestions;
  const setQuizQuestions = props.setQuizQuestions;

  return (
    <>
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
                                q.answers[i].answer = e.target.value as string;
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
                                q.answers[j].correct = !q.answers[j].correct;
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
    </>
  );
}
