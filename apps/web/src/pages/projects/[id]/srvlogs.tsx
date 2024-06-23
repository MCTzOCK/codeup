/**
 * apps/web/src/pages/projects/[id]/srvlogs.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.06.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../../types/IProject";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/dist/editorv2/EditorProjectLayout";
import { Box, Flex, Text } from "@chakra-ui/react";
import { CHeading } from "@codeup/components/dist/global/CHeading";

export default function Srvlogs() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const [project, setProject] = React.useState<IProject | null>(null);
  const [logs, setLogs] = React.useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then(async (res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reload();
      } else {
        PopupManager.alertAsync({
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const reload = async () => {
    const res = await REST.Projects.Deployment.getCurrentDeployment(
      AccountManager.getActiveToken(),
      router.query.id as string,
      true
    );

    if (res.status === 200) {
      setLogs(res.payload.logs);
    } else {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die Logs konnten nicht geladen werden: " + res.payload.error,
      });
    }
  };

  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={4}>
          <Flex justifyContent={"center"}>
            <Box textAlign={"center"} maxW={"500px"}>
              <CHeading size={"lg"}>Server-Logs</CHeading>
              <Text textAlign={"left"}>
                Server-Logs zeigen dir, wie sich dein Projekt verhält und ob es
                Probleme gibt, die du beheben musst. Server-Logs umfassen immer
                nur das letzte Deployment.
              </Text>
            </Box>
          </Flex>
          <Box p={4} rounded={"md"} bg={"gray.900"} mt={4}>
            <pre>
              {logs.length === 0
                ? "Keine Logs vorhanden / Logs werden geladen..."
                : logs}
            </pre>
          </Box>
        </Box>
      </EditorProjectLayout>
    </>
  );
}
