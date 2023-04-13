/**
 * src/components/Footer.tsx
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
  chakra,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  LinkProps,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import Newsletter from "./Newsletter";

const Footer = () => {
  return (
    <Box w={"100%"} backgroundColor={"black"}>
      <Box p={{ base: 5, md: 8 }} maxW="7xl" marginInline="auto">
        <Stack
          spacing={{ base: 8, md: 0 }}
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          gap={24}
        >
          <Box maxW="300px">
            <Heading
              as="h1"
              fontSize={"4xl"}
              fontFamily="ARCADE"
              color={"#F7DE1F"}
            >
              CODEUP
            </Heading>
            <Text mt={2} color="white" fontSize="md">
              Made with ❤ and ☕ by Ben Siebert
            </Text>
          </Box>
          <Newsletter />
          <HStack
            spacing={8}
            display={"flex"}
            justifyContent={{ sm: "space-between", md: "normal" }}
            direction={{ base: "column", md: "row" }}
          >
            <VStack spacing={4} alignItems="flex-start">
              <Text fontSize="md" fontWeight="bold">
                Über
              </Text>
              <VStack spacing={2} alignItems="flex-start" color="white">
                <CustomLink href={"/codeup/about"}>Über CodeUp</CustomLink>
                <CustomLink href={"/codeup/contact"}>Kontakt</CustomLink>
                <CustomLink href={"/codeup/blog"}>Blog</CustomLink>
                <CustomLink href={"/legal/imprint"}>Impressum</CustomLink>
                <CustomLink href={"/legal/privacy"}>Datenschutz</CustomLink>
              </VStack>
            </VStack>
            <VStack spacing={4} alignItems="flex-start">
              <Text fontSize="md" fontWeight="bold">
                Weitere Angebote
              </Text>
              <VStack spacing={2} alignItems="flex-start" color="white">
                <CustomLink href={"/forum"}>Forum</CustomLink>
                <CustomLink href={"/editor"}>Editor</CustomLink>
                <CustomLink href={"/todo"}>ToDo</CustomLink>
                <CustomLink href={"/planning"}>Flowchart</CustomLink>
                <CustomLink href={"/certificates"}>Zertifikate</CustomLink>
              </VStack>
            </VStack>
            <VStack spacing={4} alignItems="flex-start">
              <Text
                fontSize="md"
                fontWeight="bold"
                color={"transparent"}
                userSelect={"none"}
              >
                Weitere Angebote
              </Text>
              <VStack spacing={2} alignItems="flex-start" color="white">
                <CustomLink href={"/course"}>Kurse</CustomLink>
                <CustomLink href={"/discovery"}>Discovery</CustomLink>
                <CustomLink href={"/creator/studio"}>Creator Panel</CustomLink>
                <CustomLink href={"/dashboard"}>Dashboard</CustomLink>
                <CustomLink href={"/snippets/my"}>Code Snippets</CustomLink>
              </VStack>
            </VStack>
          </HStack>
        </Stack>

        <Divider my={4} />

        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={3}
          justifyContent="space-between"
        >
          <Text fontSize="md">
            Copyright &copy;&nbsp;{new Date().getFullYear()}&nbsp;
            <Link
              href="https://ben-siebert.de"
              _hover={{ textDecoration: "underline" }}
              isExternal
            >
              Ben Siebert
            </Link>
          </Text>
          <Stack spacing={2} direction={{ base: "column", md: "row" }}>
            <Button
              leftIcon={<FaGithub />}
              as={Link}
              href="https://github.com/MCTzOCK/codeup"
              rounded="md"
              colorScheme="gray"
            >
              Github
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

const CustomLink = ({ children, ...props }: LinkProps) => {
  return (
    <Link
      href="#"
      fontSize="sm"
      _hover={{ textDecoration: "underline" }}
      {...props}
    >
      {children}
    </Link>
  );
};

export default Footer;
