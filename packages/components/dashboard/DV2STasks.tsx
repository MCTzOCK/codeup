/**
 * packages/components/dashboard/DV2STasks.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.07.2024
 *
 */

import * as React from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import {
  Flex,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tfoot,
  Th,
  Td,
  Tr,
  Progress,
  Button,
} from "@chakra-ui/react";
import { CHeading } from "../global/CHeading";
import router from "next/router";
import { FaPlus } from "react-icons/fa";

export default function DV2STasks() {
  const [lists, setLists] = React.useState<
    {
      _id: string;
      name: string;
      owner: string;
      createdAt: string;
      items: any[];
    }[]
  >([]);

  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    reloadLists();
  }, []);

  const reloadLists = async () => {
    const res = await REST.ToDo.V2.getMyLists(AccountManager.getActiveToken());

    if (res.status !== 200) {
      setError("Listen konnten nicht geladen werden: " + res.payload.error);
      return;
    }

    //setLists(res.payload.lists);
  };

  if (error) {
    return (
      <>
        <Flex justifyContent={"center"} p={4}>
          {error}
        </Flex>
      </>
    );
  }

  return (
    <>
      <CHeading size={"lg"} mb={4}>
        Deine ToDos
      </CHeading>
      <TableContainer>
        <Table maxW={"100%"}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Erstellt</Th>
              <Th>Einträge</Th>
              <Th>Fortschritt</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {lists.map((list) => (
              <Tr
                key={list._id}
                _hover={{
                  bg: "gray.600",
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push("/tasks?list_id=" + list._id);
                }}
              >
                <Td>{list.name}</Td>
                <Td>{new Date(list.createdAt).toLocaleString()}</Td>
                <Td>{list.items.length}</Td>
                <Td>
                  <Progress
                    variant={"brand"}
                    rounded={"md"}
                    size={"sm"}
                    max={100}
                    value={
                      (list.items.filter((x) => x.done).length /
                        list.items.length) *
                      100
                    }
                  />
                </Td>
                <Td></Td>
              </Tr>
            ))}
            {lists.length === 0 && (
              <>
                <Tr>
                  <Td colSpan={4}>Keine Einträge gefunden.</Td>
                  <Td>
                    <Button
                      variant={"brand"}
                      leftIcon={<FaPlus />}
                      onClick={() => {
                        router.push("/tasks");
                      }}
                    >
                      Neue Liste
                    </Button>
                  </Td>
                </Tr>
              </>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
