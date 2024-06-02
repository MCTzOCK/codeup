/**
 * packages/components/editorv2/EditorProjectLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.05.2024
 *
 */

import * as React from "react";
import { IProject } from "@codeup/web/src/types/IProject";
import AppShell from "../global/AppShell";
import { useEffect } from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import {
  FaBookOpen,
  FaChartLine,
  FaCode,
  FaCogs,
  FaDatabase,
  FaFile,
  FaHome,
} from "react-icons/fa";
import { GoProject } from "react-icons/go";
import { VscIssues } from "react-icons/vsc";
import {
  FaChartSimple,
  FaCodeBranch,
  FaDiagramNext,
  FaDiagramSuccessor,
  FaFileLines,
  FaLanguage,
  FaRotate,
} from "react-icons/fa6";

export default function EditorProjectLayout(props: {
  children: React.ReactNode;
  project_id: string;
}) {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  return (
    <>
      <AppShell
        title={"Projekt"}
        sub_pages={[
          {
            text: "Home",
            icon: <FaHome />,
            href: "/projects/" + props.project_id,
          },
          {
            text: "Probleme",
            icon: <VscIssues />,
            href: "/projects/" + props.project_id + "/issues",
          },
          {
            text: "Planungsübersicht",
            icon: <GoProject />,
            href: "/projects/" + props.project_id + "/planning/overview",
          },
          {
            text: "Flussdiagramme",
            icon: <FaDiagramSuccessor />,
            href: "/projects/" + props.project_id + "/flows",
          },
          {
            text: "Versionsverwaltung",
            icon: <FaCodeBranch />,
            href: "/projects/" + props.project_id + "/vsc",
          },
          {
            text: "Einstellungen",
            icon: <FaCogs />,
            href: "/projects/" + props.project_id + "/settings",
          },
          {
            text: "Statische Ressourcen",
            icon: <FaFile />,
            href: "/projects/" + props.project_id + "/static",
          },
          {
            text: "Wiki",
            icon: <FaBookOpen />,
            href: "/projects/" + props.project_id + "/wiki",
          },
          {
            text: "Datenbanken",
            icon: <FaDatabase />,
            href: "/projects/" + props.project_id + "/dbs",
          },
          {
            text: "Statistiken",
            icon: <FaChartLine />,
            href: "/projects/" + props.project_id + "/stats",
          },
          {
            text: "Server-Logs",
            icon: <FaFileLines />,
            href: "/projects/" + props.project_id + "/srvlogs",
          },
          {
            text: "Profi-Editor",
            icon: <FaCode />,
            href: "/projects/" + props.project_id + "/editor/professional",
          },
          {
            text: "Einfacher Editor",
            icon: <FaCode />,
            href: "/projects/" + props.project_id + "/editor/simple",
          },
          {
            text: "UDM-Diagramme",
            icon: <FaChartSimple />,
            href: "/projects/" + props.project_id + "/udm",
          },
          {
            text: "Lokalisierung",
            icon: <FaLanguage />,
            href: "/projects/" + props.project_id + "/professional/editor",
          },
          {
            text: "CI/CD",
            icon: <FaRotate />,
            href: "/projects/" + props.project_id + "/ci-cd",
          },
        ]}
      >
        {props.children}
      </AppShell>
    </>
  );
}
