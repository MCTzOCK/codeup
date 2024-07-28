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
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { translateOnlineV3 } from "../../global/i18n/onlineTranslateV3";

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

    if (router.locale === "de") {
      setChallenges(r0.payload.challenges);
    } else {
      const c0: any[] = [];
      for await (const c of r0.payload.challenges) {
        c0.push({
          ...c,
          title: await translateOnlineV3({
            text: c.title,
            from: "de",
            to: router.locale as string,
          }),
          task: await translateOnlineV3({
            text: c.task,
            from: "de",
            to: router.locale as string,
          }),
        });
      }
      setChallenges(c0);
    }

    const r1 = await REST.Challenges.getCompletedChallenges(
      AccountManager.getActiveToken()
    );

    if (r1.status !== 200) {
      return;
    }

    setCompleted(r1.payload.data.challenges);
  };

  const router = useRouter();

  const [showCompleted, setShowCompleted] = React.useState<boolean>(false);

  const { t } = useTranslation("challenges");

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <Box w={"100%"} h={"fit-content"} minH={"100vh"} bg={"#000"} p={4}>
        <Box textAlign={"center"}>
          <CHeading size={"xl"}>{t("page.title")}</CHeading>
          <Button
            mt={3}
            variant={"brand"}
            onClick={() => {
              setShowCompleted(!showCompleted);
            }}
          >
            {showCompleted ? t("hide.done") : t("show.done")}
          </Button>
        </Box>
        <Box p={4}>
          <TableContainer>
            <Table variant={"simple"}>
              <Thead>
                <Th>{t("done")}</Th>
                <Th>{t("title")}</Th>
                <Th>{t("difficulty")}</Th>
                <Th>{t("task")}</Th>
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
                              ? t("diff.easy")
                              : c.difficulty === 2
                              ? t("diff.medium")
                              : t("diff.hard")}
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["challenges"])),
  };
}
