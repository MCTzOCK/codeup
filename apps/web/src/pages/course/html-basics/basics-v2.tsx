/**
 * apps/web/src/pages/course/html-basics/basics-v2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.10.2022
 *
 */

import * as React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import VideoPlayer from "@codeup/components/global/VideoPlayer";
import HTMLCourseSections from "@codeup/components/course/HTMLCourseSections";

export default function BasicsV2() {
  return (
    <>
      <HTMLCourseSections />
      <Flex
        direction="column"
        gap="2rem"
        margin={["1.2rem", "4rem"]}
        marginInline={["1.2rem", "16rem"]}
      >
        <Heading size="xl" textAlign={"center"}>
          HTML Basics - Einleitung
        </Heading>
        <Flex
          w={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          direction={"column"}
        >
          <Box w={"1080px"} h={"720px"}>
            <VideoPlayer url={"https://youtu.be/p1inZ7hvz70"} />
          </Box>

          <Heading size="lg" textAlign={"center"}>
            Transkript
          </Heading>

          <Box textAlign={"left"}>
            <Heading size="md" mt="2rem">
              01-Einleitung
            </Heading>

            <Heading size="md" mt="2rem">
              01.1-Intro
            </Heading>

            <Text>Herzlich Willkommen im HTML Grundkurs von CodeUp.</Text>

            <Text>
              Mein Name ist Ben und ich werde dir in diesem Kurs beibringen, wie
              du mit HTML eigene Webseiten erstellen kannst.
            </Text>

            <Text>Lass uns zunächst die Grundlagen klären.</Text>

            <Text>
              HTML steht für Hyper Text Markup Language und wird dazu verwendet
              die Struktur einer Webseite zu beschreiben.
            </Text>

            <Text>
              HTML ist keine Programmiersprache, sondern lediglich eine
              Beschreibungssprache.
            </Text>

            <Text>
              Das heißt, dass du keine Logik in deinen HTML Quellcode einbringen
              kannst.
            </Text>

            <Text>
              Außerdem kannst du das Aussehen einer Webseite nicht verändern.
            </Text>

            <Text>
              Für das Aussehen und die Logik brauchst du zwei eigenständige
              Sprachen. Diese sind CSS für das Aussehen und JavaScript für die
              Logik.
            </Text>

            <Heading size="md" mt="2rem">
              01.2-Aufbau_von_HTML
            </Heading>

            <Text>
              Ein HTML Dokument besteht aus verschiedenen Elementen, wie z.B.
              Texte, Bilder und Tabellen.
            </Text>

            <Text>
              Ein Element ist eine Kombination aus einem Start- und einem
              Endtag.
            </Text>

            <Text>
              Ein sogenanntes Tag ist ein Text, der in spitzen Klammern steht.
            </Text>

            <Text>
              Die Besonderheit des Endtags ist, dass es ein Schrägstrich vor dem
              Tagnamen hat.
            </Text>

            <Text>
              Zwischen dem Start- und dem Endtag können weitere Elemente oder
              Text stehen.
            </Text>

            <Text>
              Wenn ein Element keine weiteren Elemente oder Texte enthält, dann
              wird es als leeres Element bezeichnet.
            </Text>

            <Text>
              Dieses benötigt kein Endtag und wird mit einem Schrägstrich am
              ende des Starttags geschlossen.
            </Text>

            <Heading size="md" mt="2rem">
              01.3-Attribute
            </Heading>

            <Text>Ein Element kann zusätzliche Informationen enthalten.</Text>

            <Text>
              Diese Informationen werden als Attribute bezeichnet und befinden
              sich im Starttag.
            </Text>

            <Text>Ein Attribut besteht aus einem Namen und einem Wert.</Text>

            <Text>Der Wert wird in Anführungszeichen angegeben.</Text>

            <Text>
              Mit Attributen kann das Verhalten des Elements verändert werden.
            </Text>

            <Heading size="md" mt="2rem">
              01.4-HTML_Dokument
            </Heading>

            <Text>
              Ein HTML Dokument beginnt mit der Deklaration über die Verwendete
              HTML Version.
            </Text>

            <Text>
              Diese steht in spitzen Klammern und beginnt mit dem Wort !DOCTYPE
              gefolgt von html.
            </Text>

            <Text>
              Danach folgt das html-tag, welches das gesamte HTML Dokument
              umschließt.
            </Text>

            <Text>
              Innerhalb des html-tags befinden sich die head und body tags.
            </Text>

            <Text>
              Der head-tag beinhaltet Informationen über das Dokument, wie z.B.
              den Titel und die verwendeten CSS und JavaScript Dateien.
            </Text>

            <Text>Der body-tag beinhaltet den Inhalt des Dokuments.</Text>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
