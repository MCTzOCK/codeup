/**
 * packages/components/global/NavigationBarMenu.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import * as React from "react";
import {
  Button,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { AiFillCaretDown } from "react-icons/ai";
import Link from "next/link";
import { useLoggedIn } from "@codeup/hooks";
import { FaCaretDown, FaDollarSign, FaSearch } from "react-icons/fa";
import DividerWithText from "./DividerWithText";
import { useRouter } from "next/router";
import { FaRobot } from "react-icons/fa6";

export default function NavigationBarMenu(props: {
  onClose: () => void;
  onOpen: () => void;
  onMoreMenuOpen: () => void;
  onLogoutOpen: () => void;
  disablePricing?: boolean;
}) {
  const { loggedIn } = useLoggedIn();
  const router = useRouter();

  return (
    <>
      <Button
        variant={"ghost"}
        size={"lg"}
        rightIcon={<AiFillCaretDown />}
        onClick={props.onMoreMenuOpen}
      >
        Angebote
      </Button>
      <Button
        variant={"ghost"}
        size={"lg"}
        onClick={() => {
          router.push("/pricing");
        }}
        display={props.disablePricing ? "none" : "initial"}
      >
        Preise
      </Button>
      <Popover>
        <PopoverTrigger>
          <Button variant={"ghost"} size={"lg"} rightIcon={<FaCaretDown />}>
            CodeUp
          </Button>
        </PopoverTrigger>
        <PopoverContent bg={"black"}>
          <PopoverArrow bg={"black"} />
          <PopoverBody>
            <Stack textAlign={"center"}>
              <Link href={"/codeup/about"} onClick={props.onClose}>
                <Text
                  fontSize={"xl"}
                  cursor={"pointer"}
                  _hover={{
                    bg: "gray.700",
                  }}
                  rounded={"lg"}
                >
                  Über Uns
                </Text>
              </Link>
              <Link href={"/codeup/contact"} onClick={props.onClose}>
                <Text
                  fontSize={"xl"}
                  cursor={"pointer"}
                  _hover={{
                    bg: "gray.700",
                  }}
                  rounded={"lg"}
                >
                  Kontakt
                </Text>
              </Link>
              <Link href={"/blog"} onClick={props.onClose}>
                <Text
                  fontSize={"xl"}
                  cursor={"pointer"}
                  _hover={{
                    bg: "gray.700",
                  }}
                  rounded={"lg"}
                >
                  Blog
                </Text>
              </Link>
              <Link href={"/creator"} onClick={props.onClose}>
                <Text
                  fontSize={"xl"}
                  cursor={"pointer"}
                  _hover={{
                    bg: "gray.700",
                  }}
                  rounded={"lg"}
                >
                  Creator
                </Text>
              </Link>
              <DividerWithText text={"Rechtliches"} color={"gray.400"} />
              <Link href={"/legal/imprint"} onClick={props.onClose}>
                <Text
                  fontSize={"xl"}
                  cursor={"pointer"}
                  _hover={{
                    bg: "gray.700",
                  }}
                  rounded={"lg"}
                >
                  Impressum
                </Text>
              </Link>
              <Link href={"/legal/privacy"} onClick={props.onClose}>
                <Text
                  fontSize={"xl"}
                  cursor={"pointer"}
                  _hover={{
                    bg: "gray.700",
                  }}
                  rounded={"lg"}
                >
                  Datenschutzerklärung
                </Text>
              </Link>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Button
        variant={"ghost"}
        size={"lg"}
        display={"none"}
        onClick={() => {
          window.dispatchEvent(new CustomEvent("codeup::open_search"));
        }}
        //display={["none", "initial"]}
      >
        Suche
      </Button>
      <Button
        variant={"ghost"}
        size={"lg"}
        onClick={() => {
          router.push("/ai");
        }}
        leftIcon={<FaRobot />}
      >
        AI-Assistent
      </Button>
    </>
  );
}
