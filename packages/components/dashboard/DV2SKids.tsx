/**
 * packages/components/dashboard/DV2SKids.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.07.2024
 *
 */

import * as React from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import {
  Button,
  Flex,
  Progress,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { CHeading } from "../global/CHeading";
import router from "next/router";
import { FaPlus } from "react-icons/fa";

export default function DV2SKids() {
  const [projects, setProjects] = React.useState<
    {
      _id: string;
      name: string;
      owner: string;
      code: string;
    }[]
  >([]);

  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    reloadKids();
  }, []);

  const reloadKids = async () => {
    const res = await REST.Kids.getProjects(AccountManager.getActiveToken());

    if (res.status !== 200) {
      setError(
        "Kids-Projekte konnten nicht geladen werden: " + res.payload.error
      );
      return;
    }

    setProjects(res.payload.projects);
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
        CodeUp-Kids
      </CHeading>
      <TableContainer>
        <Table maxW={"100%"}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Blöcke</Th>
            </Tr>
          </Thead>
          <Tbody>
            {projects.map((project) => {
              const blocks = (project.code.match(/<block/g) || []).length;

              return (
                <Tr
                  key={project._id}
                  _hover={{
                    bg: "gray.600",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    router.push("/kids/" + project._id);
                  }}
                >
                  <Td>{project.name}</Td>
                  <Td>
                    {blocks} {blocks === 1 ? "Block" : "Blöcke"}
                  </Td>
                </Tr>
              );
            })}
            {projects.length === 0 && (
              <>
                <Tr>
                  <Td>Keine Einträge gefunden.</Td>
                  <Td>
                    <Button
                      variant={"brand"}
                      leftIcon={<FaPlus />}
                      onClick={() => {
                        router.push("/kids");
                      }}
                    >
                      Neues Kids Projekt
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
