/**
 * apps/web/src/pages/challenges/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
 *
 */

import * as React from "react";
import {
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  chakra,
} from "@chakra-ui/react";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { useEffect } from "react";
import redirect from "@codeup/util/dist/userworkflow/redirect";
import REST from "@codeup/rest";
import AccountManager from "@codeup/util/dist/AccountManager";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Index() {
  const [challenges, setChallenges] = React.useState<
    {
      _id: string;
      title: string;
      difficulty: number;
      task: string;
    }[]
  >([]);
  const [completed, setCompleted] = React.useState<string[]>([]);

  useEffect(() => {
    redirect({
      forceAnonymous: false,
      allowAnonymous: false,
      redirectToLogin: true,
      redirectTo: "/challenges",
    });
  });

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    const r0 = await REST.Challenges.getChallenges(
      AccountManager.getActiveToken()
    );

    if (r0.status !== 200) {
      return;
    }

    setChallenges(r0.payload.challenges);

    const r1 = await REST.Challenges.getCompletedChallenges(
      AccountManager.getActiveToken()
    );

    if (r1.status !== 200) {
      return;
    }

    setCompleted(r1.payload.data.map((c: any) => c.challenge));
  };

  const router = useRouter();

  const [showCompleted, setShowCompleted] = React.useState<boolean>(false);

  return (
    <>
      <Box w={"100%"} h={"fit-content"} minH={"100vh"} bg={"#000"} p={4}>
        <Box textAlign={"center"}>
          <CHeading size={"xl"}>Challenges</CHeading>
          <Button
            mt={3}
            variant={"brand"}
            onClick={() => {
              setShowCompleted(!showCompleted);
            }}
          >
            Abgeschlossene {showCompleted ? "verstecken" : "anzeigen"}
          </Button>
        </Box>
        <Box p={4}>
          <TableContainer>
            <Table variant={"simple"}>
              <Thead>
                <Th>Abgeschlossen</Th>
                <Th>Titel</Th>
                <Th>Schwierigkeit</Th>
                <Th>Aufgabe</Th>
              </Thead>
              <Tbody>
                {challenges
                  .filter((c) => showCompleted || !completed.includes(c._id))
                  .map((c) => {
                    return (
                      <>
                        <Tr
                          _hover={{ bg: "gray.700" }}
                          cursor={"pointer"}
                          onClick={() => {
                            router.push("/challenges/" + c._id);
                          }}
                        >
                          <Td>
                            {completed.includes(c._id) ? (
                              <chakra.span color={"brand.500"}>
                                <FaCheckCircle />
                              </chakra.span>
                            ) : (
                              <chakra.span color={"red.500"}>
                                <FaTimesCircle />
                              </chakra.span>
                            )}
                          </Td>
                          <Td>{c.title}</Td>
                          <Td
                            color={
                              c.difficulty === 1
                                ? "green.500"
                                : c.difficulty === 2
                                ? "orange.500"
                                : "red.500"
                            }
                          >
                            {c.difficulty === 1
                              ? "Leicht"
                              : c.difficulty === 2
                              ? "Mittel"
                              : "Schwer"}
                          </Td>
                          <Td>{c.task.substring(0, 100)}...</Td>
                        </Tr>
                      </>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
