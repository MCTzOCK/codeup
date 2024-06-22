/**
 * apps/web/src/pages/projects/[id]/dbs.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../../types/IProject";
import { IWikiPage } from "../../../types/IWikiPage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/dist/editorv2/EditorProjectLayout";
import {
  Box,
  Grid,
  Input,
  Table,
  TableContainer,
  Textarea,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  ButtonGroup,
  IconButton,
  Stack,
  HStack,
  FormControl,
  FormLabel,
  useDisclosure,
} from "@chakra-ui/react";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { FaClock, FaEye, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import DBTableCreator from "@codeup/components/editorv2/db/DBTableCreator";
import SQLExecutor from "@codeup/components/editorv2/db/SQLExecutor";

export default function Dbs() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const [project, setProject] = React.useState<IProject | null>(null);
  const [credentials, setCredentials] = React.useState<{
    username: string;
    password: string;
    host: string;
    port: string;
  } | null>(null);

  const [tables, setTables] = React.useState<
    {
      name: string;
      rows: number;
    }[]
  >([]);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then(async (res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reloadCreds();
      } else {
        PopupManager.alertAsync({
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const reloadCreds = async () => {
    const res = await REST.Projects.DB.getCredentials(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die Datenbank-Credentials konnten nicht geladen werden: " +
          res.payload.error,
      });
    }

    setCredentials(res.payload.data);

    await reloadTables();
  };

  const reloadTables = async () => {
    const res = await REST.Projects.DB.executeSQL(
      AccountManager.getActiveToken(),
      router.query.id as string,
      "SHOW TABLES"
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die Tabellen konnten nicht geladen werden: " + res.payload.error,
      });
    }

    let t = [];

    for (const x of res.payload.data) {
      t.push(x[Object.keys(x)[0]]);
    }

    let tx: {
      name: string;
      rows: number;
    }[] = [];

    for (const table of t) {
      const res = await REST.Projects.DB.executeSQL(
        AccountManager.getActiveToken(),
        router.query.id as string,
        `SELECT COUNT(*) as count FROM ${table}`
      );

      if (res.status !== 200) {
        await PopupManager.alertAsync({
          title: "Fehler",
          description:
            "Die Tabellen konnten nicht geladen werden: " + res.payload.error,
        });
      }

      tx.push({
        name: table,
        rows: res.payload.data[0].count,
      });
    }

    setTables(tx);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [baseSQL, setBaseSQL] = React.useState<string>("");

  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={2}>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
            gap={4}
            p={4}
          >
            <Box rounded={"md"} bg={"gray.900"} p={4}>
              <CHeading size={"lg"}>Login-Daten</CHeading>
              <Stack mt={2} gap={2}>
                <Box>
                  <CHeading size={"md"}>Host:</CHeading>
                  <Box>{credentials?.host}</Box>
                </Box>
                <Box>
                  <CHeading size={"md"}>Port:</CHeading>
                  <Box>{credentials?.port}</Box>
                </Box>
                <Box>
                  <CHeading size={"md"}>Username:</CHeading>
                  <Box>{credentials?.username}</Box>
                </Box>
                <Box>
                  <CHeading size={"md"}>Passwort:</CHeading>
                  <Box>{credentials?.password}</Box>
                </Box>
                <Box>
                  <CHeading size={"md"}>Zusammenfassung:</CHeading>
                  <Input
                    placeholder={"Connection string"}
                    value={`mysql://${credentials?.username}:${credentials?.password}@${credentials?.host}:${credentials?.port}/${router.query.id}`}
                    mt={2}
                  />
                </Box>
                <Box>
                  <CHeading size={"md"}>.env-Datei:</CHeading>
                  <Textarea
                    value={`DB_HOST=${credentials?.host}
DB_PORT=${credentials?.port}
DB_USER=${credentials?.username}
DB_PASS=${credentials?.password}
DB_NAME=${router.query.id}`}
                    height={"fit-content"}
                    minH={"150px"}
                  ></Textarea>
                </Box>
              </Stack>
            </Box>
            <Box rounded={"md"} bg={"gray.900"} p={4}>
              <HStack justifyContent={"space-between"}>
                <CHeading size={"lg"}>Tabellen</CHeading>
                <IconButton
                  variant={"brand"}
                  icon={<FaPlus />}
                  aria-label={"Neue Tabelle"}
                  onClick={async () => {
                    await PopupManager.alertAsync({
                      title: "Neue Tabelle",
                      description: (
                        <>
                          <DBTableCreator
                            callback={async (name, columns) => {
                              const res = await REST.Projects.DB.executeSQL(
                                AccountManager.getActiveToken(),
                                router.query.id as string,
                                `CREATE TABLE ${name} (${columns
                                  .map((c) => `${c.name} ${c.type}`)
                                  .join(", ")},
                                   PRIMARY KEY (ID)
                                  )`
                              );

                              if (res.status !== 200) {
                                await PopupManager.alertAsync({
                                  title: "Fehler",
                                  description:
                                    "Die Tabelle konnte nicht erstellt werden: " +
                                    res.payload.error,
                                });
                                return;
                              }

                              await reloadTables();
                            }}
                          />
                        </>
                      ),
                    });
                  }}
                />
              </HStack>
              <TableContainer>
                <Table maxW={"100%"}>
                  <Thead>
                    <Tr>
                      <Td>Name</Td>
                      <Td>Zeilen</Td>
                      <Td>Aktionen</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tables.map((t) => {
                      return (
                        <Tr>
                          <Td>{t.name}</Td>
                          <Td>{t.rows}</Td>
                          <Td>
                            <ButtonGroup>
                              <IconButton
                                aria-label={"Ansehen"}
                                icon={<FaEye />}
                                variant={"brand"}
                                onClick={() => {
                                  setBaseSQL(`SELECT * FROM ${t.name}`);
                                  onOpen();
                                }}
                              />
                              <IconButton
                                aria-label={"Löschen"}
                                icon={<FaTrash />}
                                colorScheme={"red"}
                                onClick={async () => {
                                  if (
                                    !(await PopupManager.confirmAsync({
                                      title: "Tabelle löschen?",
                                      question:
                                        "Willst du die Tabelle wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden!",
                                    }))
                                  )
                                    return;

                                  const res = await REST.Projects.DB.executeSQL(
                                    AccountManager.getActiveToken(),
                                    router.query.id as string,
                                    "DROP TABLE " + t.name
                                  );
                                  if (res.status !== 200) {
                                    await PopupManager.alertAsync({
                                      title: "Fehler",
                                      description:
                                        "Die Tabelle konnte nicht gelöscht werden: " +
                                        res.payload.error,
                                    });
                                    return;
                                  }

                                  await reloadTables();
                                }}
                              />
                            </ButtonGroup>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Box>
      </EditorProjectLayout>
      <SQLExecutor
        isOpen={isOpen}
        onClose={onClose}
        projectId={router.query.id as string}
        base_sql={baseSQL}
      />
    </>
  );
}
