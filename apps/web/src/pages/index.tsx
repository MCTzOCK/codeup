/**
 * src/pages/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2022
 *
 */

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Home() {
  const allowLoadingAnimation = false;

  const variants: Variants = {
    offscreen: {
      y: 300,
      opacity: 0,
    },
    onscreen: {
      y: 50,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  return (
    <>
      {allowLoadingAnimation ? (
        <Box
          position={"fixed"}
          top="0"
          left="0"
          width={"100%"}
          height="100vh"
          backgroundColor={"gray.800"}
          zIndex={5}
          display="flex"
          alignItems="center"
          textAlign={"center"}
          className="hp-loader"
          flexDirection={"column-reverse"}
          pb="2rem"
        >
          <div className="hp-image hp-image-0"></div>
          <Heading fontFamily="ARCADE" color={"white"}>
            Loading CodeUp ...
          </Heading>
        </Box>
      ) : null}
      <Card
        title="Lerne Programmieren"
        callToAction="Jetzt loslegen"
        image="/_static/vectors/home/learn-coding.svg"
        rtl={false}
        key="learn-coding"
      >
        Unsere <b>interaktiven</b> Programmierkurse bringen dir Schritt für
        Schritt bei, wie du eigene Webseiten mittels <b>HTML</b>
        ,&nbsp;
        <b>CSS</b> und <b>JavaScript</b>&nbsp;entwickeln kannst.
        <br />
        Alle Kurse sind für <b>Anfänger</b> konzipiert und erfordern&nbsp;
        <b>keine Vorkenntnisse</b>. Du lernst von Grund auf, alles was du wissen
        musst, um eine <b>erfolgreiche Online-Präsenz</b>&nbsp; aufzubauen!
      </Card>
      <Card
        title="Verwirkliche deine Ideen"
        callToAction="Starte jetzt"
        image="/_static/vectors/home/create-projects.svg"
        rtl={true}
        key="create-projects"
      >
        Mit unserer <b>fortschrittlichen</b> Programmierumgebung kannst du jede
        Art von <b>Webanwendung</b>&nbsp;entwickeln. Du kannst sogar&nbsp;
        <b>mit deinen Freunden</b> an einem Projekt arbeiten und deinen Code mit
        ihnen teilen! Unsere Programmierumgebung unterstützt viele verschiedene
        Programmiersprachen, wie&nbsp;
        <b>JavaScript</b>,&nbsp;
        <b>TypeScript</b>,&nbsp;
        <b>HTML</b>,&nbsp;
        <b>CSS</b>,&nbsp;
        <b>Sass/SCSS</b>,&nbsp;und <b>InCode</b>, sodass du dir selbst die
        Sprache aussuchen kannst, die dir am besten gefällt.
      </Card>
      <Card
        title="Plane deine Projekte"
        callToAction="Auf gehts!"
        rtl={false}
        image="/_static/vectors/home/plan-projects.svg"
      >
        Mit unserem <b>intuitiven</b> Projektmanagement kannst du
        <b>effizient</b> und <b>strukturiert</b> an deinen Projekten arbeiten.
        Du kannst deine Projekte in <b>Teams</b> organisieren, sodass du mit
        deinen Freunden zusammenarbeiten kannst. Du kannst auch <b>Deadlines</b>{" "}
        für deine Projekte festlegen, sodass du immer <b>im Auge behältst</b>,
        was du wann erledigen musst.
      </Card>
      <Card
        title="Lerne von den Besten"
        image="/_static/vectors/home/communicate.svg"
        rtl={true}
        callToAction="Registrieren"
      >
        Unser <b>modernes</b> Forum bietet dir die Möglichkeit, dich mit anderen{" "}
        <b>Programmierern auszutauschen</b> und von ihnen&nbsp;
        <b>zu lernen</b>. Der Austausch mit anderen Programmierern ist eine der
        besten Möglichkeiten, um deine Fähigkeiten zu verbessern. Du kannst dich
        mit Menschen austauschen, die bereits&nbsp;
        <b>Erfahrung mit bestimmten Technologien</b> haben oder auf dem&nbsp;
        <b>gleichen Lernstand</b> wie du sind.
      </Card>
      <Card
        title="Finde Inspiration"
        image="/_static/vectors/home/get-ideas.svg"
        rtl={false}
        callToAction="Starten"
      >
        Unsere <b>riesige</b> Sammlung an <b>Projektideen</b> bietet dir die
        Möglichkeit, immer neue Ideen zu finden, die du umsetzen kannst, um{" "}
        <b>neues Wissen zu erlange</b>. Viele Projektideen haben zusätzlich auch
        noch&nbsp;
        <b>ausführliche Anleitungen</b> oder <b>Beispiele</b>, sodass du direkt
        loslegen kannst.
      </Card>
    </>
  );
}

function Card(props: {
  rtl: boolean;
  title: string;
  callToAction: string;
  children: React.ReactNode;
  image: string;
}) {
  return (
    <>
      <Flex
        direction={
          props.rtl ? ["column-reverse", "row-reverse"] : ["column", "row"]
        }
        gap="2rem"
        paddingInline={["2rem", "8rem"]}
        mt="8rem"
      >
        <Image
          src={props.image}
          width={"512"}
          height="512"
          style={{
            flex: "50%",
          }}
        />
        <Box flex="50%">
          <Flex direction="column">
            <Heading fontWeight="bold" fontSize="4rem">
              {props.title}
            </Heading>
            <Text fontSize="1.5rem" mt="2rem">
              {props.children}
            </Text>
            <CallToActionButton
              text={props.callToAction}
              url="/account/register"
            />
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
