/**
 * packages/components/dashboard/DV2SFlows.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.07.2024
 *
 */

import * as React from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import {
  Button,
  Flex,
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

export default function DV2SFlows() {
  const [projects, setProjects] = React.useState<
    {
      _id: string;
      name: string;
      owner: string;
      saved: string;
    }[]
  >([]);

  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    reloadFlows();
  }, []);

  const reloadFlows = async () => {
    const res = await REST.ToDo.getV2Projects(AccountManager.getActiveToken());

    if (res.status !== 200) {
      setError("Flows konnten nicht geladen werden: " + res.payload.error);
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
        Flows
      </CHeading>
      <TableContainer>
        <Table maxW={"100%"}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Knoten</Th>
              <Th>Kanten</Th>
            </Tr>
          </Thead>
          <Tbody>
            {projects.map((project) => {
              const s = JSON.parse(
                project.saved || '{"nodes": [], "edges": []}'
              );
              const nodes = s.nodes.length;
              const edges = s.edges.length;

              return (
                <Tr
                  key={project._id}
                  _hover={{
                    bg: "gray.600",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    router.push("/planning/" + project._id);
                  }}
                >
                  <Td>{project.name}</Td>
                  <Td>{nodes} Knoten</Td>
                  <Td>
                    {edges} {edges === 1 ? "Kante" : "Kanten"}
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
                        router.push("/planning");
                      }}
                    >
                      Neuer Flow
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
