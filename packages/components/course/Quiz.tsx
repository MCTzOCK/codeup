/**
 * src/components/course/Quiz.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.09.2022
 *
 */

import * as React from "react";

import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
  Progress,
  Divider,
  Spinner,
  CircularProgress,
  CircularProgressLabel,
  ButtonGroup,
  Accordion,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { FaTwitter } from "react-icons/fa";

export default function Quiz(props: {
  title: string;
  questions: {
    question: string | React.ReactNode;
    difficulty: "easy" | "medium" | "hard";
    answers: {
      answer: string | React.ReactNode;
      correct: boolean;
    }[];
  }[];
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [correctAnswers, setCorrectAnswers] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const [correctAnswersList, setCorrectAnswersList] = React.useState<number[]>(
    []
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={["full", "2xl"]}
        isCentered
        closeOnOverlayClick={false}
        onEsc={() => {
          return;
        }}
        scrollBehavior={"inside"}
      >
        <ModalOverlay backgroundColor="black" />
        <ModalContent backgroundColor={"black"} id="codeup-quiz-modal">
          <ModalHeader backgroundColor={"black"}>
            {props.title} (
            {finished
              ? "Ergebnis"
              : `Frage ${currentQuestion + 1} von ${props.questions.length}`}
            )
          </ModalHeader>
          <ModalBody backgroundColor={"black"}>
            {finished ? (
              <>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                >
                  <CircularProgress
                    value={(correctAnswers / props.questions.length) * 100}
                    color={
                      (correctAnswers / props.questions.length) * 100 >= 50 &&
                      (correctAnswers / props.questions.length) * 100 < 75
                        ? "orange.400"
                        : (correctAnswers / props.questions.length) * 100 >= 75
                        ? "green.400"
                        : "red.400"
                    }
                    thickness={"10px"}
                    mt={"1.2rem"}
                    size="120px"
                  >
                    <CircularProgressLabel
                      color={
                        (correctAnswers / props.questions.length) * 100 >= 50 &&
                        (correctAnswers / props.questions.length) * 100 < 75
                          ? "orange.400"
                          : (correctAnswers / props.questions.length) * 100 >=
                            75
                          ? "green.400"
                          : "red.400"
                      }
                    >
                      {Math.round(
                        (correctAnswers / props.questions.length) * 100
                      )}
                      %
                    </CircularProgressLabel>
                  </CircularProgress>

                  <Text color={"white"} mt="2rem">
                    Du hast {correctAnswers} von {props.questions.length} Fragen
                    richtig beantwortet.
                  </Text>

                  <Heading color={"white"} mt="3rem" size="lg">
                    Richtige Antworten
                  </Heading>
                  <Accordion mt="1.2rem" allowToggle>
                    {props.questions.map((q, i) => {
                      return (
                        <AccordionItem key={i}>
                          <AccordionButton>
                            <Box
                              flex="1"
                              textAlign="left"
                              color={
                                correctAnswersList.includes(i)
                                  ? "green.400"
                                  : "red.400"
                              }
                            >
                              &gt;&nbsp;{q.question}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            {q.answers.map((a, i) => {
                              return (
                                <Text
                                  color={a.correct ? "green.400" : "gray.400"}
                                  key={i}
                                  textDecoration={
                                    !a.correct ? "line-through" : "none"
                                  }
                                >
                                  {a.answer}
                                </Text>
                              );
                            })}
                          </AccordionPanel>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>

                  <ButtonGroup mt="3rem" isAttached>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => {
                        setCurrentQuestion(0);
                        setCorrectAnswers(0);
                        setCorrectAnswersList([]);
                        setFinished(false);
                        onClose();
                      }}
                    >
                      Schließen
                    </Button>
                  </ButtonGroup>
                </Flex>

                <IconButton
                  icon={<FaTwitter />}
                  aria-label="Share on Twitter"
                  colorScheme="twitter"
                  onClick={async () => {
                    window.open(
                      `https://twitter.com/intent/tweet?text=Ich%20habe%20${correctAnswers}%20von%20${
                        props.questions.length
                      }%20Fragen%20im%20%23CodeUp%20Quiz%20%22${
                        props.title
                      }%22%20richtig%20beantwortet.%20Wie%20viel%20schaffst%20du%3F%20${encodeURIComponent(
                        window.location.href
                      )}`,
                      "_blank"
                    );
                  }}
                  variant="outline"
                  position={"absolute"}
                  top={"2rem"}
                  right={"2rem"}
                />
              </>
            ) : null}
            {!finished ? (
              <>
                <Progress
                  size="sm"
                  value={(currentQuestion / props.questions.length) * 100}
                  colorScheme={"green"}
                />

                <Text fontSize={"1.5rem"} mt={"1rem"}>
                  {props.questions[currentQuestion].question}
                  <Badge
                    ml="1rem"
                    variant="outline"
                    colorScheme={
                      props.questions[currentQuestion].difficulty === "easy"
                        ? "green"
                        : props.questions[currentQuestion].difficulty ===
                          "medium"
                        ? "orange"
                        : "red"
                    }
                  >
                    {props.questions[currentQuestion].difficulty === "easy"
                      ? "Einfach"
                      : props.questions[currentQuestion].difficulty === "medium"
                      ? "Mittel"
                      : "Schwer"}
                  </Badge>
                </Text>
                <Divider mt={"1rem"} />
                <Flex direction={"column"} gap={"1rem"} mt={"1rem"}>
                  {props.questions[currentQuestion].answers.map((a, i) => (
                    <Button
                      key={i}
                      onClick={() => {
                        if (a.correct) {
                          setCorrectAnswers(correctAnswers + 1);
                          setCorrectAnswersList([
                            ...correctAnswersList,
                            currentQuestion,
                          ]);
                        }
                        if (currentQuestion + 1 < props.questions.length) {
                          setCurrentQuestion(currentQuestion + 1);
                        } else {
                          setFinished(true);
                        }
                      }}
                    >
                      {a.answer}
                    </Button>
                  ))}
                </Flex>
              </>
            ) : null}
          </ModalBody>
          <ModalFooter backgroundColor={"black"}>
            <Flex
              justifyContent={"center"}
              gap="1.2rem"
              width={"100%"}
              alignItems="center"
            >
              <img src="/codeup.svg" width={64} height={64} />
              <Heading color={"white"} size="lg">
                CodeUp
              </Heading>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box mt="1rem">
        <Heading size={"lg"}>Quiz</Heading>
        <Text fontSize="1.5rem" mt="1.2rem">
          Schau, wie gut du diese Lektion verstanden hast! Dieses Quiz besteht
          aus&nbsp;
          {props.questions.length} Fragen.
        </Text>
        <Button
          mt="1.2rem"
          colorScheme={"whatsapp"}
          size="lg"
          onClick={() => {
            setFinished(false);
            setCurrentQuestion(0);
            setCorrectAnswers(0);
            setCorrectAnswersList([]);
            onOpen();
          }}
        >
          {finished ? "Erneut starten" : "Quiz starten"}
        </Button>
      </Box>
    </>
  );
}
