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
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Level() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("levels");

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
        <title>{t("doc.title")}</title>
      </Head>
      <Box bg={"#000"} h={"fit-content"} minH={"100vh"} p={2}>
        <CHeading size={"xl"} textAlign={"center"}>
          {t("level")}
        </CHeading>
        <Flex justifyContent={"center"} mt={4} mb={8}>
          <Box
            mt={4}
            rounded={"md"}
            bg={"black"}
            p={4}
            w={["100%", "90%", "60%"]}
          >
            <Text fontSize={"lg"}>{t("level.text")}</Text>
            <Text
              fontSize={"xl"}
              mt={4}
              fontWeight={"bold"}
              color={"brand.500"}
            >
              {t("level.current")}:{" "}
              {levelProgress ? levelProgress.level : t("level.loading")}
            </Text>
            <Flex
              gap={4}
              alignItems={"center"}
              flexDirection={["column", "column", "row"]}
              maxW={["100%", "100%", "40%"]}
            >
              <Text fontSize={"lg"}>{t("current.progress")}:</Text>
              <Progress
                value={levelProgress ? levelProgress.xp : 0}
                max={levelProgress ? levelProgress.xpNeeded : 1}
                variant={"brand"}
                rounded={"md"}
                w={"100%"}
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
              {t("last.actions")}:
            </Text>
            {levelProgress ? (
              levelProgress.transactions
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((a, i) => (
                  <Box key={i} bg={"gray.500"} p={2} rounded={"md"} mt={2}>
                    <Text>
                      <chakra.b color={"brand.500"}>{a.xp}</chakra.b> XP{" "}
                      {t("from")}{" "}
                      <chakra.b color={"brand.500"}>
                        {t(a.reason.replace(/\[(.*?)\]/g, "").trim() as any)}
                      </chakra.b>{" "}
                      {t("at")} {new Date(a.createdAt).toLocaleString()}
                    </Text>
                  </Box>
                ))
            ) : (
              <Text>{t("level.loading")}</Text>
            )}
            {levelProgress ? (
              levelProgress.transactions.length === 0 ? (
                <Text fontSize={"lg"} mt={2}>
                  {t("no.actions")}
                </Text>
              ) : null
            ) : null}
            <Text
              fontSize={"lg"}
              mt={4}
              fontWeight={"bold"}
              color={"brand.500"}
            >
              {t("possible.actions")}:
            </Text>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>{t("action")}</Th>
                    <Th>XP</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.keys(actions)
                    .sort((a, b) => (actions as any)[a] - (actions as any)[b])
                    .map((action, i) => (
                      <Tr key={(actions as any)[action as any]}>
                        <Td>#{i + 1}</Td>
                        <Td>{t(action as any)}</Td>
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
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["levels"])),
  };
}
