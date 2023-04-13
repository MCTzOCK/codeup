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
  FaChevronLeft,
  FaChevronRight,
  FaComment,
  FaComments,
  FaPeopleArrows,
  FaPeopleCarry,
  FaProjectDiagram,
  FaSitemap,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import AuthenticateLoadingIndicator from "./AuthenticateLoadingIndicator";
import ErrorComponent from "../global/ErrorComponent";
import { SiWritedotas } from "react-icons/si";
import Sidebar from "../global/Sidebar";
import { AiFillDashboard } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";

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
          <Flex
            w={"100%"}
            direction={["column", "column", "row"]}
            minH={"100vh"}
            h={"fit-content"}
          >
            <Box flex={"10%"}>
              <Sidebar
                entries={[
                  {
                    title: "Dashboard",
                    icon: <AiFillDashboard />,
                    onClick: () => {
                      router.push("/admin");
                    },
                  },
                  {
                    title: "Benutzer",
                    icon: <FaUser />,
                    onClick: () => {
                      router.push("/admin/users");
                    },
                  },
                  {
                    title: "Profile",
                    icon: <FaUsers />,
                    onClick: () => {
                      router.push("/admin/profiles");
                    },
                  },
                  {
                    title: "Inhalte",
                    icon: <FaBookOpen />,
                    onClick: () => {
                      router.push("/admin/contents/courses");
                    },
                  },
                  {
                    title: "Analytics",
                    icon: <FaChartBar />,
                    onClick: () => {
                      router.push("/admin/analytics");
                    },
                  },
                  {
                    title: "Nachrichten",
                    icon: <FaComment />,
                    onClick: () => {
                      router.push("/admin/contacts");
                    },
                  },
                  {
                    title: "Zertifikate",
                    icon: <FaCertificate />,
                    onClick: () => {
                      router.push("/admin/certificates");
                    },
                  },
                  {
                    title: "Projekt Ideen",
                    icon: <FaProjectDiagram />,
                    onClick: () => {
                      router.push("/admin/project-ideas");
                    },
                  },
                  {
                    title: "Blog",
                    icon: <SiWritedotas />,
                    onClick: () => {
                      router.push("/admin/blog");
                    },
                  },
                  {
                    title: "Meinungen",
                    icon: <BsPeople />,
                    onClick: () => {
                      router.push("/admin/testimonials");
                    },
                  },
                  {
                    title: "Organisationen",
                    icon: <FaSitemap />,
                    onClick: () => {
                      router.push("/admin/orgs");
                    },
                  },
                ]}
                title={"Admin"}
              />
            </Box>
            <Box flex={"90%"}>{props.children}</Box>
          </Flex>
        </>
      ) : null}
    </>
  );
}
