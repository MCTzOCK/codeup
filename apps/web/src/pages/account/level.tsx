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
import { actionMap } from "../../global/levels";

export default function Level() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const [actions, setActions] = React.useState<typeof actionMap>(actionMap);

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
                  {Object.keys(actions)
                    .sort((a, b) => (actions as any)[a] - (actions as any)[b])
                    .map((action, i) => (
                      <Tr key={(actions as any)[action as any]}>
                        <Td>#{i + 1}</Td>
                        <Td>{action}</Td>
                        <Td>{(actions as any)[action as any]}</Td>
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
