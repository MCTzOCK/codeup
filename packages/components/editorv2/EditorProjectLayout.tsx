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
import { FaCogs, FaFile, FaHome } from "react-icons/fa";
import { GoProject } from "react-icons/go";
import { VscIssues } from "react-icons/vsc";
import {
  FaCodeBranch,
  FaDiagramNext,
  FaDiagramSuccessor,
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
            href: "/projects/" + props.project_id + "/issues",
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
        ]}
      >
        {props.children}
      </AppShell>
    </>
  );
}
