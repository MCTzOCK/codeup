/**
 * apps/web/src/global/mantine-components/AdminLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.2024
 *
 */

import * as React from "react";
import {
  AppShell,
  Burger,
  Button,
  Flex,
  Image,
  NavLink,
  Stack,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "next-i18next";
import {
  FaChartArea,
  FaChartGantt,
  FaFileLines,
  FaMessage,
  FaUpRightAndDownLeftFromCenter,
} from "react-icons/fa6";
import { useRouter } from "next/router";
import { FaLink, FaRocket, FaUsers } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { BiError } from "react-icons/bi";

export default function AdminLayout(props: { children: React.ReactNode }) {
  const { t } = useTranslation("admin-v2");
  useUserLoggedInRedirect({
    allowAnonymous: false,
    onlyAdmin: true,
  });

  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();

  return (
    <>
      <AppShell
        header={{ height: 80 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        style={{
          backgroundColor: "var(--mantine-color-dark-9)",
        }}
      >
        <AppShell.Header>
          <Flex align={"center"} gap={"sm"} p={"xs"} justify={"space-between"}>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom={"sm"}
              size={"sm"}
            />
            <Flex align={"center"} gap={"sm"} p={"xs"}>
              <Image
                src={"/codeup.png"}
                w={"48"}
                display={{
                  base: "none",
                  md: "initial",
                }}
              />
              <Title order={2}>Admin</Title>
            </Flex>
            <Button
              color={"red"}
              onClick={() => {
                router.push("/");
              }}
              leftSection={<TbLogout />}
            >
              Exit
            </Button>
          </Flex>
        </AppShell.Header>
        <AppShell.Navbar p={"md"}>
          <Stack>
            {(
              [
                {
                  href: "/admin-v2",
                  label: "Dashboard",
                  icon: <FaRocket />,
                },
                {
                  href: "/admin-v2/analytics",
                  label: "Analytics",
                  icon: <FaChartArea />,
                },
                {
                  href: "/admin-v2/users",
                  label: "Users",
                  icon: <FaUsers />,
                },
                {
                  href: "/admin-v2/errors",
                  label: "Errors",
                  icon: <BiError />,
                },
                {
                  href: "/admin-v2/contacts",
                  label: "Messages",
                  icon: <FaMessage />,
                },
                {
                  href: "/admin-v2/blog",
                  label: "Blog",
                  icon: <FaFileLines />,
                },
                {
                  href: "/admin-v2/shorts",
                  label: "Shorts",
                  icon: <FaLink />,
                },
              ] as {
                href: string;
                label: string;
                icon: any;
              }[]
            ).map((item) => (
              <NavLink
                href={item.href}
                label={item.label}
                leftSection={item.icon}
                active={router.pathname === item.href}
                style={{
                  borderRadius: "var(--mantine-radius-md)",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                }}
              />
            ))}
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main>{props.children}</AppShell.Main>
      </AppShell>
    </>
  );
}
