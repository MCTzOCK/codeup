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
  IconButton,
  Image,
  Link,
  LinkProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import Newsletter from "./Newsletter";
import { useTranslation } from "next-i18next";
import { FaChevronDown } from "react-icons/fa6";
import ReactCountryFlag from "react-country-flag";
import { useRouter } from "next/router";

const Footer = (props: { transparent?: boolean }) => {
  const { t, i18n } = useTranslation(["base", "navbar", "footer"]);
  const router = useRouter();

  const languages: {
    [key: string]: {
      cc: string;
      display: string;
    };
  } = {
    de: {
      cc: "DE",
      display: "Deutsch",
    },
    en: {
      cc: "GB",
      display: "English",
    },
  };

  return (
    <Box
      w={"100%"}
      backgroundColor={props.transparent ? "transparent" : "#000"}
    >
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
              color={"brand.500"}
              textTransform={"uppercase"}
            >
              {t("product.name", { ns: "base" })}
            </Heading>
            <Text mt={2} color="white" fontSize="md">
              {t("made.by", { ns: "footer" })}
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
                {t("about", { ns: "footer" })}
              </Text>
              <VStack spacing={2} alignItems="flex-start" color="white">
                <CustomLink href={"/codeup/about"}>
                  {t("about.codeup", { ns: "footer" })}
                </CustomLink>
                <CustomLink href={"/codeup/contact"}>
                  {t("about.contact", { ns: "footer" })}
                </CustomLink>
                <CustomLink href={"/codeup/blog"}>
                  {t("about.blog", { ns: "footer" })}
                </CustomLink>
                <CustomLink href={"/legal/imprint"}>
                  {t("about.imprint", { ns: "footer" })}
                </CustomLink>
                <CustomLink href={"/legal/privacy"}>
                  {t("about.privacy", { ns: "footer" })}
                </CustomLink>
              </VStack>
            </VStack>
            <VStack spacing={4} alignItems="flex-start">
              <Text fontSize="md" fontWeight="bold">
                {t("other", { ns: "footer" })}
              </Text>
              <VStack spacing={2} alignItems="flex-start" color="white">
                <CustomLink href={"/forum"}>
                  {t("other.forum", { ns: "footer" })}
                </CustomLink>
                <CustomLink href={"/editor"}>
                  {t("other.editor", { ns: "footer" })}
                </CustomLink>
                <CustomLink href={"/tasks"}>
                  {t("other.todo", { ns: "footer" })}
                </CustomLink>
                <CustomLink href={"/planning"}>
                  {t("other.flows", { ns: "footer" })}
                </CustomLink>
                <CustomLink href={"/certificates"}>
                  {t("other.certificates", { ns: "footer" })}
                </CustomLink>
              </VStack>
            </VStack>
            <VStack spacing={4} alignItems="flex-start">
              <Text
                fontSize="md"
                fontWeight="bold"
                color={"transparent"}
                userSelect={"none"}
              >
                {t("other", { ns: "footer" })}
              </Text>
              <VStack spacing={2} alignItems="flex-start" color="white">
                <CustomLink href={"/course"}>
                  {t("other.courses", { ns: "footer" })}
                </CustomLink>
                <CustomLink href={"/discovery"}>
                  {t("other.discovery", { ns: "footer" })}
                </CustomLink>
                <CustomLink href={"/creator/studio"}>
                  {t("other.creator", { ns: "footer" })}
                </CustomLink>
                <CustomLink href={"/dashboard/v2"}>
                  {t("other.dashboard", { ns: "footer" })}
                </CustomLink>
                <CustomLink href={"/snippets/my"}>
                  {t("other.snippets", { ns: "footer" })}
                </CustomLink>
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
            {t("copyright", { ns: "footer" })} &copy;&nbsp;
            {new Date().getFullYear()}&nbsp;
            <Link
              href="https://ben-siebert.de"
              _hover={{ textDecoration: "underline" }}
              isExternal
            >
              Ben Siebert
            </Link>
          </Text>
          <Stack spacing={2} direction={{ base: "column", md: "row" }} gap={4}>
            <Text fontSize="md">{t("awarded.by", { ns: "footer" })}</Text>
            <Link
              isExternal
              href={
                "https://www.jugend-forscht.de/projektdatenbank/codeup-einfacher-einstieg-in-die-programmierung.html"
              }
            >
              <Image
                src={"/_static/images/logos/jugend-forscht.svg"}
                alt={"Jugend Forscht"}
                width={"150px"}
              />
            </Link>
            <Link
              isExternal
              href={
                "https://www.startupteens.de/challenge-2023/voting/education/codeup/"
              }
            >
              <Image
                src={"/_static/images/logos/startupteens.png"}
                alt={"STARTUPTEENS"}
                width={"150px"}
              />
            </Link>
          </Stack>
          <Stack spacing={2} direction={{ base: "column", md: "row" }}>
            <Menu>
              <MenuButton as={Button} rightIcon={<FaChevronDown />}>
                <ReactCountryFlag
                  countryCode={
                    i18n && i18n.language && languages[i18n.language]
                      ? languages[i18n.language].cc
                      : "DE"
                  }
                  svg
                  style={{
                    fontSize: "1.5em",
                  }}
                />
              </MenuButton>
              <MenuList bg={"#000"}>
                {Object.keys(languages).map((lang) => (
                  <MenuItem
                    key={lang}
                    onClick={() => {
                      const { pathname, query, asPath } = router;
                      router
                        .push({ pathname, query }, asPath, {
                          locale: lang,
                        })
                        .then(() => {
                          window.location.reload();
                        });
                    }}
                    color={"white"}
                  >
                    <HStack spacing={4}>
                      <ReactCountryFlag
                        countryCode={languages[lang].cc}
                        svg
                        style={{
                          fontSize: "1.5em",
                        }}
                      />
                      <Text>{languages[lang].display}</Text>
                    </HStack>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <IconButton
              aria-label={"Twitter"}
              as={Link}
              target={"_blank"}
              href={"https://twitter.com/codeupspace"}
              icon={<FaTwitter />}
            />
            <IconButton
              aria-label={"Instagram"}
              as={Link}
              target={"_blank"}
              href={"https://instagram.com/codeupspace"}
              icon={<FaInstagram />}
            />
            <IconButton
              aria-label={"LinkedIn"}
              as={Link}
              target={"_blank"}
              href={"https://www.linkedin.com/in/ben-siebert-111595278/"}
              icon={<FaLinkedinIn />}
            />
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
