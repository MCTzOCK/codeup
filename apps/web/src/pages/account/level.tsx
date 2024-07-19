/**
 * apps/web/src/pages/account/level.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.07.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import Head from "next/head";
import { CHeading } from "@codeup/components/global/CHeading";
import {
  Box,
  chakra,
  Flex,
  Progress,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tfoot,
  Th,
  Td,
  Tr,
  Text,
} from "@chakra-ui/react";

export default function Level() {
  const actions: { name: string; xp: number }[] = [
    {
      name: "Einloggen",
      xp: 1,
    },
    {
      name: "Einfache Code Challenge lösen (zum ersten Mal)",
      xp: 5,
    },
    {
      name: "Mittlere Code Challenge lösen (zum ersten Mal)",
      xp: 7,
    },
    {
      name: "Schwere Code Challenge lösen (zum ersten Mal)",
      xp: 10,
    },
    {
      name: "Zertifikat mit 100 % abschließen (zum ersten Mal)",
      xp: 25,
    },
    {
      name: "Projekt erstellen (CodeUp-Kids, IDE, Editor oder Dev-Suite)",
      xp: 2,
    },
    {
      name: "Code-Snippet erstellen",
      xp: 1,
    },
    {
      name: "ToDo-Liste erstellen",
      xp: 1,
    },
    {
      name: "Mind. 5 Einträge zu einer ToDo-Liste hinzufügen (nur neue Tasks-App)",
      xp: 2,
    },
    {
      name: "Flow Erstellen",
      xp: 1,
    },
    {
      name: "Forum-Post erstellen",
      xp: 4,
    },
    {
      name: "Organisation erstellen",
      xp: 1,
    },
    {
      name: "Mind. 5 Mitglieder zu einer Organisation hinzufügen",
      xp: 10,
    },
  ];

  useUserLoggedInRedirect({
    allowAnonymous: false,
  });
  const [levelError, setLevelError] = React.useState<string | null>(null);

  const [levelProgress, setLevelProgress] = React.useState<{
    level: number;
    xp: number;
    xpNeeded: number;
    transactions: {
      xp: number;
      reason: string;
      createdAt: Date;
    }[];
  } | null>(null);

  const reloadLevel = async () => {
    const res = await REST.Account.getLevelProgress(
      AccountManager.getActiveToken()
    );

    if (res.status === 200) {
      setLevelProgress(res.payload.data);
    } else {
      setLevelError(res.payload.error);
    }
  };

  React.useEffect(() => {
    reloadLevel();
  }, []);
  return (
    <>
      <Head>
        <title>Level - CodeUp</title>
      </Head>
      <Box bg={"#000"} h={"fit-content"} minH={"100vh"} p={2}>
        <CHeading size={"xl"} textAlign={"center"}>
          Level
        </CHeading>
        <Flex justifyContent={"center"} mt={4} mb={8}>
          <Box
            mt={4}
            rounded={"md"}
            bg={"black"}
            p={4}
            w={["100%", "90%", "60%"]}
          >
            <Text fontSize={"lg"}>
              Dein Level gibt Auskunft über deinen Fortschritt auf CodeUp. Du
              erhältst XP durch viele Aktionen (siehe unten) und steigst so auf.
              Ein Abstieg ist nicht möglich, also keine Sorge, wenn du mal eine
              Weile nicht aktiv bist! &#128522;
            </Text>
            <Text
              fontSize={"xl"}
              mt={4}
              fontWeight={"bold"}
              color={"brand.500"}
            >
              Dein aktuelles Level:{" "}
              {levelProgress ? levelProgress.level : "Lade..."}
            </Text>
            <Flex
              gap={4}
              alignItems={"center"}
              flexDirection={["column", "column", "row"]}
              maxW={["100%", "100%", "40%"]}
            >
              <Text fontSize={"lg"}>Aktueller Fortschritt:</Text>
              <Progress
                value={levelProgress ? levelProgress.xp : 0}
                max={levelProgress ? levelProgress.xpNeeded : 1}
                variant={"brand"}
                rounded={"md"}
                flex={1}
              />
            </Flex>
            <Text fontSize={"lg"}>
              ({levelProgress ? levelProgress.xp : 0}/
              {levelProgress ? levelProgress.xpNeeded : 1} XP)
            </Text>
            <Text
              fontSize={"lg"}
              mt={4}
              fontWeight={"bold"}
              color={"brand.500"}
            >
              Letzte Aktionen:
            </Text>
            {levelProgress ? (
              levelProgress.transactions
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((t, i) => (
                  <Box key={i} bg={"gray.500"} p={2} rounded={"md"} mt={2}>
                    <Text>
                      <chakra.b color={"brand.500"}>{t.xp}</chakra.b> XP durch{" "}
                      <chakra.b color={"brand.500"}>{t.reason}</chakra.b> am{" "}
                      {new Date(t.createdAt).toLocaleString()}
                    </Text>
                  </Box>
                ))
            ) : (
              <Text>Lade...</Text>
            )}
            {levelProgress ? (
              levelProgress.transactions.length === 0 ? (
                <Text fontSize={"lg"} mt={2}>
                  Noch keine Aktionen durchgeführt.
                </Text>
              ) : null
            ) : null}
            <Text
              fontSize={"lg"}
              mt={4}
              fontWeight={"bold"}
              color={"brand.500"}
            >
              Mögliche Aktionen:
            </Text>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Aktion</Th>
                    <Th>XP</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {actions
                    .sort((a, b) => a.xp - b.xp)
                    .map((action, i) => (
                      <Tr key={action.name}>
                        <Td>#{i + 1}</Td>
                        <Td>{action.name}</Td>
                        <Td>{action.xp}</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
