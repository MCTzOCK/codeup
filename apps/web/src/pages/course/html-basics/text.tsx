/**
 * src/pages/course/html-basics/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.09.2022
 *
 */

import { Box, Flex, Heading, List, ListItem, Text } from "@chakra-ui/react";
import { Quiz } from "@codeup/components/course";
import React from "react";
import CodeBlock from "../../../special-components/CodeBlock";

export default function Lesson() {
  return (
    <>
      <Flex
        direction="column"
        gap="2rem"
        margin={["1.2rem", "4rem"]}
        marginInline={["1.2rem", "16rem"]}
      >
        <Heading size="xl">HTML Basics - Texte</Heading>
        <Box>
          <Heading size="lg">Überschriften</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Überschriften werden mit den Tags <code>&lt;h1&gt;</code> bis&nbsp;
            <code>&lt;h6&gt;</code> definiert. Die Zahl gibt an, wie groß die
            Überschrift ist. <code>&lt;h1&gt;</code> ist die größte
            Überschrift,&nbsp;
            <code>&lt;h6&gt;</code> die kleinste:
            <CodeBlock allowCopy={true} className="html">
              {`<h1>Überschrift 1</h1>\n<h2>Überschrift 2</h2>\n<h3>Überschrift 3</h3>\n<h4>Überschrift 4</h4>\n<h5>Überschrift 5</h5>\n<h6>Überschrift 6</h6>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Absätze</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Absätze werden mit dem Tag <code>&lt;p&gt;</code> definiert.
            Zeilenumbrüche werden automatisch hinzugefügt.
            <CodeBlock allowCopy={true} className="html">
              {`<p>Das ist ein Absatz.</p>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Span</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Der <code>&lt;span&gt;</code> Tag ist ein Inline-Element, das
            verwendet wird, um Texte zu formatieren. Es ist ein Container, der
            keine Semantik hat. Er wird meist in einem Absatz (
            <code>&lt;p&gt;</code>) verwendet.
            <CodeBlock allowCopy={true} className="html">
              {`<p>Das ist ein <span style="color: red">roter</span> Text.</p>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Formatierung</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Für einfache Formatierungen, wie Fettschrift, Kursivschrift und
            Unterstrichen, gibt es die Tags <code>&lt;b&gt;</code>,&nbsp;
            <code>&lt;i&gt;</code> und <code>&lt;u&gt;</code>. Diese können, wie
            der <code>&lt;span&gt;</code> Tag, in einem Absatz verwendet werden.
            <CodeBlock allowCopy={true} className="html">
              {`<p>Das ist ein <b>fetter</b> Text.</p>\n<p>Das ist ein <i>kursiver</i> Text.</p>\n<p>Das ist ein <u>unterstrichener</u> Text.</p>`}
            </CodeBlock>
          </Text>
        </Box>

        <Quiz
          title="HTML Texte"
          questions={[
            {
              question:
                "Welches Tag wird verwendet, um einen Absatz zu definieren?",
              answers: [
                {
                  answer: "<p>",
                  correct: true,
                },
                {
                  answer: "<a>",
                  correct: false,
                },
                {
                  answer: "<div>",
                  correct: false,
                },
                {
                  answer: "<span>",
                  correct: false,
                },
              ],
              difficulty: "easy",
            },
            {
              question: "Welches Tag ist keine gültige Überschrift?",
              answers: [
                {
                  answer: "<h1>",
                  correct: false,
                },
                {
                  answer: "<h7>",
                  correct: true,
                },
                {
                  answer: "<h4>",
                  correct: false,
                },
                {
                  answer: "<h2>",
                  correct: false,
                },
              ],
              difficulty: "easy",
            },
            {
              question: "Wofür wird der <span> Tag verwendet?",
              answers: [
                {
                  answer: "Um einen Absatz zu definieren",
                  correct: false,
                },
                {
                  answer: "Um einen Link zu definieren",
                  correct: false,
                },
                {
                  answer: "Um Texte zu formatieren",
                  correct: true,
                },
                {
                  answer: "Um eine Tabelle zu erstellen",
                  correct: false,
                },
              ],
              difficulty: "easy",
            },
            {
              question:
                "Welches Tag wird verwendet, um einen Text zu unterstreichen?",
              answers: [
                {
                  answer: "<u>",
                  correct: true,
                },
                {
                  answer: "<i>",
                  correct: false,
                },
                {
                  answer: "<b>",
                  correct: false,
                },
                {
                  answer: "<unterstrichen>",
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
