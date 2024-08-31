/**
 * packages/components/creator/studio/InteractiveLessonCreator.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.08.2024
 *
 */

import * as React from "react";
import {
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { FaTrash } from "react-icons/fa";

export default function InteractiveLessonCreator(props: {
  steps: {
    text: string;
    code: string;
    language: string;
    correct: string;
    task: string;
  }[];
  setSteps: (
    v: {
      text: string;
      code: string;
      language: string;
      correct: string;
      task: string;
    }[]
  ) => void;
}) {
  const { t } = useTranslation("creator-studio");

  return (
    <>
      {
        // @ts-ignore
        props.steps.map((step, index) => {
          return (
            <div key={index}>
              <HStack
                justifyContent={"space-between"}
                mt={4}
                mb={2}
                alignItems={"center"}
              >
                <Text fontSize={"md"}>
                  {t("interactive.step")} #{index + 1}
                </Text>
                <IconButton
                  aria-label={t("interactive.delete.step")}
                  icon={<FaTrash />}
                  colorScheme={"red"}
                  onClick={() => {
                    const newSteps = [...props.steps];
                    newSteps.splice(index, 1);
                    props.setSteps(newSteps);
                  }}
                />
              </HStack>
              <FormControl id={`text-${index}`}>
                <FormLabel>{t("interactive.step.text")}</FormLabel>
                <Textarea
                  value={step.text}
                  onChange={(e) => {
                    const newSteps = [...props.steps];
                    newSteps[index].text = e.target.value;
                    props.setSteps(newSteps);
                  }}
                />
              </FormControl>
              <FormControl id={`code-${index}`}>
                <FormLabel>{t("interactive.step.code")}</FormLabel>
                <Textarea
                  value={step.code}
                  onChange={(e) => {
                    const newSteps = [...props.steps];
                    newSteps[index].code = e.target.value;
                    props.setSteps(newSteps);
                  }}
                />
              </FormControl>
              <FormControl id={`correct-${index}`}>
                <FormLabel>{t("interactive.step.correct")}</FormLabel>
                <Textarea
                  value={step.correct}
                  onChange={(e) => {
                    const newSteps = [...props.steps];
                    newSteps[index].correct = e.target.value;
                    props.setSteps(newSteps);
                  }}
                />
              </FormControl>
              <FormControl id={`language-${index}`}>
                <FormLabel>{t("interactive.step.language")}</FormLabel>
                <Input
                  value={step.language}
                  onChange={(e) => {
                    const newSteps = [...props.steps];
                    newSteps[index].language = e.target.value;
                    props.setSteps(newSteps);
                  }}
                />
              </FormControl>
              <FormControl id={`task-${index}`}>
                <FormLabel>{t("interactive.step.task")}</FormLabel>
                <Textarea
                  value={step.task}
                  onChange={(e) => {
                    const newSteps = [...props.steps];
                    newSteps[index].task = e.target.value;
                    props.setSteps(newSteps);
                  }}
                />
              </FormControl>
            </div>
          );
        })
      }
      <Button
        variant={"brand"}
        mt={4}
        onClick={async () => {
          const newSteps = [...props.steps];
          newSteps.push({
            text: "",
            code: "",
            correct: "",
            language: "",
            task: "",
          });
          props.setSteps(newSteps);
        }}
      >
        {t("interactive.create.step")}
      </Button>
    </>
  );
}
