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
import { Box, Flex, Heading, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { useHover, useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import REST from "@codeup/rest";
import redirect from "@codeup/util/src/userworkflow/redirect";

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
            description: null,
          });
        }

        if (x.length === 0) {
          x.push({
            title: "Keine Projekte erstellt: Neues Projekt",
            href: "/ide",
            description: null,
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
            });
          }

          if (x.length === 0) {
            x.push({
              title: "Keine Listen erstellt: Neue Liste",
              href: "/todo",
              description: null,
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
              description: "",
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
            description: null,
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
              description: null,
            });
          }

          if (x.length === 0) {
            x.push({
              title: "Keine Projekte erstellt: Neues Projekt",
              href: "/planning",
              description: null,
            });
          }

          setProjectPlanningEntries(x as any);
        }
      );
    }
  }, [loaded, loggedIn]);

  return (
    <>
      <Flex direction={"column"} mt={"2rem"}>
        <Heading size={"lg"} textAlign={"center"}>
          Dashboard
        </Heading>

        <Box padding={[".4rem", "2rem"]}>
          <Section title={"IDE Projekte"} entries={projectEntries} />
          <Section title={"ToDo Listen"} entries={todoEntries} />
          <Section title={"Zertifikate"} entries={certificates} />
          <Section title={"Projektplanung"} entries={projectPlanningEntries} />
        </Box>
      </Flex>
    </>
  );
}

function Section(props: {
  title: string;
  entries: {
    title: string;
    description?: string;
    href: string;
  }[];
}) {
  return (
    <>
      <Flex direction={"column"} mt={["2rem", "1.2rem"]}>
        <Heading size={"lg"} textAlign={["center", "left"]}>
          {props.title}
        </Heading>
        <Flex
          direction={"row"}
          overflow={"auto"}
          mt={"1.2rem"}
          maxW={"100%"}
          style={{
            scrollbarWidth: "thin",
          }}
        >
          {props.entries.length === 0 ? <Spinner size={"xl"} /> : null}
          {props.entries.map((e) => {
            return (
              <SectionCard
                title={e.title}
                description={e.description}
                href={e.href}
              />
            );
          })}
        </Flex>
      </Flex>
    </>
  );
}

function SectionCard(props: {
  title: string;
  description?: string;
  href: string;
}) {
  const [hoverRef, isHovering] = useHover();
  const router = useRouter();

  return (
    <Tooltip label={"Ansehen"} hasArrow>
      <Box
        bgColor={"gray.900"}
        rounded={"lg"}
        padding={"2rem"}
        flex={"5%"}
        // @ts-ignore
        ref={hoverRef}
        shadow={isHovering ? "lg" : "none"}
        margin={".6rem"}
        cursor={"pointer"}
        onClick={async () => {
          await router.push(props.href);
        }}
      >
        <Heading size={"md"}>{props.title}</Heading>
        {props.description && (
          <>
            <Text fontSize={"lg"} color={"gray.400"} mt={".4rem"} noOfLines={2}>
              {props.description}
            </Text>
          </>
        )}
      </Box>
    </Tooltip>
  );
}
