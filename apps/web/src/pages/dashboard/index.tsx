/**
 * apps/web/src/pages/dashboard/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.08.2022
 *
 */

import * as React from "react";
import {
  Box,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useHover, useLoggedIn } from "@codeup/hooks";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import REST from "@codeup/rest";
import redirect from "@codeup/util/src/userworkflow/redirect";
import Head from "next/head";
import {
  FaCertificate,
  FaCheck,
  FaCode,
  FaProjectDiagram,
} from "react-icons/fa";
import byteSize from "byte-size";

export default function Dashboard() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const [projectEntries, setProjectEntries] = useState<
    { title: string; description?: string; href: string }[]
  >([]);
  const [certificates, setCertificates] = useState<
    {
      title: string;
      description?: string;
      href: string;
    }[]
  >([]);

  const [todoEntries, setTodoEntries] = useState<
    { title: string; description?: string; href: string }[]
  >([]);

  const [projectPlanningEntries, setProjectPlanningEntries] = useState<
    { title: string; description?: string; href: string }[]
  >([]);

  const router = useRouter();

  useEffect(() => {
    if (loaded && !loggedIn) {
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
      router.push("/#login");
    }
  }, [loaded, userInfo, loggedIn]);

  useEffect(() => {
    if (loaded && loggedIn) {
      REST.IDE.getProjects({
        token: localStorage.getItem("token") as string,
        type: "ALL",
        minimal: true,
      }).then((res) => {
        let x = [];
        for (const project of res.payload.projects) {
          x.push({
            title: project.name,
            href: "/ide/project/" + project.id + "#editor-wrapper-flex",
            description:
              "Geändert: " + new Date(project.updated_at).toLocaleString(),
          });
        }

        if (x.length === 0) {
          x.push({
            title: "Keine Projekte vorhanden",
            href: "/ide",
            description: "Klicke, um ein neues Projekt zu erstellen",
          });
        }

        setProjectEntries(x as any);
      });

      REST.ToDo.getMyLists(localStorage.getItem("token") as string).then(
        (res) => {
          let x = [];
          for (const list of res.payload.lists) {
            x.push({
              title: list.name,
              href: "/todo",
              description:
                list.tasks.length > 0
                  ? "Noch " + list.tasks.length + " Aufgaben"
                  : "Alle Aufgaben erledigt",
            });
          }

          if (x.length === 0) {
            x.push({
              title: "Keine Listen vorhanden",
              href: "/todo",
              description: "Klicke, um eine neue Liste zu erstellen",
            });
          }

          setTodoEntries(x as any);
        }
      );

      REST.Certificates.getObtainedCertificates(
        localStorage.getItem("token") as string
      ).then((res) => {
        if (res.status !== 200) {
          setCertificates([
            {
              title: "Keine Zertifikate erhalten",
              href: "/certificates",
              description: "Klicke, um Zertifikate zu erhalten",
            },
          ]);
          return;
        }
        let x = [];
        for (const cert of res.payload.certs) {
          x.push({
            title: cert.course,
            href: "/user-cert/" + cert._id,
            description:
              "Bestanden am " +
              new Date(cert.date).toLocaleString().replace(",", " um") +
              " mit " +
              cert.percentage +
              "%",
          });
        }

        if (x.length === 0) {
          x.push({
            title: "Keine Zertifikate erhalten",
            href: "/certificates",
            description: "Klicke, um Zertifikate zu erhalten",
          });
        }

        setCertificates(x as any);
      });

      REST.ToDo.getV2Projects(localStorage.getItem("token") as string).then(
        (res) => {
          let x = [];
          for (const project of res.payload.projects) {
            x.push({
              title: project.name,
              href: "/planning/" + project._id,
              description:
                "Gespeicherte Daten: " + byteSize(project.saved).toString(),
            });
          }

          if (x.length === 0) {
            x.push({
              title: "Keine Projekte vorhanden",
              href: "/planning",
              description: "Klicke, um ein neues Projekt zu erstellen",
            });
          }

          setProjectPlanningEntries(x as any);
        }
      );
    }
  }, [loaded, loggedIn]);

  return (
    <>
      <Head>
        <title>Dashboard - CodeUp</title>
      </Head>
      <Flex direction={"column"} mt={"2rem"}>
        <Heading size={"2xl"} textAlign={"center"} boxShadow={"2xl"} p={"2rem"}>
          Willkommen, {`${userInfo.firstName} ${userInfo.lastName}`}!
        </Heading>
        <Box padding={[".4rem", "2rem"]}>
          <DSection
            title={"Projekte"}
            entries={projectEntries}
            icon={<FaCode />}
            router={router}
          />
          <DSection
            title={"Projektplanung"}
            entries={projectPlanningEntries}
            icon={<FaProjectDiagram />}
            router={router}
          />
          <DSection
            title={"Todo-Listen"}
            entries={todoEntries}
            icon={<FaCheck />}
            router={router}
          />
          <DSection
            title={"Zertifikate"}
            entries={certificates}
            icon={<FaCertificate />}
            router={router}
          />
        </Box>
      </Flex>
    </>
  );
}

function DCard(props: {
  router: NextRouter;
  entry: {
    href: string;
    title: string;
    description: string;
  };
  icon: any;
}) {
  return (
    <>
      <>
        <Box
          p={"1rem"}
          borderRadius={"lg"}
          borderWidth={"1px"}
          _hover={{
            borderColor: "blue.300",
          }}
          cursor={"pointer"}
          backgroundColor={"gray.900"}
          onClick={() => props.router.push(props.entry.href)}
        >
          <Flex direction={"row"} gap={8}>
            <Flex alignItems={"center"} justifyContent={"center"}>
              <Heading size={"2xl"} color={"blue.300"}>
                {props.icon}
              </Heading>
            </Flex>
            <Box>
              <Heading size={"md"}>{props.entry.title}</Heading>
              <Text>{props.entry.description}</Text>
            </Box>
          </Flex>
        </Box>
      </>
    </>
  );
}

function DSection(props: {
  title: string;
  entries: {
    title: string;
    description?: string;
    href: string;
  }[];
  icon: any;
  router: NextRouter;
}) {
  return (
    <>
      <Heading size={"xl"} mt={"2rem"}>
        {props.title}
      </Heading>
      <Grid
        templateColumns={["1fr", "1fr 1fr"]}
        gap={["1rem", "2rem"]}
        mt={"2rem"}
      >
        {props.entries.map((entry, i) => (
          <>
            <DCard
              router={props.router}
              entry={{
                title: entry.title as string,
                description: entry.description as string,
                href: entry.href as string,
              }}
              icon={props.icon}
            />
          </>
        ))}
      </Grid>
    </>
  );
}
