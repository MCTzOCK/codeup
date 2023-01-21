/**
 * packages/components/editor/EditorPagesSidebar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.01.2023
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { Button, Flex } from "@chakra-ui/react";
import {
  FaChartArea,
  FaCogs,
  FaDatabase,
  FaFile,
  FaFileExport,
  FaHome,
  FaHtml5,
  FaRegFile,
  FaRegImages,
  FaRocket,
  FaServer,
  FaUsers,
} from "react-icons/fa";
import { ReactNode } from "react";

export default function EditorPagesSidebar() {
  const router = useRouter();

  const [projectId, setProjectId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (router.query.project_id) {
      setProjectId(router.query.project_id as string);
    }
  }, [router.query.project_id]);

  const subPages: {
    title: string;
    link: string;
    icon: ReactNode;
  }[] = [
    {
      title: "Seiten",
      link: "/editor/" + projectId,
      icon: <FaRegFile />,
    },
    {
      title: "Serverless",
      link: "/editor/" + projectId + "/serverless",
      icon: <FaServer />,
    },
    {
      title: "Mitwirkende",
      link: "/editor/" + projectId + "/contributors",
      icon: <FaUsers />,
    },
    {
      title: "Deployment",
      link: "/editor/" + projectId + "/deploy",
      icon: <FaRocket />,
    },
    {
      title: "Statische Daten",
      link: "/editor/" + projectId + "/staticassets",
      icon: <FaRegImages />,
    },
    {
      title: "Datenbanken",
      link: "/editor/" + projectId + "/databases",
      icon: <FaDatabase />,
    },
    {
      title: "Export",
      link: "/editor/" + projectId + "/export",
      icon: <FaFileExport />,
    },

    {
      title: "Analytics",
      link: "/editor/" + projectId + "/analytics",
      icon: <FaChartArea />,
    },
    {
      title: "Einstellungen",
      link: "/editor/" + projectId + "/settings",
      icon: <FaCogs />,
    },
    {
      title: "Home",
      link: "/editor",
      icon: <FaHome />,
    },
  ];

  return (
    <>
      <Flex
        w={"100%"}
        h={"100%"}
        minH={"100vh"}
        bgColor={"black"}
        direction={"column"}
        pt={"2rem"}
      >
        {subPages.map((page, i) => {
          return (
            <>
              <Button
                rounded={"none"}
                colorScheme={"gray"}
                variant={"ghost"}
                w={"100%"}
                justifyContent={"flex-start"}
                size={"lg"}
                leftIcon={page.icon as any}
                fontSize={"2xl"}
                onClick={() => {
                  router.push(page.link);
                }}
              >
                {page.title}
              </Button>
            </>
          );
        })}
      </Flex>
    </>
  );
}
