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
  FaProjectDiagram,
  FaUser,
} from "react-icons/fa";
import AuthenticateLoadingIndicator from "./AuthenticateLoadingIndicator";
import ErrorComponent from "../global/ErrorComponent";
import { SiWritedotas } from "react-icons/si";

export default function AdminLayout(props: { children: ReactNode }) {
  const { loggedIn, userInfo, loaded: userLoaded } = useLoggedIn();

  const [error, setError] = useState("");

  const router = useRouter();

  const sections: {
    title: string;
    description: string;
    link: string;
    icon: ReactNode;
    withBadge?: boolean;
  }[] = [
    {
      title: "Benutzer",
      description: "Verwalte alle Benutzer",
      link: "/admin/users",
      icon: <FaUser />,
    },
    {
      title: "Forum Profile",
      description: "Verwalte alle Profile",
      link: "/admin/profiles",
      icon: <FaComments />,
    },
    {
      title: "Inhalte",
      description: "Verwalte alle Inhalte (Kurse, Texte, Videos)",
      link: "/admin/contents/courses",
      icon: <FaBookOpen />,
    },
    {
      title: "Analytics",
      description: "Sieh dir die Aufrufstatistiken an",
      link: "/admin/analytics",
      icon: <FaChartBar />,
    },
    {
      title: "Nachrichten",
      description: "Sieh dir alle Nachrichten an",
      link: "/admin/contacts",
      icon: <FaComment />,
      withBadge: true,
    },
    {
      title: "Zertifikate",
      description: "Sieh dir alle Zertifikate der Benutzer an",
      link: "/admin/certificates",
      icon: <FaCertificate />,
    },
    {
      title: "Projekt Ideen",
      description: "Sieh dir alle Projekt Ideen an",
      link: "/admin/project-ideas",
      icon: <FaProjectDiagram />,
    },
    {
      title: "Blog",
      description: "Verwalte den Blog",
      link: "/admin/blog",
      icon: <SiWritedotas />,
    },
  ];

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
  }, [localStorage]);

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
            <Flex
              w={["100%", "100%", "20%"]}
              minH={"100%"}
              direction={"column"}
              bg={"gray.900"}
              color={"white"}
              p={4}
              maxW={collapsed ? "fit-content" : "inherit"}
            >
              <Heading size={"xl"} textAlign={"center"}>
                Admin
              </Heading>
              <Flex
                direction={"column"}
                w={"100%"}
                h={"100%"}
                mt={4}
                overflowY={"auto"}
              >
                {sections.map((section) => (
                  <>
                    {collapsed ? (
                      <>
                        <Tooltip label={section.title as string}>
                          <IconButton
                            aria-label={""}
                            icon={section.icon as any}
                            variant={"ghost"}
                            size={"lg"}
                            mt={"1.2rem"}
                            mb={"1.2rem"}
                            fontSize={"4xl"}
                            rounded={"none"}
                            p={8}
                            onClick={() => {
                              router.push(section.link);
                            }}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <Button
                        rounded={"none"}
                        colorScheme={"gray"}
                        variant={"ghost"}
                        w={"100%"}
                        justifyContent={"flex-start"}
                        size={"lg"}
                        leftIcon={section.icon as any}
                        fontSize={"2xl"}
                        onClick={() => {
                          router.push(section.link);
                        }}
                      >
                        {section.title}
                      </Button>
                    )}
                  </>
                ))}
                <Box>
                  {collapsed ? (
                    <>
                      <Tooltip label={"Ausklappen"}>
                        <IconButton
                          aria-label={""}
                          icon={<FaChevronRight />}
                          variant={"ghost"}
                          size={"lg"}
                          mt={"1.2rem"}
                          mb={"1.2rem"}
                          fontSize={"4xl"}
                          rounded={"none"}
                          p={8}
                          onClick={() => {
                            let n = !collapsed;

                            setCollapsed(n);

                            localStorage.setItem(
                              "admin.dashboard.sidebar.collapsed",
                              `${n}`
                            );
                          }}
                        />
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Button
                        rounded={"none"}
                        colorScheme={"gray"}
                        variant={"ghost"}
                        w={"100%"}
                        justifyContent={"flex-start"}
                        size={"lg"}
                        fontSize={"2xl"}
                        leftIcon={<FaChevronLeft />}
                        onClick={() => {
                          let n = !collapsed;

                          setCollapsed(n);

                          localStorage.setItem(
                            "admin.dashboard.sidebar.collapsed",
                            `${n}`
                          );
                        }}
                      >
                        Einklappen
                      </Button>
                    </>
                  )}
                </Box>
              </Flex>
            </Flex>
            <Box w={"100%"}>{props.children}</Box>
          </Flex>
        </>
      ) : null}
    </>
  );
}
