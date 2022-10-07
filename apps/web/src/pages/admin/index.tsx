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
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  CircularProgress,
  Flex,
  Grid,
  Heading,
  Progress,
  Spinner,
} from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import AuthenticateLoadingIndicator from "@codeup/components/admin/AuthenticateLoadingIndicator";
import ErrorComponent from "@codeup/components/global/ErrorComponent";
import AdminLayout from "@codeup/components/admin/AdminLayout";

export default function AdminDashboard() {
  const router = useRouter();

  const sections: {
    title: string;
    description: string;
    link: string;
    icon: ReactNode;
  }[] = [
    {
      title: "Benutzer",
      description: "Verwalte alle Benutzer",
      link: "/admin/users",
      icon: <FaUser />,
    },
  ];

  return (
    <>
      <AdminLayout>
        <>
          <Flex w={"100%"} h={"100vh"} direction={"column"}>
            <Heading textAlign={"center"} size={"lg"} mt={4}>
              Administrationsbereich
            </Heading>
            <Grid templateColumns={"repeat(3, 1fr)"} gap={6} mt={4} p={"2rem"}>
              {sections.map((section) => (
                <Flex
                  key={section.title}
                  w={"100%"}
                  h={"100%"}
                  direction={"column"}
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
                  <Flex justifyContent={"center"} alignItems={"center"}>
                    {section.icon}
                  </Flex>
                  <Heading size={"md"} mt={4} textAlign={"center"}>
                    {section.title}
                  </Heading>
                  <Heading size={"sm"} mt={4} textAlign={"center"}>
                    {section.description}
                  </Heading>
                </Flex>
              ))}
            </Grid>
          </Flex>
        </>
      </AdminLayout>
    </>
  );
}
