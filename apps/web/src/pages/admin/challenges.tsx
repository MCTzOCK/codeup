/**
 * apps/web/src/pages/admin/challenges.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
 *
 */

import * as React from "react";

import AdminLayout from "@codeup/components/admin/AdminLayout";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";
import CodeUpModal from "@codeup/components/dist/codeup/CodeUpModal";
import PopupManager from "../../global/PopupManager";
import DataTable from "@codeup/components/dist/extra/DataTable";

export default function ChallengesPage() {
  const [challenges, setChallenges] = React.useState<
    {
      createdAt: string;
      _id: string;
      title: string;
      difficulty: number;
      task: string;
      expectedOutput: string;
    }[]
  >([]);

  const [currentChallenge, setCurrentChallenge] = React.useState<{
    createdAt: string;
    _id: string;
    title: string;
    difficulty: number;
    task: string;
    expectedOutput: string;
  } | null>(null);

  const reload = async () => {
    const res = await REST.Challenges.getChallenges(
      AccountManager.getActiveToken()
    );
    setChallenges(res.payload.challenges);
  };

  React.useEffect(() => {
    reload();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [query, setQuery] = React.useState<string>("");

  return (
    <AdminLayout>
      <Flex p={4} justifyContent={"space-between"} alignItems={"center"}>
        <Box w={"100%"} textAlign={"center"}>
          <CHeading size={"xl"}>Challenges</CHeading>
        </Box>
        <Button
          variant={"brand"}
          leftIcon={<FaPlus />}
          onClick={() => {
            onOpen();
          }}
        >
          Neu
        </Button>
      </Flex>
      <Box p={4} maxW={"99vw"} overflow={"auto"}>
        <Input
          placeholder={"Suche..."}
          mb={4}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Th>Erstellt</Th>
              <Th>Titel</Th>
              <Th>Schwierigkeit</Th>
              <Th>Aufgabe</Th>
              <Th>Erwartete Ausgabe</Th>
              <Th>Aktionen</Th>
            </Thead>
            <Tbody>
              {challenges
                .filter((c) => c.title.includes(query))
                .map((c) => {
                  return (
                    <>
                      <Tr>
                        <Td>{new Date(c.createdAt).toLocaleString()}</Td>
                        <Td>{c.title}</Td>
                        <Td>
                          {c.difficulty === 1
                            ? "Leicht"
                            : c.difficulty === 2
                            ? "Mittel"
                            : "Schwer"}
                        </Td>
                        <Td>{c.task.substring(0, 100)}...</Td>
                        <Td>{c.expectedOutput}</Td>
                        <Td display={"flex"} gap={2}>
                          <IconButton
                            aria-label={"Edit"}
                            variant={"brand"}
                            icon={<FaPen />}
                            onClick={() => {
                              setCurrentChallenge(c);
                              onOpen();
                            }}
                          />
                          <IconButton
                            aria-label={"Edit"}
                            colorScheme={"red"}
                            icon={<FaTrash />}
                            onClick={async () => {
                              if (
                                !(await PopupManager.confirmAsync({
                                  title: "Löschen",
                                  question:
                                    "Möchtest du diese Challenge wirklich löschen?",
                                }))
                              )
                                return;

                              const res = await REST.Admin.deleteChallenge({
                                token: AccountManager.getActiveToken(),
                                id: c._id,
                              });

                              if (res.status === 200) {
                                reload();
                              } else {
                                PopupManager.alertAsync({
                                  title: "Fehler",
                                  description: res.payload.error,
                                });
                              }
                            }}
                          />
                        </Td>
                      </Tr>
                    </>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <CodeUpModal
        onOpen={onOpen}
        onClose={() => {
          onClose();
          setCurrentChallenge(null);
        }}
        isOpen={isOpen}
        title={currentChallenge ? "Bearbeiten" : "Neue Challenge"}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const data = new FormData(e.target as HTMLFormElement);

            if (currentChallenge) {
              const res = await REST.Admin.updateChallenge({
                id: currentChallenge._id,
                token: AccountManager.getActiveToken(),
                title: data.get("title") as string,
                task: data.get("task") as string,
                difficulty: parseInt(data.get("difficulty") as string),
                expectedOutput: data.get("expectedOutput") as string,
              });

              if (res.status === 200) {
                onClose();
                reload();
              } else {
                PopupManager.alertAsync({
                  title: "Fehler",
                  description: res.payload.error,
                });
              }
            } else {
              const res = await REST.Admin.createChallenge({
                token: AccountManager.getActiveToken(),
                title: data.get("title") as string,
                task: data.get("task") as string,
                difficulty: parseInt(data.get("difficulty") as string),
                expectedOutput: data.get("expectedOutput") as string,
              });

              if (res.status === 200) {
                onClose();
                reload();
              } else {
                PopupManager.alertAsync({
                  title: "Fehler",
                  description: res.payload.error,
                });
              }
            }
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Titel</FormLabel>
              <Input
                placeholder={"Titel"}
                name={"title"}
                defaultValue={currentChallenge?.title}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Aufgabe (Markdown)</FormLabel>
              <Textarea
                placeholder={"Aufgabe"}
                name={"task"}
                minH={"200px"}
                defaultValue={currentChallenge?.task}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Schwierigkeit</FormLabel>
              <Select
                placeholder={"Schwierigkeit"}
                name={"difficulty"}
                defaultValue={currentChallenge?.difficulty}
              >
                <option value={1}>Leicht</option>
                <option value={2}>Mittel</option>
                <option value={3}>Schwer</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Erwartete Ausgabe</FormLabel>
              <Textarea
                placeholder={"Erwartete Ausgabe"}
                name={"expectedOutput"}
                minH={"200px"}
                defaultValue={currentChallenge?.expectedOutput}
              />
            </FormControl>
            <Button type={"submit"} variant={"brand"}>
              Speichern
            </Button>
          </Stack>
        </form>
      </CodeUpModal>
    </AdminLayout>
  );
}
