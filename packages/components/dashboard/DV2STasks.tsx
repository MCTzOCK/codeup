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
import { useTranslation } from "next-i18next";

export default function DV2STasks() {
  const { t } = useTranslation("dashboard");

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
      setError(t("lists.loading.error") + ": " + res.payload.error);
      return;
    }

    setLists(res.payload.lists);
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
        {t("lists.title")}
      </CHeading>
      <TableContainer>
        <Table maxW={"100%"}>
          <Thead>
            <Tr>
              <Th>{t("lists.name")}</Th>
              <Th>{t("lists.created")}</Th>
              <Th>{t("lists.items")}</Th>
              <Th>{t("lists.progress")}</Th>
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
                  <Td colSpan={4}>{t("lists.no.entries")}</Td>
                  <Td>
                    <Button
                      variant={"brand"}
                      leftIcon={<FaPlus />}
                      onClick={() => {
                        router.push("/tasks");
                      }}
                    >
                      {t("new.list")}
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
