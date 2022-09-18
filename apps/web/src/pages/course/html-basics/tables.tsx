/**
 * apps/web/src/pages/course/html-basics/tables.tsx
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
        direction="column"
        gap="2rem"
        margin={["1.2rem", "4rem"]}
        marginInline={["1.2rem", "16rem"]}
      >
        <Heading size="xl">HTML Basics - Tabellen</Heading>
        <Box>
          <Heading size="lg">Tabellen</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Tabellen werden mit dem Tag <code>&lt;table&gt;</code> erstellt.
            Jede Zeile wird mit dem Tag <code>&lt;tr&gt;</code> erstellt. Jede
            Zelle wird mit dem Tag <code>&lt;td&gt;</code> erstellt.
            <CodeBlock className="html">
              {`<table>
  <tr>
    <td>Erste Zelle</td>
    <td>Zweite Zelle</td>
    <td>Dritte Zelle</td>
  </tr>
  <tr>
    <td>Erste Zelle</td>
    <td>Zweite Zelle</td>
   <td>Dritte Zelle</td>
  </tr>
</table>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Tabellenkopf</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Der Tabellenkopf wird mit dem Tag <code>&lt;thead&gt;</code>{" "}
            erstellt. Der Tabellenkopf wird immer über der Tabelle angezeigt.
            <CodeBlock className="html">
              {`<table>
  <thead>
    <tr>
      <td>Erste Zelle</td>
      <td>Zweite Zelle</td>
      <td>Dritte Zelle</td>
    </tr>
  </thead>
  <tr>
    <td>Erste Zelle</td>
    <td>Zweite Zelle</td>
    <td>Dritte Zelle</td>
  </tr>
</table>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Tabellenkörper</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Der Tabellenkörper wird mit dem Tag <code>&lt;tbody&gt;</code>{" "}
            erstellt. Der Tabellenkörper wird immer unter der Tabelle angezeigt.
            <CodeBlock className="html">
              {`<table>
  <thead>
    <tr>
      <td>Erste Zelle</td>
      <td>Zweite Zelle</td>
      <td>Dritte Zelle</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Erste Zelle</td>
      <td>Zweite Zelle</td>
      <td>Dritte Zelle</td>
    </tr>
  </tbody>
</table>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Tabellenfuß</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Der Tabellenfuß wird mit dem Tag <code>&lt;tfoot&gt;</code>{" "}
            erstellt. Der Tabellenfuß wird immer unter der Tabelle angezeigt.
            <CodeBlock className="html">
              {`<table>
  <thead>
    <tr>
      <td>Erste Zelle</td>
      <td>Zweite Zelle</td>
      <td>Dritte Zelle</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Erste Zelle</td>
      <td>Zweite Zelle</td>
      <td>Dritte Zelle</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Erste Zelle</td>
      <td>Zweite Zelle</td>
      <td>Dritte Zelle</td>
    </tr>
  </tfoot>
</table>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Tabellenüberschriften</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Tabellenüberschriften werden mit dem Tag <code>&lt;th&gt;</code>{" "}
            erstellt. Tabellenüberschriften werden immer in der ersten Zeile
            angezeigt.
            <CodeBlock className="html">
              {`<table>
  <tr>
    <th>Erste Zelle</th>
    <th>Zweite Zelle</th>
    <th>Dritte Zelle</th>
  </tr>
</table>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Tabellenzusammenfassung</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Eine Tabellenzusammenfassung wird mit dem Attribut{" "}
            <code>summary</code> erstellt. Die Zusammenfassung wird von
            Screenreadern gelesen.
            <CodeBlock className="html">
              {`<table summary="Eine Tabelle mit 3 Zeilen und 3 Spalten">
  <tr>
    <th>Erste Zelle</th>
    <th>Zweite Zelle</th>
    <th>Dritte Zelle</th>
  </tr>
</table>`}
            </CodeBlock>
          </Text>
        </Box>
        <Quiz
          title={"HTML Tabellen"}
          questions={[
            {
              question: "Mit welchem Tag erstellt man eine Tabelle?",
              answers: [
                {
                  answer: "<tabelle>",
                  correct: false,
                },
                {
                  answer: "<table>",
                  correct: true,
                },
                {
                  answer: "<tab>",
                  correct: false,
                },
                {
                  answer: "<tabellen>",
                  correct: false,
                },
              ],
              difficulty: "easy",
            },
            {
              question:
                "Welches Attribut wird verwendet, um die Tabellenzusammenfassung zu erstellen?",
              answers: [
                {
                  answer: "summary",
                  correct: true,
                },
                {
                  answer: "caption",
                  correct: false,
                },
                {
                  answer: "title",
                  correct: false,
                },
                {
                  answer: "description",
                  correct: false,
                },
              ],
              difficulty: "easy",
            },
            {
              question: "Wovon wird die Tabellenzusammenfassung gelesen?",
              answers: [
                {
                  answer: "Von Lehrern",
                  correct: false,
                },
                {
                  answer: "Von Screenreadern",
                  correct: true,
                },
                {
                  answer: "Von der Polizei",
                  correct: false,
                },
                {
                  answer: "Von der Bundeswehr",
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
