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
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  SimpleGrid,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";
import { FaComment } from "react-icons/fa";
import { useRouter } from "next/router";
import { BiCodeAlt } from "react-icons/bi";
import { TbCertificate } from "react-icons/tb";
import { HiLightBulb } from "react-icons/hi";
import { BsCheck2Square } from "react-icons/bs";
import InCodeIcon from "../icons/InCodeIcon";
import UserAuthAction from "./UserAuthAction";
import NavigationBarMenu from "./NavigationBarMenu";
import MenuButtons from "./MenuButtons";
import { useEffect } from "react";

export default function NavigationBar() {
  const whatEverRef = React.useRef();

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
            <Box flex={"10%"}></Box>
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
                onLogoutOpen={onLogoutOpen}
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
                          onLogoutOpen={onLogoutOpen}
                        />
                      </Flex>
                    </DrawerBody>

                    <DrawerFooter
                      gap={"2rem"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <MenuButtons
                        onClose={onClose}
                        onUserAuthOpen={onUserAuthOpen}
                        onLogoutOpen={onLogoutOpen}
                      />
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
              <MenuButtons
                onClose={onClose}
                onUserAuthOpen={onUserAuthOpen}
                onLogoutOpen={onLogoutOpen}
              />
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
                description={"Verwirkliche deine Projekteideen"}
                icon={<BiCodeAlt />}
                url={"/ide"}
              />
              <ExpandedMenuOption
                name={"InCode"}
                description={"Dokumentation unserer Programmiersprache InCode"}
                icon={<InCodeIcon />}
                url={"/redirect?url=https://incode.codeup.space"}
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
            </SimpleGrid>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        isOpen={isLogoutOpen}
        onClose={onLogoutClose}
        isCentered
        // @ts-ignore
        leastDestructiveRef={whatEverRef}
      >
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)">
          <AlertDialogContent bg={"black"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Abmelden
            </AlertDialogHeader>

            <AlertDialogBody>Willst du dich wirklich abmelden?</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={onLogoutClose}
                // @ts-ignore
                ref={whatEverRef}
              >
                Abbrechen
              </Button>
              <Button
                colorScheme="red"
                variant={"outline"}
                onClick={() => {
                  onClose();
                  onLogoutClose();
                  localStorage.removeItem("token");
                  router.push("/");
                }}
                ml={3}
              >
                Abmelden
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
