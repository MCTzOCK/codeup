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
import { ReactNode } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  FaChartArea,
  FaCogs,
  FaDatabase,
  FaExternalLinkSquareAlt,
  FaFileExport,
  FaHome,
  FaRegFile,
  FaRegImages,
  FaRocket,
  FaSearch,
  FaServer,
  FaUsers,
} from "react-icons/fa";

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
    available: boolean;
  }[] = [
    {
      title: "Seiten",
      link: "/editor/" + projectId,
      icon: <FaRegFile />,
      available: true,
    },
    {
      title: "Serverless",
      link: "/editor/" + projectId + "/serverless",
      icon: <FaServer />,
      available: false,
    },
    {
      title: "Mitwirkende",
      link: "/editor/" + projectId + "/contributors",
      icon: <FaUsers />,
      available: true,
    },
    {
      title: "Deployment",
      link: "/editor/" + projectId + "/deployment",
      icon: <FaRocket />,
      available: true,
    },
    {
      title: "Statische Dateien",
      link: "/editor/" + projectId + "/staticassets",
      icon: <FaRegImages />,
      available: false,
    },
    {
      title: "Datenbanken",
      link: "/editor/" + projectId + "/databases",
      icon: <FaDatabase />,
      available: false,
    },
    {
      title: "Export",
      link: "/editor/" + projectId + "/export",
      icon: <FaFileExport />,
      available: false,
    },

    {
      title: "Analytics",
      link: "/editor/" + projectId + "/analytics",
      icon: <FaChartArea />,
      available: false,
    },
    {
      title: "Vorschau",
      link: "/editor/" + projectId + "/preview",
      icon: <FaExternalLinkSquareAlt />,
      available: false,
    },
    {
      title: "Einstellungen",
      link: "/editor/" + projectId + "/settings",
      icon: <FaCogs />,
      available: false,
    },
    {
      title: "Home",
      link: "/editor",
      icon: <FaHome />,
      available: true,
    },
  ];

  const [query, setQuery] = React.useState<string>("");

  return (
    <>
      <Flex
        w={"100%"}
        h={"100%"}
        minH={"100vh"}
        bgColor={"black"}
        direction={"column"}
        pt={"2rem"}
        alignItems={"center"}
      >
        <InputGroup w={"90%"} mb={4}>
          <InputLeftElement>
            <FaSearch />
          </InputLeftElement>
          <Input
            placeholder={"Seite suchen..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
        {subPages
          .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
          .map((page, i) => {
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
                  disabled={!page.available}
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
