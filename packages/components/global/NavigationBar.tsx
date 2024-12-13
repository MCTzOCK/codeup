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
  Badge,
  Box,
  Button,
  chakra,
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
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link as ChakraLink,
  Text,
  Tooltip,
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
  FaGlobe,
  FaProjectDiagram,
  FaRocket,
  FaSearch,
  FaTrophy,
} from "react-icons/fa";
import router, { useRouter } from "next/router";
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
import { useLoggedIn } from "@codeup/hooks";
import { CHeading } from "./CHeading";
import { useTranslation } from "next-i18next";
import { FaCircle } from "react-icons/fa6";

export default function NavigationBar(props: {
  disablePricing?: boolean;
  transparent?: boolean;
}) {
  const enableNewLookAndFeel = false;
  const { t } = useTranslation(["base", "navbar"]);

  const whatEverRef = React.useRef();

  const logout = async () => {
    if (
      await PopupManager.confirmAsync({
        title: t("account.logout.confirm", { ns: "navbar" }),
        question: t("account.logout.confirm.text", { ns: "navbar" }),
      })
    ) {
      localStorage.removeItem("token");
      router.push("/");
    }
  };

  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userInfo, loggedIn, loaded } = useLoggedIn();

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
          zIndex={100}
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
      name: t("products.forum", { ns: "navbar" }),
      icon: <FaComment />,
      text: t("products.forum.text", { ns: "navbar" }),
      href: "/forum",
      category: "communicate",
    },
    {
      name: t("products.editor", { ns: "navbar" }),
      icon: <BiCodeAlt />,
      href: "/editor",
      text: t("products.editor.text", { ns: "navbar" }),
      category: "develop",
    },
    {
      name: t("products.devsuite", { ns: "navbar" }),
      icon: <BiCodeAlt />,
      href: "/projects",
      text: t("products.devsuite.text", { ns: "navbar" }),
      category: "develop",
    },
    {
      name: t("products.kids", { ns: "navbar" }),
      icon: <FaChild />,
      href: "/kids",
      text: t("products.kids.text", { ns: "navbar" }),
      category: "develop",
    },
    {
      name: t("products.discovery", { ns: "navbar" }),
      icon: <BiCodeBlock />,
      text: t("products.discovery.text", { ns: "navbar" }),
      href: "/discovery",
      category: "communicate",
    },
    {
      name: t("products.incode", { ns: "navbar" }),
      icon: <FaGlobe />,
      text: t("products.incode.text", { ns: "navbar" }),
      href: "/redirect?url=https://incode.codeup.space/docs/intro",
      category: "other",
    },
    {
      name: t("products.courses", { ns: "navbar" }),
      icon: <FaBook />,
      text: t("products.courses.text", { ns: "navbar" }),
      href: "/course",
      category: "learn",
    },
    {
      name: t("products.certificates", { ns: "navbar" }),
      icon: <TbCertificate />,
      text: t("products.certificates.text", { ns: "navbar" }),
      href: "/certificates",
      category: "learn",
    },
    {
      name: t("products.ideas", { ns: "navbar" }),
      icon: <HiLightBulb />,
      text: t("products.ideas.text", { ns: "navbar" }),
      href: "/ideas",
      category: "develop",
    },
    {
      name: t("products.legacy.todo", { ns: "navbar" }),
      icon: <BsCheck2Square />,
      text: t("products.legacy.todo.text", { ns: "navbar" }),
      href: "/todo",
      category: "other",
    },
    {
      name: t("products.tasks", { ns: "navbar" }),
      icon: <BsCheck2Square />,
      text: t("products.tasks.text", { ns: "navbar" }),
      href: "/tasks",
      category: "plan",
    },
    {
      name: t("products.flows", { ns: "navbar" }),
      icon: <FaProjectDiagram />,
      text: t("products.flows.text", { ns: "navbar" }),
      href: "/planning",
      category: "plan",
    },
    {
      name: t("products.snippets", { ns: "navbar" }),
      icon: <FaFileCode />,
      text: t("products.snippets.text", { ns: "navbar" }),
      href: "/snippets/my",
      category: "develop",
    },
    {
      name: t("products.roadmap", { ns: "navbar" }),
      icon: <FaRocket />,
      href: "/roadmap",
      text: t("products.roadmap.text", { ns: "navbar" }),
      category: "other",
    },
    {
      name: t("products.legacy.ide", { ns: "navbar" }),
      icon: <BiCodeAlt />,
      href: "/ide",
      text: t("products.legacy.ide.text", { ns: "navbar" }),
      category: "other",
    },
    {
      name: t("products.challenges", { ns: "navbar" }),
      category: "learn",
      href: "/challenges",
      text: t("products.challenges.text", { ns: "navbar" }),
      icon: <FaTrophy />,
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
      <Box
        w={"100%"}
        bg={props.transparent ? "transparent" : "#000"}
        padding={"1.2rem"}
      >
        <Flex
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          paddingInline={[0, 0, 24]}
        >
          <Heading flex={"flex-start"} textAlign={["center", "left"]}>
            <Link href={"/"}>
              <ChakraLink
                href={"/"}
                display={"flex"}
                flexDirection="row"
                alignItems={"center"}
                gap="1.2rem"
              >
                <img src="/codeup.svg" width="48" alt={"CodeUp Logo"} />
                <Text fontWeight={"extrabold"} ml={4}>
                  CodeUp
                </Text>
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
                disablePricing={props.disablePricing}
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
                    <DrawerHeader>{t("product.name")}</DrawerHeader>

                    <DrawerBody>
                      <Flex w={"100%"} direction={"column"}>
                        <NavigationBarMenu
                          onClose={onClose}
                          onOpen={onOpen}
                          onMoreMenuOpen={onMoreMenuOpen}
                          onLogoutOpen={logout}
                          disablePricing={props.disablePricing}
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
      <CodeUpModal
        onOpen={onMoreMenuOpen}
        onClose={onMoreMenuClose}
        isOpen={isMoreMenuOpen}
        title={t("products", { ns: "navbar" })}
        customSize={["full"]}
      >
        <Box mb={8} backgroundColor={"black"} shadow={"2xl"}>
          <InputGroup>
            <InputLeftElement>
              <FaSearch />
            </InputLeftElement>
            <Input
              placeholder={t("control.search", { ns: "base" })}
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
        {enableNewLookAndFeel ? (
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
            m={{
              base: -4,
              lg: 0,
            }}
          >
            {filteredMoreOptions
              .sort((a, b) => a.category.localeCompare(b.category))
              .map((o) => (
                <>
                  <Box
                    p={6}
                    rounded={"3xl"}
                    bg={"gray.700"}
                    w={"100%"}
                    minH={"20vh"}
                    cursor={"pointer"}
                    _hover={{
                      backgroundColor: "gray.800",
                    }}
                    onClick={() => {
                      onClose();
                      onMoreMenuClose();
                      router.push(o.href);
                    }}
                  >
                    <Flex
                      direction={{
                        base: "column",
                        sm: "column",
                        lg: "row",
                      }}
                    >
                      <Box flex={1}>
                        <HStack
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <HStack
                            spacing={2}
                            alignItems={"center"}
                            w={"fit-content"}
                            rounded={"full"}
                            bg={"gray.900"}
                            paddingInline={2}
                            paddingBlock={1}
                          >
                            <chakra.span
                              color={
                                o.category === "learn"
                                  ? "brand.500"
                                  : o.category === "develop"
                                  ? "purple.500"
                                  : o.category === "communicate"
                                  ? "emerald.500"
                                  : o.category === "plan"
                                  ? "blue.500"
                                  : "gray.500"
                              }
                              fontSize={"xx-small"}
                            >
                              <FaCircle />
                            </chakra.span>
                            <Text fontWeight={900}>
                              {o.category === "learn"
                                ? t("categories.learn")
                                : o.category === "develop"
                                ? t("categories.develop")
                                : o.category === "communicate"
                                ? t("categories.communicate")
                                : o.category === "plan"
                                ? t("categories.planning")
                                : t("categories.other")}
                            </Text>
                          </HStack>
                          <chakra.span fontSize={"2xl"} maxW={"20%"}>
                            {o.icon}
                          </chakra.span>
                        </HStack>
                        <CHeading
                          size={"xl"}
                          color={"white"}
                          fontFamily={"Inter"}
                          wordBreak={"break-word"}
                          fontWeight={600}
                          lineHeight={1.3}
                          mt={4}
                        >
                          {o.name}
                        </CHeading>
                        <Text color={"gray.200"} fontSize={"md"} mt={4}>
                          {o.text}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                </>
              ))}
          </Grid>
        ) : (
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(1, 1fr)",
              lg: "repeat(2, 1fr)",
            }}
            gap={6}
            m={{
              base: -4,
              lg: 0,
            }}
          >
            <GridItem
              borderStyle={"dashed"}
              borderRadius={"6px"}
              borderColor={"gray.700"}
              borderWidth={"3px"}
              p={2}
              pt={0}
              display={
                filteredMoreOptions.filter(
                  (option) => option.category === "learn"
                ).length > 0
                  ? "block"
                  : "none"
              }
            >
              <Box textAlign={"center"} p={2}>
                <CHeading size={"xl"}>
                  {t("categories.learn", { ns: "base" })}
                </CHeading>
              </Box>
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                  lg: "repeat(2, 1fr)",
                }}
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
              display={
                filteredMoreOptions.filter(
                  (option) => option.category === "develop"
                ).length > 0
                  ? "block"
                  : "none"
              }
            >
              <Box textAlign={"center"} p={2}>
                <CHeading size={"xl"}>
                  {t("categories.develop", { ns: "base" })}
                </CHeading>
              </Box>
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                  lg: "repeat(2, 1fr)",
                }}
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
              display={
                filteredMoreOptions.filter(
                  (option) => option.category === "communicate"
                ).length > 0
                  ? "block"
                  : "none"
              }
            >
              <Box textAlign={"center"} p={2}>
                <CHeading size={"xl"}>
                  {t("categories.communicate", { ns: "base" })}
                </CHeading>
              </Box>
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                  lg: "repeat(2, 1fr)",
                }}
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
              display={
                filteredMoreOptions.filter(
                  (option) => option.category === "plan"
                ).length > 0
                  ? "block"
                  : "none"
              }
            >
              <Box textAlign={"center"} p={2}>
                <CHeading size={"xl"}>
                  {t("categories.planning", { ns: "base" })}
                </CHeading>
              </Box>
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                  lg: "repeat(2, 1fr)",
                }}
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
              display={
                filteredMoreOptions.filter(
                  (option) => option.category === "other"
                ).length > 0
                  ? "block"
                  : "none"
              }
            >
              <Box textAlign={"center"} p={2}>
                <CHeading size={"xl"}>
                  {t("categories.other", { ns: "base" })}
                </CHeading>
              </Box>
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                  lg: "repeat(2, 1fr)",
                }}
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
        )}
      </CodeUpModal>
    </>
  );
}
