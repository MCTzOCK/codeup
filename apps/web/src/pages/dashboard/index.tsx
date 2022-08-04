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
import { Box, Flex, Heading, Spinner, Tooltip } from "@chakra-ui/react";
import { useHover } from "@codeup/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import REST from "@codeup/rest";
import redirect from "@codeup/util/src/userworkflow/redirect";

export default function Dashboard() {
  const [projectEntries, setProjectEntries] = useState<
    { title: string; description?: string; href: string }[]
  >([]);

  const [todoEntries, setTodoEntries] = useState<
    { title: string; description?: string; href: string }[]
  >([]);

  useEffect(() => {
    redirect({
      redirectToLogin: true,
      redirectTo: "/dashboard",
      allowAnonymous: false,
      forceAnonymous: false,
    });
  }, []);

  useEffect(() => {
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
        setTodoEntries(x);
      }
    );
  }, []);

  return (
    <>
      <Flex direction={"column"} mt={"2rem"}>
        <Heading size={"lg"} textAlign={"center"}>
          Dashboard
        </Heading>

        <Box padding={[".4rem", "2rem"]}>
          <Section
            title={"IDE Projekte (" + projectEntries.length + ")"}
            entries={projectEntries}
          />
          <Section
            title={"ToDo Listen (" + todoEntries.length + ")"}
            entries={todoEntries}
          />
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
      </Box>
    </Tooltip>
  );
}
