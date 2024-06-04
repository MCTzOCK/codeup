/**
 * apps/web/src/pages/projects/[id]/planning/overview.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.06.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import EditorProjectLayout from "@codeup/components/editorv2/EditorProjectLayout";
import { useRouter } from "next/router";
import { IIssue } from "../../../../types/IIssue";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import { Badge, Box, Flex, Grid, Stack, Text } from "@chakra-ui/react";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import PopupManager from "../../../../global/PopupManager";

export default function Overview() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const router = useRouter();

  const [issues, setIssues] = React.useState<IIssue[]>([]);
  const [flows, setFlows] = React.useState<any[]>([]);

  React.useEffect(() => {
    reloadData();
  }, []);

  const reloadData = async () => {
    const iRes = await REST.Projects.getIssues(
      AccountManager.getActiveToken(),
      router.query.id as string
    );
    if (iRes.status === 200) {
      setIssues(iRes.payload.issues);
    }
    const fRes = await REST.Projects.getFlows(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (fRes.status === 200) {
      setFlows(fRes.payload.flows);
    }
  };

  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={4}>
          <CHeading size={"lg"}>Planungsübersicht</CHeading>
          <Grid
            templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
            w={"100%"}
            p={8}
            gap={8}
          >
            <Box bg={"gray.900"} rounded={"md"} p={4}>
              <CHeading size={"md"}>Probleme</CHeading>
              <Stack pt={4}>
                {issues.slice(0, 5).map((issue) => (
                  <Flex
                    bg={"gray.800"}
                    rounded={"md"}
                    p={4}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    cursor={"pointer"}
                    onClick={async () => {
                      await PopupManager.alertAsync({
                        title: issue.title,
                        description: (
                          <>
                            <Box>
                              <b>Beschreibung:</b>
                              <br />
                              {issue.description}
                            </Box>
                            <Box>
                              <b>Erstellt:</b>
                              <br />
                              {new Date(issue.createdAt).toLocaleString()}
                            </Box>
                            <Box>
                              <b>Status:</b>
                              <br />
                              {issue.status === "open"
                                ? "Offen"
                                : issue.status === "closed"
                                ? "Geschlossen"
                                : "In Bearbeitung"}
                            </Box>
                            <Box>
                              <b>Priorität:</b>
                              <br />
                              {issue.priority === "low"
                                ? "Niedrig"
                                : issue.priority === "medium"
                                ? "Mittel"
                                : "Hoch"}
                            </Box>
                          </>
                        ),
                      });
                    }}
                  >
                    <CHeading size={"md"}>{issue.title}</CHeading>
                    <Text>{new Date(issue.createdAt).toLocaleString()}</Text>
                    <Badge
                      colorScheme={issue.status === "open" ? "red" : "green"}
                    >
                      {issue.status}
                    </Badge>
                    <Badge
                      colorScheme={
                        issue.priority === "high"
                          ? "red"
                          : issue.priority === "medium"
                          ? "yellow"
                          : "green"
                      }
                    >
                      {issue.priority}
                    </Badge>
                    <Box></Box>
                    <Box></Box>
                  </Flex>
                ))}
              </Stack>
            </Box>
            <Box bg={"gray.900"} p={4} rounded={"md"}>
              <CHeading size={"md"}>Flussdiagramme</CHeading>
              <Stack pt={4}>
                {flows.slice(0, 5).map((flow) => (
                  <Flex
                    bg={"gray.800"}
                    rounded={"md"}
                    p={4}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    cursor={"pointer"}
                    onClick={async () => {
                      router.push(
                        "/projects/" + router.query.id + "/flows/" + flow._id
                      );
                    }}
                  >
                    <CHeading size={"md"}>{flow.name}</CHeading>
                    <Text>{new Date(flow.createdAt).toLocaleString()}</Text>
                    <Box></Box>
                    <Box></Box>
                  </Flex>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Box>
      </EditorProjectLayout>
    </>
  );
}
