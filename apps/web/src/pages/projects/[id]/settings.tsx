/**
 * apps/web/src/pages/projects/[id]/settings.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.06.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../../types/IProject";
import { IWikiPage } from "../../../types/IWikiPage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/dist/editorv2/EditorProjectLayout";
import {
  Box,
  Button,
  chakra,
  Flex,
  Grid,
  HStack,
  Text,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Table,
} from "@chakra-ui/react";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import {
  FaClock,
  FaExternalLinkAlt,
  FaEye,
  FaPen,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function Settings() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("projects");

  const [project, setProject] = React.useState<IProject | null>(null);
  const [currentDeployment, setCurrentDeployment] = React.useState<{
    state: string;
    createdAt: number;
  } | null>(null);
  const [currentBuild, setCurrentBuild] = React.useState<{
    status: number;
    name: string;
    id: string;
    startedAt?: string;
    endedAt?: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then(async (res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reload();
      } else {
        PopupManager.alertAsync({
          title: t("base:control.error"),
          description: t("project.loading.error") + ": " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const reload = async () => {
    const res = await REST.Projects.Deployment.getCurrentDeployment(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (res.status === 200) {
      setCurrentDeployment({
        state: res.payload.state,
        createdAt: res.payload.createdAt,
      });
    }
  };

  React.useEffect(() => {
    if (!router.query.id) {
      return;
    }
    const i = setInterval(async () => {
      const res = await REST.Projects.Deployment.getBuildJobs({
        token: AccountManager.getActiveToken(),
        id: router.query.id as string,
        latest: true,
      });

      if (res.status === 200) {
        setCurrentBuild(res.payload.job);
        if (res.payload.job && res.payload.job.status === 3) {
          reload();
        }
      }
    }, 1500);

    return () => {
      clearInterval(i);
    };
  }, [router.query.id]);

  return (
    <>
      <Head>
        <title>{t("settings.doc.title")}</title>
      </Head>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={4}>
          <Flex justifyContent={"center"}>
            <Box textAlign={"center"} maxW={"500px"}>
              <CHeading size={"lg"}>{t("settings.title")}</CHeading>
              <Text textAlign={"center"}>{t("settings.text")}</Text>
            </Box>
          </Flex>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
            gap={4}
            mt={4}
          >
            <Box rounded={"md"} bg={"gray.900"} p={2}>
              <CHeading size={"md"}>{t("settings.current.status")}</CHeading>
              {currentDeployment ? (
                <>
                  <Text>
                    {t("settings.current.deployment")}:{" "}
                    {currentDeployment.state === "running" ? (
                      <HStack color={"green.600"} alignItems={"center"}>
                        <FaEye />
                        <Text>{t("settings.current.state.online")}</Text>
                      </HStack>
                    ) : (
                      <HStack color={"red.500"} alignItems={"center"}>
                        <FaTimesCircle />
                        <Text>{t("settings.current.state.offline")}</Text>
                      </HStack>
                    )}
                  </Text>
                  {currentDeployment.state === "running" && (
                    <>
                      <Button
                        variant={"brand"}
                        mt={2}
                        leftIcon={<FaExternalLinkAlt />}
                        onClick={() => {
                          window.open(
                            `https://${(project as IProject)._id}.codeup.space`,
                            "_blank"
                          );
                        }}
                      >
                        {t("open")}
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Text>{t("settings.current.no.deployment")}</Text>
                </>
              )}
            </Box>
            <Box rounded={"md"} bg={"gray.900"} p={2}>
              <CHeading size={"md"}>{t("settings.new.deployment")}</CHeading>
              <Text>{t("settings.new.text")}</Text>
              <Button
                variant={"brand"}
                mt={4}
                leftIcon={<FaPlus />}
                onClick={async () => {
                  const res = await REST.Projects.Deployment.startBuildJob(
                    AccountManager.getActiveToken(),
                    router.query.id as string
                  );

                  if (res.status !== 200) {
                    PopupManager.alertAsync({
                      title: t("base:control.error"),
                      description:
                        t("settings.new.deployment.error") +
                        ": " +
                        res.payload.error,
                    });
                  } else {
                    PopupManager.alertAsync({
                      title: t("success"),
                      description: t("settings.new.deployment.update"),
                    });
                  }
                }}
              >
                {t("settings.new.deployment")}
              </Button>
              <Box mt={2}>
                {currentBuild && (
                  <>
                    <CHeading size={"sm"}>
                      {t("settings.current.build")}
                    </CHeading>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>{t("name")}</Th>
                          <Th>{t("id")}</Th>
                          <Th>{t("time.start")}</Th>
                          <Th>{t("time.end")}</Th>
                          <Th>{t("status")}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>{currentBuild.name}</Td>
                          <Td>{currentBuild.id}</Td>
                          <Td>
                            {currentBuild.startedAt &&
                              new Date(
                                currentBuild.startedAt as string
                              ).toLocaleString()}
                          </Td>
                          <Td>
                            {currentBuild.endedAt &&
                              new Date(currentBuild.endedAt).toLocaleString()}
                          </Td>
                          <Td>
                            <Text>
                              {currentBuild.status === 0
                                ? t("settings.build.state.0")
                                : currentBuild.status === 1
                                ? t("settings.build.state.1")
                                : currentBuild.status === 2
                                ? t("settings.build.state.2")
                                : currentBuild.status === 3
                                ? t("settings.build.state.3")
                                : currentBuild.status === 4
                                ? t("settings.build.state.4")
                                : t("settings.build.state.unknown")}
                            </Text>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
        </Box>
      </EditorProjectLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["projects"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
