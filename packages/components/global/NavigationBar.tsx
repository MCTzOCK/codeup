/**
 * src/components/NavigationBar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Link as ChakraLink,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";
import {
  FaBook,
  FaChild,
  FaComment,
  FaFileCode,
  FaProjectDiagram,
  FaRocket,
  FaSearch,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { BiCodeAlt, BiCodeBlock } from "react-icons/bi";
import { TbCertificate } from "react-icons/tb";
import { HiLightBulb } from "react-icons/hi";
import { BsCheck2Square } from "react-icons/bs";
import InCodeIcon from "../icons/InCodeIcon";
import UserAuthAction from "./UserAuthAction";
import NavigationBarMenu from "./NavigationBarMenu";
import MenuButtons from "./MenuButtons";
import CodeUpModal from "../codeup/CodeUpModal";
import PopupManager from "@codeup/web/src/global/PopupManager";
import SuperText from "../landingpage/SuperText";

export default function NavigationBar() {
  const whatEverRef = React.useRef();

  const logout = async () => {
    if (
      await PopupManager.confirmAsync({
        title: "Abmelden",
        question: "Willst du dich wirklich abmelden?",
      })
    ) {
      localStorage.removeItem("token");
      router.push("/");
    }
  };

  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isLogoutOpen,
    onOpen: onLogoutOpen,
    onClose: onLogoutClose,
  } = useDisclosure();

  const router = useRouter();

  const {
    isOpen: isMoreMenuOpen,
    onOpen: onMoreMenuOpen,
    onClose: onMoreMenuClose,
  } = useDisclosure();

  const {
    isOpen: isUserAuthOpen,
    onOpen: onUserAuthOpen,
    onClose: onUserAuthClose,
  } = useDisclosure();

  useEffect(() => {
    if (router.asPath.includes("#login")) {
      onUserAuthOpen();
    }
  }, []);

  const ExpandedMenuOption = (props: {
    name: string;
    description: string;
    icon: any;
    url: string;
  }) => {
    return (
      <>
        <Box
          padding={".8rem"}
          borderRadius={"6px"}
          h={"100%"}
          w={"100%"}
          _hover={{
            backgroundColor: "whiteAlpha.100",
          }}
          _active={{
            backgroundColor: "whiteAlpha.200",
          }}
          cursor={"pointer"}
          transition={"200ms"}
          onClick={async () => {
            await onMoreMenuClose();
            await onClose();
            await router.push(props.url);
          }}
        >
          <Flex direction={"row"} w={"100%"} alignItems={"center"} h={"100%"}>
            <Box flex={"10%"}>
              <Heading color={"white"}>{props.icon}</Heading>
            </Box>
            <Box flex={"10%"} minW={"20px"}></Box>
            <Box flex={"80%"}>
              <Flex w={"100%"} direction={"column"}>
                <Heading size={"lg"}>{props.name}</Heading>
                <Text color={"gray.300"}>{props.description}</Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </>
    );
  };

  const moreOptions: {
    name: string;
    text: string;
    icon: any;
    href: string;
    category: string;
  }[] = [
    {
      name: "Forum",
      icon: <FaComment />,
      text: "Unterhalte dich mit anderen Entwicklern",
      href: "/forum",
      category: "communicate",
    },
    {
      name: "Editor",
      icon: <BiCodeAlt />,
      href: "/editor",
      text: "Verwirkliche deine Projektideen",
      category: "develop",
    },
    {
      name: "CodeUp Kids",
      icon: <FaChild />,
      href: "/kids",
      text: "Blockbasierte Programmierung mit CodeUp Kids",
      category: "develop",
    },
    {
      name: "Discovery",
      icon: <BiCodeBlock />,
      text: "Sieh dir Projekte an, die von anderen Entwicklern veröffentlicht wurden.",
      href: "/discovery",
      category: "communicate",
    },
    {
      name: "InCode",
      icon: <InCodeIcon />,
      text: "Originale Dokumentation der InCode Programmiersprache",
      href: "/redirect?url=https://incode.codeup.space/docs/intro",
      category: "other",
    },
    {
      name: "Kurse",
      icon: <FaBook />,
      text: "Lerne neue Programmiersprachen und Technologien",
      href: "/course",
      category: "learn",
    },
    {
      name: "Zertifikate",
      icon: <TbCertificate />,
      text: "Erhalte Zertifikate für absolvierte Kurse",
      href: "/certificates",
      category: "learn",
    },
    {
      name: "Projektideen",
      icon: <HiLightBulb />,
      text: "Finde Inspirationen für neue Projekte",
      href: "/ideas",
      category: "develop",
    },
    {
      name: "Todo",
      icon: <BsCheck2Square />,
      text: "Plane Projekte mit einfachen To-Do Listen",
      href: "/todo",
      category: "plan",
    },
    {
      name: "Flows",
      icon: <FaProjectDiagram />,
      text: "Plane Projekte mit komplexen Flussdiagrammen",
      href: "/planning",
      category: "plan",
    },
    {
      name: "Code Snippets",
      icon: <FaFileCode />,
      text: "Speicher Code Snippets für spätere Verwendung",
      href: "/snippets/my",
      category: "develop",
    },
    {
      name: "Roadmap",
      icon: <FaRocket />,
      href: "/roadmap",
      text: "Behalte den Überblick über deinen Entwicklungsprozess",
      category: "other",
    },
    {
      name: "IDE (veraltet)",
      icon: <BiCodeAlt />,
      href: "/ide",
      text: "Verwirkliche deine Projektideen",
      category: "other",
    },
  ];

  const [filteredMoreOptions, setFilteredMoreOptions] =
    useState<typeof moreOptions>(moreOptions);

  return (
    <>
      <UserAuthAction
        onOpen={onUserAuthOpen}
        onClose={onUserAuthClose}
        isOpen={isUserAuthOpen}
      />
      <Box w={"100%"} bg={"black"} padding={"1.2rem"}>
        <Flex direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <Heading flex={"flex-start"} textAlign={["center", "left"]}>
            <Link href={"/"}>
              <ChakraLink
                href={"/"}
                display={"flex"}
                flexDirection="row"
                alignItems={"center"}
                gap="1.2rem"
              >
                <img src="/codeup.svg" width="48" />
                CodeUp
              </ChakraLink>
            </Link>
          </Heading>
          <Flex
            justifyContent={isMobile ? "right" : "center"}
            flex={"100%"}
            alignItems={"center"}
          >
            {!isMobile ? (
              <NavigationBarMenu
                onClose={onClose}
                onOpen={onOpen}
                onMoreMenuOpen={onMoreMenuOpen}
                onLogoutOpen={logout}
              />
            ) : (
              <>
                <IconButton
                  onClick={onOpen}
                  aria-label={"Menu"}
                  icon={<GiHamburgerMenu />}
                  flex={"flex-end"}
                />
                <Drawer
                  isOpen={isOpen}
                  placement="right"
                  onClose={onClose}
                  size={"full"}
                >
                  <DrawerOverlay />
                  <DrawerContent bg={"black"}>
                    <DrawerCloseButton />
                    <DrawerHeader>CodeUp</DrawerHeader>

                    <DrawerBody>
                      <Flex w={"100%"} direction={"column"}>
                        <NavigationBarMenu
                          onClose={onClose}
                          onOpen={onOpen}
                          onMoreMenuOpen={onMoreMenuOpen}
                          onLogoutOpen={logout}
                        />
                      </Flex>
                      <Flex
                        mt={"2rem"}
                        w={"100%"}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <MenuButtons
                          onClose={onClose}
                          onUserAuthOpen={onUserAuthOpen}
                          onLogoutOpen={logout}
                        />
                      </Flex>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </>
            )}
          </Flex>
          {!isMobile ? (
            <Flex
              justifyContent={["center", "flex-end"]}
              flex={"10%"}
              alignItems={"center"}
              gap={"1.2rem"}
              mt={["2rem", 0]}
            >
              <MenuButtons
                onClose={onClose}
                onUserAuthOpen={onUserAuthOpen}
                onLogoutOpen={logout}
              />
            </Flex>
          ) : null}
        </Flex>
      </Box>
      <Divider />
      <CodeUpModal
        onOpen={onMoreMenuOpen}
        onClose={onMoreMenuClose}
        isOpen={isMoreMenuOpen}
        title={"Angebote"}
        customSize={["full"]}
      >
        <Box mb={8} backgroundColor={"gray.800"} shadow={"2xl"}>
          <InputGroup>
            <InputLeftElement>
              <FaSearch />
            </InputLeftElement>
            <Input
              placeholder={"Suchbegriff eingeben"}
              onChange={(event) => {
                const searchTerm = event.target.value.toLowerCase() as string;

                setFilteredMoreOptions(
                  moreOptions.filter((option) => {
                    return (
                      option.name.toLowerCase().includes(searchTerm) ||
                      option.text.toLowerCase().includes(searchTerm)
                    );
                  })
                );
              }}
            />
          </InputGroup>
        </Box>
        <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={6}>
          <GridItem
            borderStyle={"dashed"}
            borderRadius={"6px"}
            borderColor={"gray.700"}
            borderWidth={"3px"}
            p={2}
            pt={0}
          >
            <SuperText>Lernen</SuperText>
            <Grid
              templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
              gap={6}
            >
              {filteredMoreOptions
                .filter((option) => option.category === "learn")
                .map((option) => (
                  <>
                    <GridItem>
                      <ExpandedMenuOption
                        name={option.name}
                        description={option.text}
                        icon={option.icon}
                        url={option.href}
                      />
                    </GridItem>
                  </>
                ))}
            </Grid>
          </GridItem>
          <GridItem
            borderStyle={"dashed"}
            borderRadius={"6px"}
            borderColor={"gray.700"}
            borderWidth={"3px"}
            p={2}
            pt={0}
          >
            <SuperText>Entwickeln</SuperText>
            <Grid
              templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
              gap={6}
            >
              {filteredMoreOptions
                .filter((option) => option.category === "develop")
                .map((option) => (
                  <>
                    <GridItem>
                      <ExpandedMenuOption
                        name={option.name}
                        description={option.text}
                        icon={option.icon}
                        url={option.href}
                      />
                    </GridItem>
                  </>
                ))}
            </Grid>
          </GridItem>
          <GridItem
            borderStyle={"dashed"}
            borderRadius={"6px"}
            borderColor={"gray.700"}
            borderWidth={"3px"}
            p={2}
            pt={0}
          >
            <SuperText>Austauschen</SuperText>
            <Grid
              templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
              gap={6}
            >
              {filteredMoreOptions
                .filter((option) => option.category === "communicate")
                .map((option) => (
                  <>
                    <GridItem>
                      <ExpandedMenuOption
                        name={option.name}
                        description={option.text}
                        icon={option.icon}
                        url={option.href}
                      />
                    </GridItem>
                  </>
                ))}
            </Grid>
          </GridItem>
          <GridItem
            borderStyle={"dashed"}
            borderRadius={"6px"}
            borderColor={"gray.700"}
            borderWidth={"3px"}
            p={2}
            pt={0}
          >
            <SuperText>Planen</SuperText>
            <Grid
              templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
              gap={6}
            >
              {filteredMoreOptions
                .filter((option) => option.category === "plan")
                .map((option) => (
                  <>
                    <GridItem>
                      <ExpandedMenuOption
                        name={option.name}
                        description={option.text}
                        icon={option.icon}
                        url={option.href}
                      />
                    </GridItem>
                  </>
                ))}
            </Grid>
          </GridItem>
          <GridItem
            borderStyle={"dashed"}
            borderRadius={"6px"}
            borderColor={"gray.700"}
            borderWidth={"3px"}
            p={2}
            pt={0}
          >
            <SuperText>Anderes</SuperText>
            <Grid
              templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
              gap={6}
            >
              {filteredMoreOptions
                .filter((option) => option.category === "other")
                .map((option) => (
                  <>
                    <GridItem>
                      <ExpandedMenuOption
                        name={option.name}
                        description={option.text}
                        icon={option.icon}
                        url={option.href}
                      />
                    </GridItem>
                  </>
                ))}
            </Grid>
          </GridItem>
        </Grid>
      </CodeUpModal>
    </>
  );
}
