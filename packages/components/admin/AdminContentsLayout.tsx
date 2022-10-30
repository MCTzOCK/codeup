/**
 * packages/components/admin/AdminContentsLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.10.2022
 *
 */

import * as React from "react";
import { ReactNode } from "react";

import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Icon,
  Input,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  FaBookOpen,
  FaCartPlus,
  FaFileArchive,
  FaFileVideo,
  FaFolderPlus,
  FaPlus,
  FaSearchPlus,
  FaUserCircle,
  FaVideo,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { BsFillHouseDoorFill } from "react-icons/bs";

export default function AdminContentsLayout(props: { children: ReactNode }) {
  const router = useRouter();

  const sections: { name: string; url: string; icon: ReactNode }[] = [
    {
      name: "Alle Kurse",
      url: "/admin/contents/courses",
      icon: <FaBookOpen />,
    },
    {
      name: "Alle Videos",
      url: "/admin/contents/videos",
      icon: <FaVideo />,
    },
    {
      name: "Neuer Kurs",
      url: "/admin/contents/courses/new",
      icon: <FaFileArchive />,
    },
    {
      name: "Neues Video",
      url: "/admin/contents/videos/new",
      icon: <FaFileVideo />,
    },
  ];

  return (
    <>
      <Flex direction={["column", "row"]} minW={"100%"} minH={"100vh"}>
        <Flex
          direction={"column"}
          flex={"15%"}
          minH={"100%"}
          bgColor={useColorModeValue("gray.400", "gray.900")}
          p={"1.2rem"}
        >
          <Heading textAlign={"center"}>Inhalte</Heading>
          <Divider mt={"1.2rem"} />
          {sections.map((s) => (
            <>
              <Button
                m={"1.2rem"}
                leftIcon={s.icon as any}
                onClick={() => router.push(s.url)}
                variant={router.pathname === s.url ? "solid" : "outline"}
              >
                {s.name}
              </Button>
            </>
          ))}
        </Flex>
        <Flex direction={"column"} flex={"85%"} minH={"100%"}>
          {props.children}
        </Flex>
      </Flex>
    </>
  );
}
