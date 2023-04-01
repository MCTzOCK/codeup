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
  FaGit,
  FaHome,
  FaRegFile,
  FaRegImages,
  FaRocket,
  FaSearch,
  FaServer,
  FaUsers,
} from "react-icons/fa";
import { BiCodeBlock } from "react-icons/bi";
import Sidebar from "../global/Sidebar";

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
      available: true,
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
      title: "Discovery",
      link: "/editor/" + projectId + "/discovery",
      icon: <BiCodeBlock />,
      available: true,
    },
    {
      title: "Statische Dateien",
      link: "/editor/" + projectId + "/staticassets",
      icon: <FaRegImages />,
      available: true,
    },
    {
      title: "Export",
      link: "/editor/" + projectId + "/export",
      icon: <FaFileExport />,
      available: true,
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
      <Sidebar
        entries={subPages.map((e) => {
          return {
            title: e.title,
            onClick: () => {
              router.push(e.link);
            },
            icon: e.icon,
            disabled: !e.available,
          };
        })}
        title={"Projekt Editor"}
      />
    </>
  );
}
