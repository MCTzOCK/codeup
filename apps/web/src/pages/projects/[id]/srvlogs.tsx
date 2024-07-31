/**
 * apps/web/src/pages/projects/[id]/srvlogs.tsx
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
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/dist/editorv2/EditorProjectLayout";
import { Box, Flex, Text } from "@chakra-ui/react";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function Srvlogs() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("projects");

  const [project, setProject] = React.useState<IProject | null>(null);
  const [logs, setLogs] = React.useState<string>("");

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
      router.query.id as string,
      true
    );

    if (res.status === 200) {
      setLogs(res.payload.logs);
    } else {
      await PopupManager.alertAsync({
        title: t("base:copntrol.error"),
        description: t("logs.error.loading") + ": " + res.payload.error,
      });
    }
  };

  return (
    <>
      <Head>
        <title>{t("logs.doc.title")}</title>
      </Head>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={4}>
          <Flex justifyContent={"center"}>
            <Box textAlign={"center"} maxW={"500px"}>
              <CHeading size={"lg"}>{t("logs.title")}</CHeading>
              <Text textAlign={"center"}>{t("logs.text")}</Text>
            </Box>
          </Flex>
          <Box p={4} rounded={"md"} bg={"gray.900"} mt={4}>
            <pre>{logs.length === 0 ? t("logs.no.loading") : logs}</pre>
          </Box>
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
