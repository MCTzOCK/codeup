/**
 * apps/web/src/pages/course/html-basics/basics.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.09.2022
 *
 */

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import * as React from "react";
import CodeBlock from "../../../special-components/CodeBlock";

const code_template_html_document = `<!-- Definiere die Sprache des Dokuments -->
<!DOCTYPE html>
<html>
  <head>
    <!-- Hier werden Informationen über die Webseite gespeichert -->
    <title>Titel der Webseite</title>
  </head>
  <body>
    <!-- Hier kommt der Inhalt der Seite hin -->
    <h1>Meine erste Seite</h1>
  </body>
</html>`;

export default function Basics() {
  return (
    <>
      <Flex direction="column" gap="2rem" margin={["1.2rem", "4rem"]}>
        <Heading size="xl">HTML Basics - Grundlagen</Heading>
        <Box>
          <Heading size="lg">Was ist HTML?</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            HTML steht für <b>H</b>yper<b>t</b>ext <b>M</b>arkup <b>L</b>anguage
            und ist eine <b>Markup-Sprache</b>. Das bedeutet, dass HTML
            <b>Tags</b> verwendet, um Elemente, wie Texte und Bilder, zu
            formatieren. HTML Tags sind in spitzen Klammern geschrieben und
            beginnen mit einem
            <b> &lt;</b> und enden mit einem <b>&gt;</b>. Ein Tag kann auch
            geschlossen werden, indem
            <b> &lt;/</b> vor dem Tag geschrieben wird.
            <br />
            <br />
            Ein Beispiel für ein HTML Tag ist <b>&lt;h1&gt;</b>. Dieses Tag
            definiert eine <b>Überschrift</b> und wird in der Regel verwendet,
            um den Titel einer Seite zu definieren. Ein Tag kann auch
            <b> Attribute</b> haben. Ein Attribut ist eine zusätzliche
            Information, die dem Tag hinzugefügt wird. Ein Attribut wird in
            Anführungszeichen geschrieben und hat immer einen Namen und einen
            Wert. Ein Beispiel für ein Attribut ist <b>class</b>. In speziellen
            Fällen kann der Wert allerdings weggelassen werden.
            <br />
            <br />
            Ein Beispiel für ein HTML Tag mit einem Attribut ist&nbsp;
            <b>&lt;h1 class="title"&gt;</b>. Dieses Tag definiert eine
            Überschrift mit dem Attribut <b>class</b> und dem Wert <b>title</b>.
            Ein Attribut kann auch mehrere Werte haben. Ein Beispiel für ein
            Attribut mit mehreren Werten ist <b>class="title subtitle"</b>.
            Dieses Tag definiert eine Überschrift mit dem Attribut <b>class</b>
            &nbsp; und den Werten <b>title</b> und <b>subtitle</b>.
          </Text>
        </Box>
        <Box>
          <Heading size="lg">HTML Dokument</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Ein HTML Dokument besteht aus einem <b>Header</b> und einem&nbsp;
            <b>Body</b>. Der Header wird durch das Tag <b>&lt;head&gt;</b>&nbsp;
            definiert und der Body durch das Tag <b>&lt;body&gt;</b>. Im Header
            werden Informationen über das Dokument definiert, wie z.B. der&nbsp;
            <b>Titel</b> oder Informationen für Suchmaschinen. Im Body wird der
            <b>Inhalt des Dokuments definiert</b>, also z.B. Texte und Bilder,
            die auf der Seite angezeigt werden sollen.
            <br />
            Tags, die mit <b>&lt;--</b> anfangen und mit <b>--&gt;</b> enden,
            sind Kommentare. Diese dienen nur dazu, den Code zu erklären und
            werden nicht vom Browser angezeigt.
            <br />
            <br />
            Die Grundlegende Struktur eines HTML Dokuments sieht wie folgt aus:
            <br />
            <br />
            <CodeBlock className={"html"}>
              {code_template_html_document}
            </CodeBlock>
          </Text>
        </Box>
        <Box>
          <Heading size="lg">HTML Elemente</Heading>
          <Text fontSize="1.5rem" mt="1.2rem">
            Ein HTML Element ist ein Teil eines HTML Dokuments. Ein Element kann
            ein <b>Tag</b> oder ein <b>Text</b> sein. Ein Beispiel für ein HTML
            Element ist <b>&lt;h1&gt;Meine Website&lt;/h1&gt;</b>. Dieses
            Element besteht aus dem Tag <b>&lt;h1&gt;</b> und dem Text&nbsp;
            <b>Meine Website</b>. Ein Element kann auch mehrere Tags und Texte
            haben.
          </Text>
        </Box>
        <Box id="die-wichtigsten-tags">
          <Heading size="lg">Die wichtigsten Tags</Heading>
          <SimpleGrid columns={[1, 2, 3]} spacing="1rem" mt="1.2rem">
            <TagCard
              title="Überschriften"
              tag={
                <>
                  <b>&lt;h1&gt;</b> bis <b>&lt;h6&gt;</b>
                </>
              }
              description={
                <>
                  Überschriften werden verwendet, um den Inhalt einer Seite zu
                  strukturieren. Überschriften werden in der Regel größer
                  dargestellt als der Rest des Textes. Beispiel:
                  <CodeBlock className={"html"} allowCopy={false}>
                    {"<h1>Überschrift</h1>\n<h2>Unterüberschrift</h2>"}
                  </CodeBlock>
                  Ergebnis:
                  <Heading as="h1" size="xl" mt="1rem">
                    Überschrift
                  </Heading>
                  <Heading as="h2" size="lg" mt="1rem">
                    Unterüberschrift
                  </Heading>
                </>
              }
            />
            <TagCard
              title="Absätze"
              tag={<b>&lt;p&gt;</b>}
              description={
                <>
                  Absätze werden verwendet, um Texte zu strukturieren. Ein
                  Absatz wird in der Regel mit einem Abstand zum vorherigen
                  Absatz dargestellt. Beispiel:
                  <CodeBlock className={"html"} allowCopy={false}>
                    {"<p>Text</p>"}
                  </CodeBlock>
                </>
              }
            />
            <TagCard
              title="Listen"
              tag={
                <>
                  <b>&lt;ul&gt;</b> und <b>&lt;ol&gt;</b>
                </>
              }
              description={
                <>
                  Listen werden verwendet, um eine Liste von Elementen zu
                  erstellen. Listen können mit <b>&lt;li&gt;</b> definiert
                  werden. Beispiel:
                  <CodeBlock className={"html"} allowCopy={false}>
                    {
                      "<ul>\n\t<li>Eintrag</li>\n</ul>\n<ol>\n\t<li>Eintrag</li>\n</ol>"
                    }
                  </CodeBlock>
                </>
              }
            />
            <TagCard
              title="Links"
              tag={<b>&lt;a&gt;</b>}
              description={
                <>
                  Links werden verwendet, um auf andere Seiten zu verlinken. Ein
                  Link kann mit dem Attribut <b>href</b> definiert werden.
                  Beispiel:
                  <CodeBlock className={"html"} allowCopy={false}>
                    {'<a href="https://google.com">Google</a>'}
                  </CodeBlock>
                </>
              }
            />
            <TagCard
              title="Bilder"
              tag={<b>&lt;img&gt;</b>}
              description={
                <>
                  Bilder werden verwendet, um Bilder auf einer Seite anzuzeigen.
                  Ein Bild kann mit dem Attribut <b>src</b> definiert werden.
                  Beispiel:
                  <CodeBlock className={"html"} allowCopy={false}>
                    {'<img src="/bild.png" />'}
                  </CodeBlock>
                </>
              }
            />
            <TagCard
              title="Tabellen"
              tag={<b>&lt;table&gt;</b>}
              description={
                <>
                  Tabellen werden verwendet, um Tabellen auf einer Seite
                  anzuzeigen. Eine Tabelle kann mit den Tags <b>&lt;tr&gt;</b>
                  ,&nbsp;
                  <b>&lt;th&gt;</b> und <b>&lt;td&gt;</b> definiert werden.
                  Beispiel:
                  <CodeBlock className={"html"} allowCopy={false}>
                    {
                      "<table>\n\t<tr>\n\t\t<th>Überschrift</th>\n\t\t<td>Text</td>\n\t</tr>\n\t<tr>\n\t\t<td>Test</td>\n\t\t<td>Test2</td>\n\t</tr>\n</table>"
                    }
                  </CodeBlock>
                  Ergebnis:
                  <Table variant="simple" mt="1rem">
                    <Thead>
                      <Tr>
                        <Th>Überschrift</Th>
                        <Th>Text</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Test</Td>
                        <Td>Test2</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </>
              }
            />
            <TagCard
              title="Formulare"
              tag={<b>&lt;form&gt;</b>}
              description={
                <>
                  Formulare werden verwendet, um Formulare auf einer Seite
                  anzuzeigen. Ein Formular kann mit den Tags&nbsp;
                  <b>&lt;input&gt;</b>, <b>&lt;textarea&gt;</b>,&nbsp;
                  <b>&lt;select&gt;</b> und <b>&lt;button&gt;</b> definiert
                  werden. Beispiel:
                  <CodeBlock className={"html"} allowCopy={false}>
                    {
                      '<form>\n\t<input type="text" />\n\t<textarea></textarea>\n\t<select>\n\t\t<option>Option</option>\n\t</select>\n\t<button>Button</button>\n</form>'
                    }
                  </CodeBlock>
                </>
              }
            />
            <TagCard
              title="Container"
              tag={<b>&lt;div&gt;</b>}
              description={
                <>
                  Container werden verwendet, um Elemente zu gruppieren.
                  Beispiel:
                  <CodeBlock className={"html"} allowCopy={false}>
                    {"<div>\n\tContainer-Inhalt\n</div>"}
                  </CodeBlock>
                </>
              }
            />
            <TagCard
              title="Kommentare"
              tag={<b>&lt;!-- --&gt;</b>}
              description={
                <>
                  Kommentare werden verwendet, um den Code zu erklären. Ein
                  Kommentar wird vom Browser nicht angezeigt.
                  <br />
                  Beispiel:
                  <CodeBlock className={"html"} allowCopy={false}>
                    {"<!-- Kommentar -->"}
                  </CodeBlock>
                </>
              }
            />
            <TagCard
              title="Inline-Elemente"
              tag={
                <>
                  <b>&lt;i&gt;</b>, <b>&lt;b&gt;</b> und <b>&lt;u&gt;</b>
                </>
              }
              description={
                <>
                  Inline-Elemente werden verwendet, um Texte zu formatieren.
                  Beispiel:
                  <CodeBlock className={"html"} allowCopy={false}>
                    {"<i>Kursiv</i>\n<b>Fett</b>\n<u>Unterstrichen</u>"}
                  </CodeBlock>
                </>
              }
            />
          </SimpleGrid>
        </Box>
      </Flex>
    </>
  );
}

function TagCard(props: {
  title: string;
  tag: string | React.ReactNode;
  description: string | React.ReactNode;
}) {
  return (
    <>
      <Box
        as="article"
        p="1rem"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="0.5rem"
        backgroundColor="black"
      >
        <Heading size="md">{props.title}</Heading>
        <Text fontSize="1.5rem" mt="1.2rem">
          Tag: {props.tag}
        </Text>
        <Accordion allowMultiple allowToggle mt="1.4rem">
          <AccordionItem borderTop={"none"}>
            <AccordionButton borderTop={"none"}>
              <Text fontSize="lg">Mehr Informationen</Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text fontSize="1.5rem" mt="1.2rem">
                {props.description}
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </>
  );
}
