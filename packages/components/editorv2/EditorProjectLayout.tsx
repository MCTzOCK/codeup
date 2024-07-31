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
import { useTranslation } from "next-i18next";

export default function EditorProjectLayout(props: {
  children: React.ReactNode;
  project_id: string;
}) {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("projects");

  return (
    <>
      <AppShell
        title={t("i.project")}
        sub_pages={[
          {
            text: t("i.home"),
            icon: <FaHome />,
            href: "/projects/" + props.project_id,
          },
          {
            text: t("i.issues"),
            icon: <VscIssues />,
            href: "/projects/" + props.project_id + "/issues",
          },
          {
            text: t("i.planning"),
            icon: <GoProject />,
            href: "/projects/" + props.project_id + "/planning/overview",
          },
          {
            text: t("i.flows"),
            icon: <FaDiagramSuccessor />,
            href: "/projects/" + props.project_id + "/flows",
          },
          {
            text: t("i.vsc"),
            icon: <FaCodeBranch />,
            href: "/projects/" + props.project_id + "/vsc",
          },
          {
            text: t("i.settings"),
            icon: <FaCogs />,
            href: "/projects/" + props.project_id + "/settings",
          },
          {
            text: t("i.static"),
            icon: <FaFile />,
            href: "/projects/" + props.project_id + "/static",
          },
          {
            text: t("i.wiki"),
            icon: <FaBookOpen />,
            href: "/projects/" + props.project_id + "/wiki",
          },
          {
            text: t("i.dbs"),
            icon: <FaDatabase />,
            href: "/projects/" + props.project_id + "/dbs",
          },
          {
            text: t("i.srv"),
            icon: <FaFileLines />,
            href: "/projects/" + props.project_id + "/srvlogs",
          },
          {
            text: t("i.editor"),
            icon: <FaCode />,
            href: "/projects/" + props.project_id + "/editor/professional",
          } /*
          {
            text: "Einfacher Editor",
            icon: <FaCode />,
            href: "/projects/" + props.project_id + "/editor/simple",
          },*/,
          {
            text: t("i.uml"),
            icon: <FaChartSimple />,
            href: "/projects/" + props.project_id + "/uml",
          },
          {
            text: t("i.i18n"),
            icon: <FaLanguage />,
            href: "/projects/" + props.project_id + "/i18n",
          } /*
          {
            text: "CI/CD",
            icon: <FaRotate />,
            href: "/projects/" + props.project_id + "/ci-cd",
          },*/,
        ]}
      >
        {props.children}
      </AppShell>
    </>
  );
}
