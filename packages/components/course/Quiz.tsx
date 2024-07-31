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
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaTwitter } from "react-icons/fa";
import CodeUpModal from "../codeup/CodeUpModal";
import { CHeading } from "../global/CHeading";
import { useTranslation } from "next-i18next";

export default function Quiz(props: {
  title: string;
  questions: {
    question: string | React.ReactNode;
    difficulty?: "easy" | "medium" | "hard";
    answers: {
      answer: string | React.ReactNode;
      correct: boolean;
    }[];
  }[];
  successCB?: () => void;
}) {
  const { t } = useTranslation("courses");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [correctAnswers, setCorrectAnswers] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const [correctAnswersList, setCorrectAnswersList] = React.useState<number[]>(
    []
  );
  const [finishedValue, setFinishedValue] = React.useState(0);

  React.useEffect(() => {
    if (
      finished &&
      finishedValue < 100 &&
      finishedValue <
        Math.round((correctAnswers * 100) / props.questions.length)
    ) {
      setFinishedValue(finishedValue + 1);
    }
  }, [finished, finishedValue]);

  return (
    <>
      <CodeUpModal
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        blackBackground={true}
        title={
          props.title +
          " (" +
          (finished
            ? t("result")
            : t("quiz.question")
                .replace("{0}", (currentQuestion + 1).toString())
                .replace("{1}", props.questions.length.toString())) +
          ")"
        }
        noCloseButton={true}
      >
        {finished ? (
          <>
            <Flex
              alignItems="center"
              justifyContent="center"
              direction="column"
            >
              <CircularProgress
                value={finishedValue}
                color={
                  finishedValue >= 50 && finishedValue < 75
                    ? "orange.400"
                    : finishedValue >= 75
                    ? "green.400"
                    : "red.400"
                }
                thickness={"10px"}
                mt={"1.2rem"}
                size="120px"
              >
                <CircularProgressLabel
                  color={
                    finishedValue >= 50 && finishedValue < 75
                      ? "orange.400"
                      : finishedValue >= 75
                      ? "green.400"
                      : "red.400"
                  }
                >
                  {finishedValue}%
                </CircularProgressLabel>
              </CircularProgress>

              <Text color={"white"} mt="2rem" mb={"3rem"}>
                {t("quiz.question.result")
                  .replace("{0}", correctAnswers.toString())
                  .replace("{1}", props.questions.length.toString())}
              </Text>

              <CHeading size={"lg"}>{t("quiz.answers.correct")}</CHeading>
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
                              {correctAnswersList.includes(i) ? (
                                <Badge
                                  ml="1rem"
                                  colorScheme={a.correct ? "green" : "red"}
                                >
                                  Ausgewählt
                                </Badge>
                              ) : null}
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
                  variant={"brand"}
                  onClick={() => {
                    let correctAnswers = correctAnswersList.length;
                    let totalQuestions = props.questions.length;

                    setCurrentQuestion(0);
                    setCorrectAnswers(0);
                    setFinishedValue(0);
                    setCorrectAnswersList([]);
                    setFinished(false);
                    onClose();

                    if (props.successCB && correctAnswers === totalQuestions) {
                      props.successCB();
                    }
                  }}
                >
                  {t("close")}
                </Button>
              </ButtonGroup>
            </Flex>

            <ButtonGroup
              isAttached
              position={"absolute"}
              top={"2rem"}
              right={"2rem"}
            >
              <IconButton
                icon={<FaTwitter />}
                aria-label={t("share.twitter")}
                variant={"brand"}
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
              />
            </ButtonGroup>
          </>
        ) : null}
        {!finished ? (
          <>
            <motion.div
              animate={{
                opacity: 1,
                x: 0,
              }}
              initial={{
                opacity: 0,
                x: -100,
              }}
              // @ts-ignore
              transition={{
                duration: 0.3,
              }}
              key={currentQuestion}
              exit={{
                x: -40,
              }}
            >
              <Progress
                size="sm"
                value={(currentQuestion / props.questions.length) * 100}
                variant={"brand"}
                rounded={"md"}
              />

              <Text fontSize={"1.5rem"} mt={"1rem"}>
                {props.questions[currentQuestion].question}
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
            </motion.div>
          </>
        ) : null}
      </CodeUpModal>

      <Box mt="1rem">
        <Heading size={"lg"}>{t("quiz")}</Heading>
        <Text fontSize="1.5rem" mt="1.2rem">
          {t("quiz.text").replace("{0}", props.questions.length.toString())}
        </Text>
        <Button
          mt="1.2rem"
          variant={"brand"}
          size="lg"
          onClick={() => {
            setFinished(false);
            setCurrentQuestion(0);
            setCorrectAnswers(0);
            setFinishedValue(0);
            setCorrectAnswersList([]);
            onOpen();
          }}
        >
          {finished ? t("quiz.restart") : t("quiz.start")}
        </Button>
      </Box>
    </>
  );
}
