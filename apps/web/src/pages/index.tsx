/**
 * src/pages/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2022
 *
 */

import * as React from "react";
import { Player } from "@remotion/player";
import REST from "@codeup/rest";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Flex
        direction={["column", "row"]}
        gap="2rem"
        paddingInline={["2rem", "8rem"]}
        mt="8rem"
      >
        <Image
          src="/_static/vectors/home/learn-coding.svg"
          width={"512"}
          height="512"
          style={{
            flex: "50%",
          }}
        />
        <Box flex="50%">
          <Flex direction="column">
            <Heading fontWeight="bold" fontSize="4rem">
              Lerne Programmieren
            </Heading>
            <Text fontSize="1.5rem" mt="2rem">
              Unsere <b>interaktiven</b> Programmierkurse bringen dir Schritt
              für Schritt bei, wie du eigene Webseiten mittels <b>HTML</b>
              ,&nbsp;
              <b>CSS</b> und <b>JavaScript</b>&nbsp;entwickeln kannst.
              <br />
              Alle Kurse sind für <b>Anfänger</b> konzipiert und erfordern&nbsp;
              <b>keine Vorkenntnisse</b>. Du lernst von Grund auf, alles was du
              wissen musst, um eine <b>erfolgreiche Online-Präsenz</b>&nbsp;
              aufzubauen!
            </Text>
            <CallToActionButton text="Jetzt loslegen" url="/account/register" />
          </Flex>
        </Box>
      </Flex>
      <Flex
        direction={["column", "row"]}
        gap="2rem"
        paddingInline={["2rem", "8rem"]}
        mt="8rem"
      >
        <Box flex="50%">
          <Flex direction="column">
            <Heading fontWeight="bold" fontSize="4rem">
              Verwirkliche deine Ideen
            </Heading>
            <Text fontSize="1.5rem" mt="2rem">
              Mit unserer <b>fortschrittlichen</b> Programmierumgebung kannst du
              jede Art von <b>Webanwendung</b>&nbsp;entwickeln. Du kannst
              sogar&nbsp;
              <b>mit deinen Freunden</b> an einem Projekt arbeiten und deinen
              Code mit ihnen teilen! Unsere Programmierumgebung unterstützt
              viele verschiedene Programmiersprachen, wie&nbsp;
              <b>JavaScript</b>,&nbsp;
              <b>TypeScript</b>,&nbsp;
              <b>HTML</b>,&nbsp;
              <b>CSS</b>,&nbsp;
              <b>Sass/SCSS</b>,&nbsp;und <b>InCode</b>, sodass du dir selbst die
              Sprache aussuchen kannst, die dir am besten gefällt.
            </Text>
            <CallToActionButton text="Starte jetzt" url="/account/register" />
          </Flex>
        </Box>
        <Image
          src="/_static/vectors/home/create-projects.svg"
          width={"512"}
          height="512"
          style={{
            flex: "50%",
          }}
        />
      </Flex>
      <Flex
        direction={["column", "row"]}
        gap="2rem"
        paddingInline={["2rem", "8rem"]}
        mt="8rem"
      >
        <Image
          src="/_static/vectors/home/plan-projects.svg"
          width={"512"}
          height="512"
          style={{
            flex: "50%",
          }}
        />
        <Box flex="50%">
          <Flex direction="column">
            <Heading fontWeight="bold" fontSize="4rem">
              Plane deine Projekte
            </Heading>
            <Text fontSize="1.5rem" mt="2rem">
              Mit unserem <b>intuitiven</b> Projektmanagement kannst du
              <b>effizient</b> und <b>strukturiert</b> an deinen Projekten
              arbeiten. Du kannst deine Projekte in <b>Teams</b> organisieren,
              sodass du mit deinen Freunden zusammenarbeiten kannst. Du kannst
              auch <b>Deadlines</b> für deine Projekte festlegen, sodass du
              immer <b>im Auge behältst</b>, was du wann erledigen musst.
            </Text>
            <CallToActionButton text="Auf gehts!" url="/account/register" />
          </Flex>
        </Box>
      </Flex>
      <Flex
        direction={["column", "row"]}
        gap="2rem"
        paddingInline={["2rem", "8rem"]}
        mt="8rem"
      >
        <Box flex="50%">
          <Flex direction="column">
            <Heading fontWeight="bold" fontSize="4rem">
              Lerne von den Besten
            </Heading>
            <Text fontSize="1.5rem" mt="2rem">
              Unser <b>modernes</b> Forum bietet dir die Möglichkeit, dich mit
              anderen <b>Programmierern auszutauschen</b> und von ihnen&nbsp;
              <b>zu lernen</b>. Der Austausch mit anderen Programmierern ist
              eine der besten Möglichkeiten, um deine Fähigkeiten zu verbessern.
              Du kannst dich mit Menschen austauschen, die bereits&nbsp;
              <b>Erfahrung mit bestimmten Technologien</b> haben oder auf
              dem&nbsp;
              <b>gleichen Lernstand</b> wie du sind.
            </Text>
            <CallToActionButton text="Registrieren" url="/account/register" />
          </Flex>
        </Box>
        <Image
          src="/_static/vectors/home/communicate.svg"
          width={"512"}
          height="512"
          style={{
            flex: "50%",
          }}
        />
      </Flex>
      <Flex
        direction={["column", "row"]}
        gap="2rem"
        paddingInline={["2rem", "8rem"]}
        mt="8rem"
        mb={["2rem", 0]}
      >
        <Image
          src="/_static/vectors/home/get-ideas.svg"
          width={"512"}
          height="512"
          style={{
            flex: "50%",
          }}
        />
        <Box flex="50%">
          <Flex direction="column">
            <Heading fontWeight="bold" fontSize="4rem">
              Finde Inspiration
            </Heading>
            <Text fontSize="1.5rem" mt="2rem">
              Unsere <b>riesige</b> Sammlung an <b>Projektideen</b> bietet dir
              die Möglichkeit, immer neue Ideen zu finden, die du umsetzen
              kannst, um <b>neues Wissen zu erlange</b>. Viele Projektideen
              haben zusätzlich auch noch&nbsp;
              <b>ausführliche Anleitungen</b> oder <b>Beispiele</b>, sodass du
              direkt loslegen kannst.
            </Text>
            <CallToActionButton text="Starten" url="/account/register" />
          </Flex>
        </Box>
      </Flex>
    </>
  );
}

function CallToActionButton(props: { text: string; url: string }) {
  const router = useRouter();

  return (
    <ButtonGroup mt="2rem">
      <a
        href={props.url}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <Button
          colorScheme="messenger"
          size="lg"
          onClick={() => {
            router.push(props.url);
          }}
        >
          {props.text}
        </Button>
      </a>
    </ButtonGroup>
  );
}
