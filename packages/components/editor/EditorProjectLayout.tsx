/**
 * packages/components/editor/EditorProjectLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.01.2023
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { Box, CircularProgress, Flex, Heading } from "@chakra-ui/react";
import EditorPagesSidebar from "./EditorPagesSidebar";
import AppShell from "../global/AppShell";
import {
  FaFileExport,
  FaHome,
  FaRegFile,
  FaRegImages,
  FaRocket,
  FaServer,
  FaUsers,
} from "react-icons/fa";
import { BiCodeBlock } from "react-icons/bi";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export default function EditorProjectLayout(props: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loggedIn, loaded, userInfo } = useLoggedIn();
  const [projectId, setProjectId] = React.useState<string | null>(null);
  const { t } = useTranslation("editor");

  React.useEffect(() => {
    if (router.query.project_id) {
      setProjectId(router.query.project_id as string);
    }
  }, [router.query.project_id]);
  return (
    <>
      {loggedIn ? (
        <>
          <AppShell
            title={t("sb.project")}
            sub_pages={[
              {
                text: t("sb.pages"),
                href: "/editor/" + projectId,
                icon: <FaRegFile />,
              },
              {
                text: t("sb.functions"),
                href: "/editor/" + projectId + "/serverless",
                icon: <FaServer />,
              },
              {
                text: t("sb.contributors"),
                href: "/editor/" + projectId + "/contributors",
                icon: <FaUsers />,
              },
              {
                text: t("sb.deployment"),
                href: "/editor/" + projectId + "/deployment",
                icon: <FaRocket />,
              },
              {
                text: t("sb.discovery"),
                href: "/editor/" + projectId + "/discovery",
                icon: <BiCodeBlock />,
              },
              {
                text: t("sb.static"),
                href: "/editor/" + projectId + "/staticassets",
                icon: <FaRegImages />,
              },
              {
                text: t("sb.export"),
                href: "/editor/" + projectId + "/export",
                icon: <FaFileExport />,
              },
              {
                text: t("sb.home"),
                href: "/editor",
                icon: <FaHome />,
              },
            ]}
          >
            {props.children}
          </AppShell>
        </>
      ) : (
        <>
          <Flex
            w={"100%"}
            h={"100vh"}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"column"}
          >
            <CircularProgress size={"80px"} isIndeterminate color="green.300" />
            <Heading size={"lg"} mt={4}>
              {t("login")}
            </Heading>
          </Flex>
        </>
      )}
    </>
  );
}
