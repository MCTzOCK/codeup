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
        <Heading size={"xl"}>HTML Basics - Andere Medien</Heading>
        <Box>
          <Heading size={"lg"}>Welchche Medien kann man einbinden?</Heading>
          <Text fontSize={"1.5rem"} mt={"1.2rem"}>
            Neben Bildern kannst du auch Videos, Audios und andere Webseiten
            einbinden.
          </Text>
        </Box>
        <Box>
          <Heading size={"lg"}>Videos</Heading>
          <Text fontSize={"1.5rem"} mt={"1.2rem"}>
            Videos kannst du mit dem Tag <code>&lt;video&gt;</code> einbinden.
            Diesem Tag musst du das Attribut <code>src</code> geben, welches den
            Pfad zum Video angibt. Außerdem kannst du noch das Attribut&nbsp;
            <code>controls</code> hinzufügen, welches die Steuerungselemente
            aktiviert.
            <CodeBlock className={"html"}>
              {`<video src="path/to/video.mp4" controls></video>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size={"lg"}>Audios</Heading>
          <Text fontSize={"1.5rem"} mt={"1.2rem"}>
            Audios kannst du mit dem Tag <code>&lt;audio&gt;</code> einbinden.
            Diesem Tag musst du das Attribut <code>src</code> geben, welches den
            Pfad zum Audio angibt. Außerdem kannst du noch das Attribut&nbsp;
            <code>controls</code> hinzufügen, welches die Steuerungselemente
            aktiviert.
            <CodeBlock className={"html"}>
              {`<audio src="path/to/audio.mp3" controls></audio>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size={"lg"}>Webseiten</Heading>
          <Text fontSize={"1.5rem"} mt={"1.2rem"}>
            Webseiten kannst du mit dem Tag <code>&lt;iframe&gt;</code>{" "}
            einbinden. Diesem Tag musst du das Attribut <code>src</code> geben,
            welches den Pfad zur Webseite angibt. Du kannst die größe des
            Iframes mit den Attributen <code>width</code> und&nbsp;
            <code>height</code> anpassen.
            <CodeBlock className={"html"}>
              {`<iframe src="https://www.google.de" width="100" height="100"></iframe>`}
            </CodeBlock>
          </Text>
        </Box>
        <Quiz
          title={"HTML Medien"}
          questions={[
            {
              question: "Mit welchem Tag kannst du Videos einbinden?",
              answers: [
                {
                  answer: "<video>",
                  correct: true,
                },
                {
                  answer: "<img>",
                  correct: false,
                },
                {
                  answer: "<audio>",
                  correct: false,
                },
                {
                  answer: "<film>",
                  correct: false,
                },
              ],
              difficulty: "easy",
            },
            {
              question: "Mit welchem Tag kannst du Audios einbinden?",
              answers: [
                {
                  answer: "<memo>",
                  correct: false,
                },
                {
                  answer: "<img>",
                  correct: false,
                },
                {
                  answer: "<audio>",
                  correct: true,
                },
                {
                  answer: "<film>",
                  correct: false,
                },
              ],
              difficulty: "easy",
            },
            {
              question: "Mit welchem Tag kannst du Webseiten einbinden?",
              answers: [
                {
                  answer: "<iframe>",
                  correct: true,
                },
                {
                  answer: "<img>",
                  correct: false,
                },
                {
                  answer: "<website>",
                  correct: false,
                },
                {
                  answer: "<web>",
                  correct: false,
                },
              ],
              difficulty: "medium",
            },
            {
              question:
                "Mit welchem Attributen kannst du die Größe eines Iframes anpassen?",
              answers: [
                {
                  answer: "width, height",
                  correct: true,
                },
                {
                  answer: "size, width",
                  correct: false,
                },
                {
                  answer: "width, size",
                  correct: false,
                },
                {
                  answer: "size, height",
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
