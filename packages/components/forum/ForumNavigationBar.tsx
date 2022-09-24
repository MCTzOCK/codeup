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
import { useLoggedIn } from "@codeup/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import REST from "@codeup/rest";
import { useRouter } from "next/router";

export default function ForumNavigationBar() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  const { loggedIn, userInfo, loaded } = useLoggedIn();

  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo.username) {
      REST.Forum.getProfileV2(userInfo.username).then((res) => {
        if (res.status === 200) {
          setHasProfile(true);
        }
      });
    }
  }, [loaded, userInfo]);

  const Menu = () => {
    return (
      <>
        <Button
          variant={"ghost"}
          size={"lg"}
          onClick={() => {
            router.push("/forum");
            onClose();
          }}
        >
          Home
        </Button>
        {loggedIn && hasProfile ? (
          <>
            <Button
              variant={"ghost"}
              size={"lg"}
              onClick={() => {
                router.push("/forum/" + userInfo.username);
                onClose();
              }}
            >
              Mein Profil
            </Button>
          </>
        ) : null}
        {loggedIn && hasProfile ? (
          <>
            <Button
              variant={"ghost"}
              size={"lg"}
              onClick={() => {
                router.push("/forum/messages");
                onClose();
              }}
            >
              Nachrichten
            </Button>
          </>
        ) : null}
      </>
    );
  };

  return (
    <>
      <Box w={"100%"} bg={"gray.900"} padding={"1.2rem"}>
        <Flex direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <Heading flex={"5%"} textAlign={["center", "left"]}>
            <ChakraLink
              onClick={() => {
                router.push("/forum");
              }}
            >
              Forum
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
                    <DrawerHeader>CodeUp | Forum</DrawerHeader>

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
