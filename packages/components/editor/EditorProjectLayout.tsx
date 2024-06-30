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

export default function EditorProjectLayout(props: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loggedIn, loaded, userInfo } = useLoggedIn();
  const [projectId, setProjectId] = React.useState<string | null>(null);

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
            title={"Projekt"}
            sub_pages={[
              {
                text: "Seiten",
                href: "/editor/" + projectId,
                icon: <FaRegFile />,
              },
              {
                text: "Serverless",
                href: "/editor/" + projectId + "/serverless",
                icon: <FaServer />,
              },
              {
                text: "Mitwirkende",
                href: "/editor/" + projectId + "/contributors",
                icon: <FaUsers />,
              },
              {
                text: "Deployment",
                href: "/editor/" + projectId + "/deployment",
                icon: <FaRocket />,
              },
              {
                text: "Discovery",
                href: "/editor/" + projectId + "/discovery",
                icon: <BiCodeBlock />,
              },
              {
                text: "Statische Dateien",
                href: "/editor/" + projectId + "/staticassets",
                icon: <FaRegImages />,
              },
              {
                text: "Export",
                href: "/editor/" + projectId + "/export",
                icon: <FaFileExport />,
              },
              {
                text: "Home",
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
              Anmelden ...
            </Heading>
          </Flex>
        </>
      )}
    </>
  );
}
