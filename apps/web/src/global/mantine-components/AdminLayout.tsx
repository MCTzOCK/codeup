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
import { useEffect } from "react";
import {
  AppShell,
  Burger,
  Title,
  Flex,
  Image,
  Menu,
  NavLink,
  Button,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "next-i18next";
import { FaChartGantt } from "react-icons/fa6";
import { useRouter } from "next/router";
import { FaUsers } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { useUserLoggedInRedirect } from "@codeup/hooks";

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
      >
        <AppShell.Header>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom={"sm"}
            size={"sm"}
          />
          <Flex align={"center"} gap={"sm"} p={"xs"} justify={"space-between"}>
            <Flex align={"center"} gap={"sm"} p={"xs"}>
              <Image src={"/codeup.png"} w={"48"} />
              <Title order={2}>CodeUp Admin</Title>
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
                  href: "/mantine/admin-v2",
                  label: "Dashboard",
                  icon: <FaChartGantt />,
                },
                {
                  href: "/mantine/admin-v2/users",
                  label: "Users",
                  icon: <FaUsers />,
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
