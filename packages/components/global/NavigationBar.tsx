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
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Link as ChakraLink,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
  useMediaQuery,
  SimpleGrid,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useUserInfo } from "@codeup/hooks";
import Link from "next/link";
import { AiFillCaretDown } from "react-icons/ai";
import { ReactNode } from "react";
import { FaComment } from "react-icons/fa";
import { useRouter } from "next/router";
import { BiCodeAlt } from "react-icons/bi";
import { TbCertificate } from "react-icons/tb";
import { HiLightBulb } from "react-icons/hi";
import {
  BsCheck2Square,
  BsFillCalendar2WeekFill,
  BsGlobe,
} from "react-icons/bs";

export default function NavigationBar() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  const {
    isOpen: isMoreMenuOpen,
    onOpen: onMoreMenuOpen,
    onClose: onMoreMenuClose,
  } = useDisclosure();

  const userInfo = useUserInfo();

  const Menu = () => {
    return (
      <>
        <Link href={"/"}>
          <Button variant={"ghost"} size={"lg"} onClick={onClose}>
            Home
          </Button>
        </Link>
        <Link href={"/explore"}>
          <Button variant={"ghost"} size={"lg"} onClick={onClose}>
            Kurse
          </Button>
        </Link>
        <Button
          variant={"ghost"}
          size={"lg"}
          rightIcon={<AiFillCaretDown />}
          onClick={onMoreMenuOpen}
        >
          Mehr
        </Button>
        {userInfo.id !== "" ? (
          <>
            <Popover>
              <PopoverTrigger>
                <Button
                  variant={"ghost"}
                  size={"lg"}
                  rightIcon={<AiFillCaretDown />}
                >
                  Konto
                </Button>
              </PopoverTrigger>
              <PopoverContent bg={"black"}>
                <PopoverArrow />
                <PopoverBody>
                  <Flex w={"100%"} direction={"column"}>
                    <Link href={"/account/settings"}>
                      <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                        Einstellungen
                      </Button>
                    </Link>

                    <Link href={"/dashboard"}>
                      <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                        Dashboard
                      </Button>
                    </Link>

                    <Link href={"/account/logout"}>
                      <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                        Abmelden
                      </Button>
                    </Link>
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </>
        ) : null}
      </>
    );
  };

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
          maxW={400}
          rounded={"xl"}
          _hover={{
            backgroundColor: "whiteAlpha.200",
          }}
          _active={{
            backgroundColor: "whiteAlpha.300",
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
            <Box flex={"80%"}>
              <Flex w={"100%"} direction={"column"}>
                <Heading size={"lg"}>{props.name}</Heading>
                <Text color={"gray.500"}>{props.description}</Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </>
    );
  };

  const MenuButtons = () => {
    return (
      <>
        {userInfo.id === "" ? (
          <>
            <Link href={"/account/register"}>
              <Button
                variant={"solid"}
                colorScheme={"whatsapp"}
                onClick={onClose}
              >
                Beitreten
              </Button>
            </Link>
            <Link href={"/account/login"}>
              <Button variant={"solid"} onClick={onClose}>
                Anmelden
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href={"/dashboard"}>
              <Button variant={"solid"} colorScheme={"blue"} onClick={onClose}>
                Dashboard
              </Button>
            </Link>
            <Link href={"/account/logout"}>
              <Button variant={"solid"} colorScheme={"red"} onClick={onClose}>
                Abmelden
              </Button>
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Box w={"100%"} bg={"black"} padding={"1.2rem"}>
        <Flex direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <Heading flex={"flex-start"} textAlign={["center", "left"]}>
            <ChakraLink href={"/"}>CodeUp</ChakraLink>
          </Heading>
          <Flex
            justifyContent={isMobile ? "right" : "center"}
            flex={"100%"}
            alignItems={"center"}
          >
            {!isMobile ? (
              <Menu />
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
                        <Menu />
                      </Flex>
                    </DrawerBody>

                    <DrawerFooter
                      gap={"2rem"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <MenuButtons />
                    </DrawerFooter>
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
              <MenuButtons />
            </Flex>
          ) : null}
        </Flex>
      </Box>
      <Divider />
      <Drawer
        isOpen={isMoreMenuOpen}
        placement={"top"}
        size={["full", "xl"]}
        onClose={onMoreMenuClose}
      >
        <DrawerOverlay />
        <DrawerContent bgColor={"black"}>
          <DrawerCloseButton />
          <DrawerHeader>Mehr Angebote</DrawerHeader>

          <DrawerBody>
            <SimpleGrid
              minChildWidth={300}
              maxH={"100vh"}
              overflow={"auto"}
              mb={[0, "2rem"]}
              gap={".4rem"}
            >
              <ExpandedMenuOption
                name={"Forum"}
                description={
                  "Chatte mit erfahrenen Programmierern und Einsteigern."
                }
                icon={<FaComment />}
                url={"/community"}
              />
              <ExpandedMenuOption
                name={"IDE (Editor)"}
                description={
                  "Chatte mit erfahrenen Programmierern und Einsteigern."
                }
                icon={<BiCodeAlt />}
                url={"/ide"}
              />
              <ExpandedMenuOption
                name={"Zertifikate"}
                description={"Erhalte Zertifikate für absolvierte Kurse."}
                icon={<TbCertificate />}
                url={"/certificates"}
              />
              <ExpandedMenuOption
                name={"Projektideen"}
                description={"Finde Inspirationen für Projekte."}
                icon={<HiLightBulb />}
                url={"/project-ideas"}
              />
              <ExpandedMenuOption
                name={"Todo"}
                description={
                  "Plane Projekte oder anderes mit einfachen Todo Listen."
                }
                icon={<BsCheck2Square />}
                url={"/todo"}
              />
              <ExpandedMenuOption
                name={"Kalender"}
                description={"Plane anstehende Termine."}
                icon={<BsFillCalendar2WeekFill />}
                url={"/calendar"}
              />
              <ExpandedMenuOption
                name={"Hosting"}
                description={
                  "Veröffentliche deine Web-Projekte mit wenig Aufwand."
                }
                icon={<BsGlobe />}
                url={"/hosting"}
              />
            </SimpleGrid>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
