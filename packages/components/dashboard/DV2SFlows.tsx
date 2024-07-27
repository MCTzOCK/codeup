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
import { useTranslation } from "next-i18next";

export default function DV2SFlows() {
  const { t } = useTranslation("dashboard");
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
      setError(t("flows.loading.error") + ": " + res.payload.error);
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
        {t("flows.title")}
      </CHeading>
      <TableContainer>
        <Table maxW={"100%"}>
          <Thead>
            <Tr>
              <Th>{t("flows.name")}</Th>
              <Th>{t("flows.nodes")}</Th>
              <Th>{t("flows.edges")}</Th>
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
                  <Td>
                    {nodes} {t("flows.nodes")}
                  </Td>
                  <Td>
                    {edges} {edges === 1 ? t("flows.edge") : t("flows.edges")}
                  </Td>
                </Tr>
              );
            })}
            {projects.length === 0 && (
              <>
                <Tr>
                  <Td>{t("flows.no.entries")}</Td>
                  <Td>
                    <Button
                      variant={"brand"}
                      leftIcon={<FaPlus />}
                      onClick={() => {
                        router.push("/planning");
                      }}
                    >
                      {t("flows.new")}
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
