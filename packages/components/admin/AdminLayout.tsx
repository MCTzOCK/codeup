/**
 * packages/components/admin/AdminLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.22
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Grid,
  Heading,
  IconButton,
  Progress,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import {
  FaBookOpen,
  FaCertificate,
  FaChartBar,
  FaCheckSquare,
  FaChevronLeft,
  FaChevronRight,
  FaChild,
  FaCode,
  FaComment,
  FaComments,
  FaFileCode,
  FaLightbulb,
  FaLink,
  FaNewspaper,
  FaPeopleArrows,
  FaPeopleCarry,
  FaProjectDiagram,
  FaRocket,
  FaSitemap,
  FaTrophy,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import AuthenticateLoadingIndicator from "./AuthenticateLoadingIndicator";
import ErrorComponent from "../global/ErrorComponent";
import { SiWritedotas } from "react-icons/si";
import Sidebar from "../global/Sidebar";
import { AiFillDashboard } from "react-icons/ai";
import { BsPeople, BsCheck2Square } from "react-icons/bs";
import { BiCodeBlock, BiError } from "react-icons/bi";
import AppShell from "../global/AppShell";

export default function AdminLayout(props: { children: ReactNode }) {
  const { loggedIn, userInfo, loaded: userLoaded } = useLoggedIn();

  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!userLoaded) return;

    if (!loggedIn) {
      setError("Du bist nicht dazu berechtigt diese Seite zu sehen!");
      return;
    }

    if (userInfo?.role !== "admin") {
      setError("Du bist nicht dazu berechtigt diese Seite zu sehen!");
    }
  }, [loggedIn, userInfo, userLoaded]);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (localStorage) {
      if (
        localStorage.getItem("admin.dashboard.sidebar.collapsed") === "true"
      ) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    }
  }, []);

  return (
    <>
      {error !== "" ? (
        <>
          <ErrorComponent
            description={error}
            title={"Authentifizierungsfehler"}
          />
        </>
      ) : null}
      {!userLoaded && error === "" ? (
        <>
          <AuthenticateLoadingIndicator />
        </>
      ) : null}
      {userLoaded && error === "" ? (
        <>
          <AppShell
            title={"Admin"}
            sub_pages={[
              {
                text: "Dashboard",
                icon: <AiFillDashboard />,
                href: "/admin",
              },
              {
                text: "Benutzer",
                icon: <FaUser />,
                href: "/admin/users",
              },
              {
                text: "Profile",
                icon: <FaUsers />,
                href: "/admin/profiles",
              },
              {
                text: "Analytics",
                icon: <FaChartBar />,
                href: "/admin/analytics",
              },
              {
                text: "Nachrichten",
                icon: <FaComment />,
                href: "/admin/contacts",
              },
              {
                text: "Zertifikate",
                icon: <FaCertificate />,
                href: "/admin/certificates",
              },
              {
                text: "Projekt Ideen",
                icon: <FaLightbulb />,
                href: "/admin/project-ideas",
              },
              {
                text: "Blog",
                icon: <SiWritedotas />,
                href: "/admin/blog",
              },
              {
                text: "Meinungen",
                icon: <BsPeople />,
                href: "/admin/testimonials",
              },
              {
                text: "Organisationen",
                icon: <FaSitemap />,
                href: "/admin/orgs",
              },
              {
                text: "Newsletter",
                icon: <FaNewspaper />,
                href: "/admin/newsletter",
              },
              {
                text: "Discovery",
                icon: <BiCodeBlock />,
                href: "/admin/discovery",
              },
              {
                text: "Flows",
                icon: <FaProjectDiagram />,
                href: "/admin/flows",
              },
              {
                text: "Kids",
                icon: <FaChild />,
                href: "/admin/kids",
              },
              {
                text: "Roadmaps",
                icon: <FaRocket />,
                href: "/admin/roads",
              },
              {
                text: "ToDo",
                icon: <BsCheck2Square />,
                href: "/admin/todos",
              },
              {
                text: "Code Snippets",
                icon: <FaFileCode />,
                href: "/admin/snippets",
              },
              {
                text: "Shorts",
                icon: <FaLink />,
                href: "/admin/shorts",
              },
              {
                text: "IDE",
                icon: <FaCode />,
                href: "/admin/ide",
              },
              {
                text: "Editor",
                icon: <FaCode />,
                href: "/admin/editor",
              },
              {
                text: "Fehler",
                icon: <BiError />,
                href: "/admin/errors",
              },
              {
                text: "Challenges",
                icon: <FaTrophy />,
                href: "/admin/challenges",
              },
            ]}
          >
            {props.children}
          </AppShell>
        </>
      ) : null}
    </>
  );
}
