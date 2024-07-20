/**
 * apps/web/src/pages/projects/[id]/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.05.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { useRouter } from "next/router";
import { Box, Flex, Grid, Stack, Text } from "@chakra-ui/react";
import AppShell from "@codeup/components/dist/global/AppShell";
import { IProject } from "../../../types/IProject";
import { useEffect } from "react";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/editorv2/EditorProjectLayout";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import {
  FaBookOpen,
  FaChartLine,
  FaCode,
  FaCogs,
  FaDatabase,
  FaFile,
  FaHome,
} from "react-icons/fa";
import { VscIssues } from "react-icons/vsc";
import { GoProject } from "react-icons/go";
import {
  FaChartSimple,
  FaCodeBranch,
  FaDiagramSuccessor,
  FaFileLines,
  FaLanguage,
} from "react-icons/fa6";

export default function Index() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const [project, setProject] = React.useState<IProject | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then((res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
      } else {
        PopupManager.alertAsync({
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);
  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={2}>
          <Box textAlign={"center"}>
            <CHeading size={"lg"}>Projektübersicht</CHeading>
            <Text fontSize={"lg"}>
              Willkommen im Projekt &quot;{project?.name}&quot;. Verwende die
              Navigationsleiste (links) um zu den verschiedenen Aspekten deines
              Projektes zu navigieren!
            </Text>
          </Box>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(3, 1fr)",
              "repeat(5, 1fr)",
            ]}
            p={4}
            gap={4}
          >
            {[
              {
                text: "Probleme",
                icon: <VscIssues />,
                href: "/projects/" + project?._id + "/issues",
              },
              {
                text: "Planungsübersicht",
                icon: <GoProject />,
                href: "/projects/" + project?._id + "/planning/overview",
              },
              {
                text: "Flussdiagramme",
                icon: <FaDiagramSuccessor />,
                href: "/projects/" + project?._id + "/flows",
              },
              {
                text: "Versionsverwaltung",
                icon: <FaCodeBranch />,
                href: "/projects/" + project?._id + "/vsc",
              },
              {
                text: "Einstellungen",
                icon: <FaCogs />,
                href: "/projects/" + project?._id + "/settings",
              },
              {
                text: "Statische Ressourcen",
                icon: <FaFile />,
                href: "/projects/" + project?._id + "/static",
              },
              {
                text: "Wiki",
                icon: <FaBookOpen />,
                href: "/projects/" + project?._id + "/wiki",
              },
              {
                text: "Datenbanken",
                icon: <FaDatabase />,
                href: "/projects/" + project?._id + "/dbs",
              },
              {
                text: "Statistiken",
                icon: <FaChartLine />,
                href: "/projects/" + project?._id + "/stats",
              },
              {
                text: "Server-Logs",
                icon: <FaFileLines />,
                href: "/projects/" + project?._id + "/srvlogs",
              },
              {
                text: "Editor",
                icon: <FaCode />,
                href: "/projects/" + project?._id + "/editor/professional",
              },
              {
                text: "UML-Diagramme",
                icon: <FaChartSimple />,
                href: "/projects/" + project?._id + "/uml",
              },
              {
                text: "Lokalisierung",
                icon: <FaLanguage />,
                href: "/projects/" + project?._id + "/i18n",
              },
            ].map((page) => {
              return (
                <>
                  <Box
                    bg={"gray.900"}
                    rounded={"md"}
                    p={2}
                    onClick={() => {
                      if (page.href.endsWith("/editor/professional")) {
                        window.location.assign(page.href);
                      } else {
                        router.push(page.href);
                      }
                    }}
                    cursor={"pointer"}
                  >
                    <Stack
                      textAlign={"center"}
                      fontSize={"3xl"}
                      w={"100%"}
                      justifyContent={"center"}
                    >
                      <Flex
                        w={"100%"}
                        color={"brand.500"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        {page.icon}
                      </Flex>
                      <CHeading size={"lg"}>{page.text}</CHeading>
                    </Stack>
                  </Box>
                </>
              );
            })}
          </Grid>
        </Box>
      </EditorProjectLayout>
    </>
  );
}
