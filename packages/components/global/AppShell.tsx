/**
 * packages/components/global/AppShell.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.05.2024
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Input,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { CHeading } from "./CHeading";

export default function AppShell(props: {
  children: React.ReactNode;
  title: string;
  sub_pages: {
    text: string;
    icon: any;
    href: string;
  }[];
}) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [query, setQuery] = React.useState("");

  return (
    <>
      <Box
        w={"100%"}
        overflow={"hidden"}
        minH={"100vh"}
        h={"fit-content"}
        bg={"#000"}
      >
        <Box
          position={"relative"}
          top={2}
          left={2}
          w={"100%"}
          bg={"#000"}
          display={isOpen ? "none" : "initial"}
        >
          <IconButton
            aria-label={"Open Menu"}
            icon={<FaBars />}
            onClick={onOpen}
          />
        </Box>
        {props.children}
      </Box>
      <Drawer isOpen={isOpen} onClose={onClose} placement={"left"}>
        <DrawerOverlay />
        <DrawerContent bg={"#000"} color={"#fff"}>
          <DrawerCloseButton />
          <DrawerHeader>
            <CHeading size={"lg"}>{props.title}</CHeading>
          </DrawerHeader>
          <DrawerBody>
            <Stack gap={2}>
              <Input
                placeholder={"Suchen..."}
                onChange={(e) => setQuery(e.target.value)}
              />
              {props.sub_pages
                .filter((page) =>
                  page.text.toLowerCase().includes(query.toLowerCase())
                )
                .sort((a, b) => a.text.localeCompare(b.text))
                .map((page) => (
                  <>
                    <Button
                      variant={
                        router.pathname === page.href ? "brand" : "ghost"
                      }
                      leftIcon={page.icon}
                      textAlign={"left"}
                      alignItems={"center"}
                      justifyContent={"flex-start"}
                      size={"lg"}
                      onClick={() => router.push(page.href)}
                    >
                      {page.text}
                    </Button>
                  </>
                ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
