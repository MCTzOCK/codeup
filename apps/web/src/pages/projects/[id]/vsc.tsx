/**
 * apps/web/src/pages/projects/[id]/vsc.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.06.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { useRouter } from "next/router";
import { IProject } from "../../../types/IProject";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/editorv2/EditorProjectLayout";
import {
  Box,
  Grid,
  Tab,
  Table,
  TableContainer,
  TabList,
  Tabs,
  Th,
  Tr,
  Td,
  Thead,
  Tbody,
  HStack,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";

export default function Vsc() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const router = useRouter();

  const [project, setProject] = React.useState<IProject | null>(null);
  const [branches, setBranches] = React.useState<{
    [key: string]: {
      current: boolean;
      linkedWorkTree: boolean;
      name: string;
      commit: string;
      label: string;
    };
  }>({});
  const [commits, setCommits] = React.useState<
    {
      hash: string;
      date: string;
      message: string;
      refs: string;
      body: string;
      author_name: string;
      author_email: string;
    }[]
  >([]);
  const [status, setStatus] = React.useState<string[]>([]);

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then(async (res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reloadVSC();
      } else {
        PopupManager.alertAsync({
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const reloadVSC = async () => {
    const branchesRes = await REST.Projects.GitOps.branch(
      AccountManager.getActiveToken(),
      router.query.id as string
    );
    if (branchesRes.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die Branches konnten nicht geladen werden: " +
          branchesRes.payload.error,
      });
      return;
    }
    setBranches(branchesRes.payload.data.branches);

    const commitsRes = await REST.Projects.GitOps.commits(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (commitsRes.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die Commits konnten nicht geladen werden: " +
          commitsRes.payload.error,
      });
      return;
    }

    setCommits(commitsRes.payload.data.all);

    const statusRes = await REST.Projects.GitOps.status(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (statusRes.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Der Status konnte nicht geladen werden: " + statusRes.payload.error,
      });
      return;
    }

    setStatus(statusRes.payload.data.not_added);
  };

  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={2}>
          <Grid
            templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
            gap={4}
            p={2}
          >
            <Box bg={"gray.900"} p={4} rounded={"md"} h={"100%"}>
              <HStack justifyContent={"space-between"}>
                <CHeading size={"lg"}>Branches</CHeading>
                <IconButton
                  aria-label={"Neu"}
                  icon={<FaPlus />}
                  variant={"brand"}
                  onClick={async () => {
                    const name = await PopupManager.promptAsync({
                      title: "Neuer Branch",
                      helperText:
                        "Bitte gib den Namen deines neuen Branches ein! Achtung: Der neue Branch wird direkt ausgewählt und kann nicht mehr gelöscht werden!",
                    });

                    if (!name) return;

                    const res = await REST.Projects.GitOps.setBranch(
                      AccountManager.getActiveToken(),
                      router.query.id as string,
                      name
                    );

                    if (res.status !== 200) {
                      await PopupManager.alertAsync({
                        title: "Fehler",
                        description:
                          "Der Branch konnte nicht erstellt werden: " +
                          res.payload.error,
                      });
                      return;
                    }

                    await reloadVSC();
                  }}
                />
              </HStack>
              <TableContainer>
                <Table maxW={"100%"}>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Aktuell</Th>
                      <Th>Letzter Commit</Th>
                      <Th>Letze Commit-Nachricht</Th>
                      <Th>Auswählen</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Object.keys(branches).map((key) => {
                      if (key.startsWith("remotes/")) {
                        return null;
                      }
                      return (
                        <>
                          <Tr>
                            <Td>{branches[key].name}</Td>
                            <Td>{branches[key].current ? "Ja" : "Nein"}</Td>
                            <Td>{branches[key].commit}</Td>
                            <Td>{branches[key].label}</Td>
                            <Td>
                              <ButtonGroup>
                                <IconButton
                                  aria-label={"Auswählen"}
                                  icon={<FaShuffle />}
                                  variant={"brand"}
                                  isDisabled={branches[key].current}
                                  onClick={async () => {
                                    const res =
                                      await REST.Projects.GitOps.setBranch(
                                        AccountManager.getActiveToken(),
                                        router.query.id as string,
                                        key
                                      );

                                    if (res.status !== 200) {
                                      await PopupManager.alertAsync({
                                        title: "Fehler",
                                        description:
                                          "Der Branch konnte nicht ausgewählt werden: " +
                                          res.payload.error,
                                      });
                                      return;
                                    }

                                    await reloadVSC();
                                  }}
                                />
                              </ButtonGroup>
                            </Td>
                          </Tr>
                        </>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
            <Box bg={"gray.900"} p={4} rounded={"md"} h={"100%"}>
              <HStack justifyContent={"space-between"}>
                <CHeading size={"lg"}>Commits</CHeading>
                <IconButton
                  aria-label={"Neu"}
                  icon={<FaPlus />}
                  variant={"brand"}
                  onClick={async () => {
                    if (status.length === 0) {
                      await PopupManager.alertAsync({
                        title: "Fehler",
                        description:
                          "Es gibt keine neuen Dateien, die commited werden können!",
                      });
                      return;
                    }
                    const message = await PopupManager.promptAsync({
                      title: "Neuer Commit",
                      helperText:
                        "Bitte gib die Commit-Nachricht für deinen neuen Commit ein!",
                    });

                    if (!message) return;

                    const res = await REST.Projects.GitOps.commit(
                      AccountManager.getActiveToken(),
                      router.query.id as string,
                      message
                    );

                    if (res.status !== 200) {
                      await PopupManager.alertAsync({
                        title: "Fehler",
                        description:
                          "Der Commit konnte nicht erstellt werden: " +
                          res.payload.error,
                      });
                      return;
                    }

                    await reloadVSC();
                  }}
                />
              </HStack>
              <TableContainer>
                <Table maxW={"100%"}>
                  <Thead>
                    <Tr>
                      <Th>Hash</Th>
                      <Th>Datum</Th>
                      <Th>Nachricht</Th>
                      <Th>Author</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {commits.map((commit) => {
                      return (
                        <>
                          <Tr>
                            <Td>{commit.hash}</Td>
                            <Td>
                              {new Date(commit.date).toLocaleDateString()}
                            </Td>
                            <Td>{commit.message}</Td>
                            <Td>
                              {commit.author_name} &lt;{commit.author_email}&gt;
                            </Td>
                          </Tr>
                        </>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Box>
      </EditorProjectLayout>
    </>
  );
}
