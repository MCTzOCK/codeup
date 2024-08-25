"use client";
/**
 * apps/web/src/pages/interactive/test.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.08.2024
 *
 */

import * as React from "react";
import { Box, Button, Flex, Stack, Text, Textarea } from "@chakra-ui/react";
import { sProp } from "../../global/i18nstaticProps";
import { CHeading } from "@codeup/components/dist/global/CHeading";
//import CodeBlock from "../../special-components/CodeBlock";
import PopupManager from "../../global/PopupManager";
import Highlight from "react-highlight";
import "highlight.js/styles/base16/3024.min.css";

const testData: {
  title: string;
  introduction: string;
  steps: {
    text: string;
    code: string;
    language: string;
    correct: string;
    task: string;
  }[];
} = {
  title: "Test Interactive",
  introduction:
    "Ein Array in JavaScript ist eine spezielle Art von Objekt, das eine geordnete Sammlung von Elementen enthält. Ein Array kann beliebig viele Elemente enthalten und jedes Element kann einen beliebigen Datentyp haben. Ein Array kann auch andere Arrays enthalten, die als verschachtelte Arrays bezeichnet werden. Ein Array kann auch als Liste bezeichnet werden.",
  steps: [
    {
      text: "Ein Array kann wie folgt deklariert werden:",
      code: `String s = "";  void let arrayName = [element1, element2, ..., elementN];`,
      correct: "let myArray = [1, 2, 3];",
      language: "java",
      task: "Erstelle ein Array mit dem Namen 'myArray' und fülle es mit den Elementen '1', '2' und '3'.",
    },
  ],
};

export default function Test() {
  return (
    <>
      <Flex
        w={"100%"}
        minH={"100vh"}
        bg={"#000"}
        p={4}
        justifyContent={"center"}
        pt={12}
      >
        <Box
          bg={"gray.900"}
          rounded={"xl"}
          p={4}
          minW={"70%"}
          w={"fit-content"}
          maxW={{
            base: "100%",
            sm: "100%",
            md: "80%",
            lg: "70%",
            xl: "60%",
          }}
        >
          <CHeading size={"lg"} textAlign={"center"}>
            {testData.title}
          </CHeading>
          <Stack spacing={4}>
            <Flex
              gap={2}
              direction={{
                base: "column",
                sm: "column",
                md: "row",
                lg: "row",
                xl: "row",
              }}
            >
              <Box flex={"100%"}>
                <Text fontSize={"lg"} mt={2}>
                  Ein Array in JavaScript ist eine spezielle Art von Objekt, das
                  eine geordnete Sammlung von Elementen enthält. Ein Array kann
                  beliebig viele Elemente enthalten und jedes Element kann einen
                  beliebigen Datentyp haben. Ein Array kann auch andere Arrays
                  enthalten, die als verschachtelte Arrays bezeichnet werden.
                  Ein Array kann auch als Liste bezeichnet werden.
                </Text>
              </Box>
              <Box flex={"100%"}></Box>
            </Flex>
            {testData.steps.map((step, index) => {
              return (
                <>
                  <Flex
                    gap={6}
                    direction={{
                      base: "column",
                      sm: "column",
                      md: "row",
                      lg: "row",
                      xl: "row",
                    }}
                  >
                    <Box flex={"100%"}>
                      <Text fontSize={"lg"} mt={2}>
                        {step.text}
                        <br />
                        <Highlight
                          className={step.language + " code-block-cup"}
                        >
                          {step.code}
                        </Highlight>
                        <br />
                        {step.task}
                      </Text>
                      <Textarea
                        mt={4}
                        placeholder={"Deine Antwort"}
                        id={"step-" + index + "-answer"}
                        bg={"gray.600"}
                        fontSize={"xl"}
                      />
                      <Flex gap={4} direction={"row"}>
                        <Button
                          mt={4}
                          variant={"brand"}
                          onClick={() => {
                            const text = (
                              document.getElementById(
                                "step-" + index + "-answer"
                              ) as HTMLInputElement
                            ).value;

                            if (text === step.correct) {
                              PopupManager.alertAsync({
                                title: "Richtig!",
                                description: "Deine Antwort ist korrekt!",
                              });
                            } else {
                              PopupManager.alertAsync({
                                title: "Falsch!",
                                description: "Deine Antwort ist leider falsch!",
                              });
                            }
                          }}
                        >
                          Überprüfen
                        </Button>
                        <Button
                          mt={4}
                          variant={"brand"}
                          onClick={() => {
                            (
                              document.getElementById(
                                "step-" + index + "-answer"
                              ) as HTMLInputElement
                            ).value = step.correct;
                          }}
                        >
                          Lösen
                        </Button>
                      </Flex>
                    </Box>
                  </Flex>
                </>
              );
            })}
          </Stack>
        </Box>
      </Flex>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["kids"])),
  };
}
