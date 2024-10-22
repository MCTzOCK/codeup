/**
 * apps/observability/src/components/AppLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.10.2024
 *
 */

import * as React from "react";
import { useLoggedIn, useUserLoggedInRedirect } from "@codeup/hooks";
import { useEffect, useState } from "react";
import {
  AppShell,
  Burger,
  Flex,
  Image,
  ScrollArea,
  SegmentedControl,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ApplicationList from "@/components/ApplicationList";
import RestClient from "@/rest/RestClient";

export default function AppLayout(props: { children: React.ReactNode }) {
  const { loaded, loggedIn, userInfo } = useLoggedIn();
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    if (!loaded) return;

    if (!loggedIn) {
      window.location.href = `https://codeup.space/account/authorize?appId=6716b5aa9fa93e4dc0283868&redirect=${
        window.location.origin + "/auth"
      }`;
    }

    RestClient.setToken(localStorage.getItem("token") as string);
  }, [loaded, loggedIn, userInfo]);

  const [segment, setSegment] = useState("apps");

  return (
    <>
      <AppShell
        header={{ height: 80 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding={"md"}
      >
        <AppShell.Header
          style={{
            backgroundColor: "#121212",
          }}
        >
          <Flex gap={"md"} align={"center"} pl={"sm"} h={"100%"}>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom={"sm"}
              size={"sm"}
            />
            <Image src={"https://codeup.space/codeup.png"} w={48} />
            <Title size={"lg"}>CodeUp Observability</Title>
          </Flex>
        </AppShell.Header>
        <AppShell.Navbar
          style={{
            backgroundColor: "#121212",
          }}
          p={"md"}
        >
          <AppShell.Section pb={"sm"}>
            <SegmentedControl
              value={segment}
              onChange={setSegment}
              w={"100%"}
              radius={"xl"}
              data={[
                {
                  label: "Applications",
                  value: "apps",
                },
                {
                  label: "Servers",
                  value: "servers",
                  disabled: true,
                },
              ]}
            />
          </AppShell.Section>
          <AppShell.Section grow component={ScrollArea}>
            {segment === "apps" ? (
              <>
                <ApplicationList />
              </>
            ) : (
              <></>
            )}
          </AppShell.Section>
          <AppShell.Section>
            &copy; CodeUp. All rights reserved.
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main
          style={{
            backgroundColor: "#121212",
          }}
        >
          {props.children}
        </AppShell.Main>
      </AppShell>
    </>
  );
}
