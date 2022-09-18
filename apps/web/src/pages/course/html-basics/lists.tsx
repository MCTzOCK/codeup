/**
 * apps/web/src/pages/course/html-basics/lists.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import * as React from "react";
import HTMLCourseSections from "@codeup/components/course/HTMLCourseSections";
import { Box, Flex, Heading, List, ListItem, Text } from "@chakra-ui/react";
import CodeBlock from "../../../special-components/CodeBlock";
import { Quiz } from "@codeup/components/course";

export default function Lists() {
  return (
    <>
      <HTMLCourseSections />
      <Flex
        direction="column"
        gap="2rem"
        margin={["1.2rem", "4rem"]}
        marginInline={["1.2rem", "16rem"]}
      >
        <Heading size="xl">HTML Basics - Listen</Heading>
        <Box>
          <Heading size="lg">Geordnete Listen</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Geordnete Listen werden mit dem Tag <code>&lt;ol&gt;</code>{" "}
            erstellt. Jedes Element der Liste wird mit dem Tag{" "}
            <code>&lt;li&gt;</code>&nbsp; erstellt. Die Nummerierung der Liste
            wird automatisch erstellt.
            <CodeBlock className="html">
              {`<ol>
  <li>Erstes Element</li>
  <li>Zweites Element</li>
  <li>Drittes Element</li>
</ol>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Ungeordnete Listen</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Ungeordnete Listen werden mit dem Tag <code>&lt;ul&gt;</code>{" "}
            erstellt. Jedes Element der Liste wird mit dem Tag{" "}
            <code>&lt;li&gt;</code>&nbsp; erstellt. Die einzelnen Elemente
            werden mit Punkten dargestellt.
            <CodeBlock className="html">
              {`<ul>
  <li>Erstes Element</li>
  <li>Zweites Element</li>
  <li>Drittes Element</li>
</ul>`}
            </CodeBlock>
          </Text>
        </Box>
        <Quiz
          title={"HTML Listen"}
          questions={[
            {
              question: "Welches Tag wird für eine geordnete Liste verwendet?",
              answers: [
                {
                  answer: "<ol>",
                  correct: true,
                },
                {
                  answer: "<ul>",
                  correct: false,
                },
              ],
              difficulty: "easy",
            },
            {
              question:
                "Welches Tag wird für eine ungeordnete Liste verwendet?",
              answers: [
                {
                  answer: "<ol>",
                  correct: false,
                },
                {
                  answer: "<ul>",
                  correct: true,
                },
              ],
              difficulty: "easy",
            },
            {
              question:
                "Welches Tag wird für ein Element einer Liste verwendet?",
              answers: [
                {
                  answer: "<li>",
                  correct: true,
                },
                {
                  answer: "<ul>",
                  correct: false,
                },
                {
                  answer: "<ol>",
                  correct: false,
                },
                {
                  answer: "<div>",
                  correct: false,
                },
              ],
              difficulty: "easy",
            },
          ]}
        />
      </Flex>
    </>
  );
}
