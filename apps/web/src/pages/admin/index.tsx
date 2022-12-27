/**
 * apps/web/src/pages/admin/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.10.22
 *
 */
import { useLoggedIn } from "@codeup/hooks";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Badge,
  CircularProgress,
  Flex,
  Grid,
  Heading,
  Icon,
  Progress,
  Spinner,
} from "@chakra-ui/react";
import {
  FaBookOpen,
  FaCertificate,
  FaChartBar,
  FaComment,
  FaComments,
  FaProjectDiagram,
  FaUser,
} from "react-icons/fa";
import AuthenticateLoadingIndicator from "@codeup/components/admin/AuthenticateLoadingIndicator";
import ErrorComponent from "@codeup/components/global/ErrorComponent";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import REST from "@codeup/rest";
import Head from "next/head";
import { SiWritedotas } from "react-icons/si";

export default function AdminDashboard() {
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

  const [contactCount, setContactCount] = React.useState(0);

  React.useEffect(() => {
    REST.Admin.getContactMessageCount(
      localStorage.getItem("token") as string
    ).then((res) => {
      if (res.status === 200) {
        setContactCount(res.payload.count);
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>Admin - CodeUp</title>
      </Head>
      <AdminLayout>
        <>
          <Flex
            w={"100%"}
            minH={"100vh"}
            h={"fit-content"}
            direction={"column"}
          >
            <Heading textAlign={"center"} size={"2xl"} mt={4}>
              Administrationsbereich
            </Heading>
            <Grid
              templateColumns={[
                "repeat(1, 1fr)",
                "repeat(1, 1fr)",
                "repeat(1, 1fr)",
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
              ]}
              gap={6}
              mt={4}
              p={"2rem"}
            >
              {sections.map((section) => (
                <Flex
                  key={section.title}
                  w={"100%"}
                  h={"100%"}
                  direction={"row"}
                  gap={"6rem"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  p={4}
                  border={"1px solid"}
                  borderColor={"gray.200"}
                  bgColor={"gray.900"}
                  borderRadius={"md"}
                  cursor={"pointer"}
                  onClick={() => router.push(section.link)}
                  _hover={{
                    boxShadow: "2xl",
                  }}
                >
                  <Flex alignItems={"center"}>
                    <Heading size={"4xl"}>{section.icon}</Heading>
                  </Flex>
                  <Flex direction={"column"} alignItems={"left"}>
                    <Heading size={"xl"} textAlign={"left"}>
                      {section.title}
                      {section.withBadge && (
                        <Badge color={"red"} ml={2} fontSize={"2xl"}>
                          {contactCount < 9 ? contactCount : "9+"}
                        </Badge>
                      )}
                    </Heading>
                    <Heading size={"sm"} mt={4} textAlign={"left"}>
                      {section.description}
                    </Heading>
                  </Flex>
                </Flex>
              ))}
            </Grid>
          </Flex>
        </>
      </AdminLayout>
    </>
  );
}
