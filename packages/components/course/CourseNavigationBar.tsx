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
import { useUserInfo } from "@codeup/hooks";
import Link from "next/link";

export default function CourseNavigationBar() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const userInfo = useUserInfo();
  const Menu = () => {
    return (
      <>
        <Link href={"/explore"}>
          <Button variant={"ghost"} size={"lg"} onClick={onClose}>
            Explore
          </Button>
        </Link>
        <Link href={"/course/my-courses"}>
          <Button variant={"ghost"} size={"lg"} onClick={onClose}>
            My Courses
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
              <Link href={"/community"}>Courses</Link>
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
                    <DrawerHeader>CodeUp | Courses</DrawerHeader>

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
