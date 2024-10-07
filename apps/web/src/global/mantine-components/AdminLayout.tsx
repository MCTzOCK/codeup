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
          <NavLink
            href={"/mantine/admin-v2"}
            label={"Dashboard"}
            leftSection={<FaChartGantt />}
            active={router.pathname === "/mantine/admin-v2"}
          />
          <NavLink
            href={"/mantine/admin-v2/users"}
            label={"Users"}
            leftSection={<FaUsers />}
            active={router.pathname === "/mantine/admin-v2/users"}
          />
        </AppShell.Navbar>
        <AppShell.Main>{props.children}</AppShell.Main>
      </AppShell>
    </>
  );
}
