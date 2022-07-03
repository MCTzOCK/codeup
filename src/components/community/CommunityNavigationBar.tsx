/**
 * src/components/community/CommunityNavigationBar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.06.2022
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
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Link as ChakraLink,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import useUserInfo from "../../hooks/useUserInfo";
import Link from "next/link";

export default function CommunityNavigationBar() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const userInfo = useUserInfo();
  const Menu = () => {
    return (
      <>
        <Link href={"/community"}>
          <Button variant={"ghost"} size={"lg"} onClick={onClose}>
            Community
          </Button>
        </Link>
        <Link href={"/community/profile/" + userInfo.username}>
          <Button variant={"ghost"} size={"lg"} onClick={onClose}>
            My Profile
          </Button>
        </Link>
        <Link href={"/community/search"}>
          <Button variant={"ghost"} size={"lg"} onClick={onClose}>
            Search
          </Button>
        </Link>
      </>
    );
  };

  return (
    <>
      <Box w={"100%"} bg={"gray.900"} padding={"1.2rem"}>
        <Flex direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <Heading flex={"5%"} textAlign={["center", "left"]}>
            <ChakraLink href={"/community"}>
              <Link href={"/community"}>Community</Link>
            </ChakraLink>
          </Heading>
          <Flex justifyContent={"right"} flex={"100%"} alignItems={"right"}>
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
                    <DrawerHeader>CodeUp | Community</DrawerHeader>

                    <DrawerBody>
                      <Flex w={"100%"} direction={"column"}>
                        <Menu />
                      </Flex>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </>
            )}
          </Flex>
        </Flex>
      </Box>
      <Divider />
    </>
  );
}
