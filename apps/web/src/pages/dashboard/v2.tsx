/**
 * apps/web/src/pages/dashboard/v2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.07.2024
 *
 */

import * as React from "react";
import Head from "next/head";
import {
  Avatar,
  Box,
  Button,
  chakra,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  HStack,
  IconButton,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { CHeading } from "@codeup/components/global/CHeading";
import DV2SCourses from "@codeup/components/dashboard/DV2SCourses";
import DV2SCertificates from "@codeup/components/dashboard/DV2SCertificates";
import DV2STasks from "@codeup/components/dashboard/DV2STasks";
import DV2SKids from "@codeup/components/dashboard/DV2SKids";
import DV2SFlows from "@codeup/components/dashboard/DV2SFlows";
import DV2SSnippets from "@codeup/components/dashboard/DV2SSnippets";
import DV2SProjects from "@codeup/components/dashboard/DV2SProjects";
import {
  useLoggedIn,
  useUserInfo,
  useUserLoggedInRedirect,
} from "@codeup/hooks";
import router from "next/router";
import { FaCogs, FaSave } from "react-icons/fa";
import { FaPalette } from "react-icons/fa6";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { ReactElement } from "react";
import PopupManager from "../../global/PopupManager";
import { Reorder } from "framer-motion";

export default function DashboardV2() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const [config, setConfig] = React.useState<string[]>([]);

  React.useEffect(() => {
    reloadConfig();
  }, []);

  const reloadConfig = async () => {
    const res = await REST.Account.getDashboardConfig(
      AccountManager.getActiveToken()
    );

    if (res.status !== 200) {
      return;
    }

    setConfig(res.payload.config.sections);
    setCurrentSections(res.payload.config.sections);
  };

  const sections: {
    [key: string]: ReactElement;
  } = {
    "codeup.courses": <DV2SCourses />,
    "codeup.certificates": <DV2SCertificates />,
    "codeup.todos": <DV2STasks />,
    "codeup.kids": <DV2SKids />,
    "codeup.flows": <DV2SFlows />,
    "codeup.snippets": <DV2SSnippets />,
    "codeup.projects": <DV2SProjects />,
  };

  const sectionNames: {
    [key: string]: string;
  } = {
    "codeup.courses": "Kurse",
    "codeup.certificates": "Zertifikate",
    "codeup.todos": "Aufgaben",
    "codeup.kids": "CodeUp-Kids",
    "codeup.flows": "Flows",
    "codeup.snippets": "Snippets",
    "codeup.projects": "Projekte",
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentSections, setCurrentSections] = React.useState<string[]>([]);

  return (
    <>
      <Head>
        <title>Dashboard - CodeUp</title>
      </Head>
      <Flex direction={"column"} bg={"#000"} h={"fit-content"} minH={"100vh"}>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(1, 1fr)",
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
          ]}
          gap={12}
          p={[6, 12]}
        >
          <Box bg={"gray.900"} rounded={"md"} p={4}>
            <Flex justifyContent={"space-between"}>
              <CHeading size={"lg"}>Willkommen {userInfo.firstName}!</CHeading>
              <IconButton
                aria-label={"Customize"}
                icon={<FaPalette />}
                onClick={() => {
                  onOpen();
                }}
                variant={"brand"}
              />
            </Flex>
            <Stack spacing={4} pt={6}>
              <HStack gap={4}>
                <Avatar
                  bg={"gray.400"}
                  size={"lg"}
                  name={userInfo.username}
                  src={`/api/account/${userInfo.username}/picture`}
                />
                <VStack align={"start"}>
                  <CHeading size={"md"}>
                    {userInfo.firstName} {userInfo.lastName}
                  </CHeading>
                  <CHeading size={"md"} color={"gray.200"}>
                    @{userInfo.username}
                  </CHeading>
                </VStack>
              </HStack>
              <Text color={"gray.200"}>{userInfo.email}</Text>
              <Text>
                Du verfügt über die Rolle{" "}
                {userInfo.role === "admin" ? (
                  <chakra.span color={"red.500"} fontWeight={"bold"}>
                    ADMIN
                  </chakra.span>
                ) : userInfo.role === "editor" ? (
                  <chakra.span color={"blue.500"} fontWeight={"bold"}>
                    Creator
                  </chakra.span>
                ) : (
                  <chakra.span fontWeight={"bold"}>Nutzer</chakra.span>
                )}{" "}
                und das Abonnement{" "}
                {userInfo.subscription === "PRO" ? (
                  <chakra.span color={"brand.500"} fontWeight={"bold"}>
                    PRO
                  </chakra.span>
                ) : (
                  <chakra.span fontWeight={"bold"}>Kostenlos</chakra.span>
                )}
                .
              </Text>
              <Button
                variant={"brand"}
                size={"lg"}
                onClick={() => {
                  router.push("/account/settings");
                }}
                leftIcon={<FaCogs />}
                w={"fit-content"}
              >
                Account verwalten
              </Button>
            </Stack>
          </Box>
          {config.map((section) => {
            return (
              <>
                <Box bg={"gray.900"} rounded={"md"} p={4} overflow={"scroll"}>
                  {sections[section] || (
                    <Text>
                      Das Segment <i>{section}</i> wird noch nicht unterstützt!
                    </Text>
                  )}
                </Box>
              </>
            );
          })}
        </Grid>
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        size={["full", "full", "lg"]}
        placement={"left"}
      >
        <DrawerOverlay />
        <DrawerContent bg={"black"}>
          <DrawerCloseButton />
          <DrawerHeader>
            <CHeading size={"lg"}>Dashboard anpassen</CHeading>
          </DrawerHeader>
          <DrawerBody>
            <Reorder.Group
              as={"div"}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                flexDirection: "column",
              }}
              axis={"y"}
              values={currentSections}
              onReorder={setCurrentSections}
            >
              {currentSections.map((s) => (
                <Reorder.Item
                  key={s}
                  value={s}
                  as={"div"}
                  style={{
                    listStyle: "none",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    display: "flex",
                    border: "2px solid #F7DE1F",
                    cursor: "grab",
                    padding: 20,
                    borderRadius: "var(--chakra-radii-md)",
                  }}
                >
                  {sectionNames[s]}
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </DrawerBody>
          <DrawerFooter>
            <Button
              leftIcon={<FaSave />}
              variant={"brand"}
              onClick={async () => {
                const res = await REST.Account.setDashboardConfig(
                  AccountManager.getActiveToken(),
                  currentSections
                );

                if (res.status !== 200) {
                  await PopupManager.alertAsync({
                    title: "Fehler",
                    description:
                      "Die Konfiguration konnte nicht gespeichert werden: " +
                      res.payload.error,
                  });
                  return;
                }
                onClose();
                reloadConfig();
              }}
            >
              Speichern
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
