/**
 * src/pages/course/html-basics/links.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.09.2022
 *
 */

import { Box, Flex, Heading, List, ListItem, Text } from "@chakra-ui/react";
import { Quiz } from "@codeup/components/course";
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
        <Heading size="xl">HTML Basics - Links</Heading>
        <Box>
          <Heading size="lg">Links</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Links werden mit dem Tag <code>&lt;a&gt;</code> definiert. Jedes
            Link Tag muss ein Attribut mit dem Namen <code>href</code> haben.
            Dieses gibt an, wohin der Link führt. Der Inhalt des Tags wird als
            Text angezeigt.
            <CodeBlock className="html" allowCopy={true}>
              {`<a href="https://codeup.space">CodeUp Webseite</a>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Interne Links</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Links können ebefalls auf andere Seiten innerhalb der Websete
            verweisen. Dazu muss der Wert des <code>href</code> Attributs mit
            einem <code>/</code> beginnen.
            <CodeBlock className="html" allowCopy={true}>
              {`<a href="/login">Anmelden</a>`}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">Zielfenster</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Links können ebenfalls in einem anderen Fenster/Tab geöffnet werden.
            Dazu muss das Attribut <code>target</code> einen der folgenden Werte
            haben:
            <List>
              <ListItem>
                <code>_blank</code> - Öffnet den Link in einem neuen Tab
              </ListItem>
              <ListItem>
                <code>_self</code> - Öffnet den Link im selben Tab
              </ListItem>
              <ListItem>
                <code>_parent</code> - Öffnet den Link im übergeordneten Frame
              </ListItem>
              <ListItem>
                <code>_top</code> - Öffnet den Link im obersten Frame
              </ListItem>
            </List>
            Standartmäßig wird der Wert <code>_self</code> verwendet.
            <CodeBlock className="html" allowCopy={true}>
              {`<a href="https://codeup.space" target="_blank">CodeUp Webseite</a>`}
            </CodeBlock>
          </Text>
        </Box>
        <Quiz
          title="HTML Links"
          questions={[
            {
              question:
                "Welches Tag wird verwendet, um einen Link zu definieren?",
              answers: [
                {
                  answer: "<a>",
                  correct: true,
                },
                {
                  answer: "<link>",
                  correct: false,
                },
                {
                  answer: "<href>",
                  correct: false,
                },
                {
                  answer: "<url>",
                  correct: false,
                },
              ],
              difficulty: "easy",
            },
            {
              question: "Womit muss ein Link zu einer internen Seite beginnen?",
              answers: [
                {
                  answer: "https://",
                  correct: false,
                },
                {
                  answer: "http://",
                  correct: false,
                },
                {
                  answer: "www.",
                  correct: false,
                },
                {
                  answer: "/",
                  correct: true,
                },
              ],
              difficulty: "medium",
            },
            {
              question: "Wie kann man einen Link in einem neuen Tab öffnen?",
              answers: [
                {
                  answer: 'target="_blank"',
                  correct: true,
                },
                {
                  answer: 'target="_new"',
                  correct: false,
                },
                {
                  answer: 'target="_tab"',
                  correct: false,
                },
                {
                  answer: 'target="_window"',
                  correct: false,
                },
              ],
              difficulty: "hard",
            },
          ]}
        />
      </Flex>
    </>
  );
}
