/**
 * apps/web/src/pages/course/html-basics/image.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import * as React from "react";
import HTMLCourseSections from "@codeup/components/course/HTMLCourseSections";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import CodeBlock from "../../../special-components/CodeBlock";
import { Quiz } from "@codeup/components/course";

export default function Lesson() {
  return (
    <>
      <HTMLCourseSections />
      <Flex
        direction={"column"}
        gap={"2rem"}
        margin={["1.2rem", "4rem"]}
        marginInline={["1.2rem", "16rem"]}
      >
        <Heading size={"xl"}>HTML Basics - Bilder</Heading>
        <Box>
          <Heading size={"lg"}>Was sind Bilder?</Heading>
          <Text fontSize={"1.5rem"} mt={"1.2rem"}>
            Bilder sind eine wichtige Komponente von Webseiten. Sie können
            verschiedene Formate haben, wie z.B. PNG, JPG, GIF, SVG, WEBP, usw.
            Bilder können auch als Hintergrundbilder verwendet werden.
          </Text>
        </Box>
        <Box>
          <Heading size={"lg"}>Wie füge ich ein Bild ein?</Heading>
          <Text fontSize={"1.5rem"} mt={"1.2rem"}>
            Ein Bild wird mit dem &lt;img&gt; Tag eingefügt. Dieser Tag muss ein{" "}
            <code>src</code>
            Attribut haben, welches den Pfad zum Bild angibt. Das Bild wird dann
            wie folgt eingefügt:
            <CodeBlock className={"html"}>
              {`<img src="path/to/image.png" />`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size={"lg"}>Wie kann ich das Bild skalieren?</Heading>
          <Text fontSize={"1.5rem"} mt={"1.2rem"}>
            Das Bild kann mit den Attributen <code>width</code> und&nbsp;
            <code>height</code> skaliert werden. Die Angabe erfolgt in Pixeln.
            <CodeBlock className={"html"}>
              {`<img src="path/to/image.png" width="100" height="100" />`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size={"lg"}>Wie kann ich das Bild beschreiben?</Heading>
          <Text fontSize={"1.5rem"} mt={"1.2rem"}>
            Das Bild kann mit dem Attribut <code>alt</code> beschrieben werden.
            Dies ist wichtig für die Barrierefreiheit. Dieser Text wird
            angezeigt, wenn das Bild nicht geladen werden kann.
            <CodeBlock className={"html"}>
              {`<img src="path/to/image.png" alt="Beschreibung des Bildes" />`}
            </CodeBlock>
          </Text>
        </Box>
        <Quiz
          title={"Bilder"}
          questions={[
            {
              question: "Wie füge ich ein Bild ein?",
              answers: [
                {
                  answer: '<img src="path/to/image.png" />',
                  correct: true,
                },
                {
                  answer: '<image src="path/to/image.png" />',
                  correct: false,
                },
                {
                  answer: '<bild src="path/to/image.png" />',
                  correct: false,
                },
                {
                  answer: '<img "path/to/image.png" />',
                  correct: false,
                },
              ],
              difficulty: "easy",
            },
            {
              question:
                "Welche Attribute werden verwendet, um ein Bild zu skalieren?",
              answers: [
                {
                  answer: "width, length",
                  correct: false,
                },
                {
                  answer: "width, scale",
                  correct: false,
                },
                {
                  answer: "width, height",
                  correct: true,
                },
                {
                  answer: "width, size",
                  correct: false,
                },
              ],
              difficulty: "medium",
            },
            {
              question: "Welches Attribut wird zur Bildbeschreibung verwendet?",
              answers: [
                {
                  answer: "desc",
                  correct: false,
                },
                {
                  answer: "alt",
                  correct: true,
                },
                {
                  answer: "description",
                  correct: false,
                },
                {
                  answer: "text",
                  correct: false,
                },
              ],
              difficulty: "medium",
            },
          ]}
        />
      </Flex>
    </>
  );
}
