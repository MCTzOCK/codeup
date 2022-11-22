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
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AiFillCaretDown } from "react-icons/ai";
import Link from "next/link";
import { useLoggedIn } from "@codeup/hooks";
import { FaCaretDown } from "react-icons/fa";

export default function NavigationBarMenu(props: {
  onClose: () => void;
  onOpen: () => void;
  onMoreMenuOpen: () => void;
  onLogoutOpen: () => void;
}) {
  const { loggedIn } = useLoggedIn();

  return (
    <>
      <Link href={"/"}>
        <Button variant={"ghost"} size={"lg"} onClick={props.onClose}>
          Home
        </Button>
      </Link>
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
                <Text fontSize={"xl"} cursor={"pointer"}>
                  Über Uns
                </Text>
              </Link>
              <Link href={"/codeup/contact"} onClick={props.onClose}>
                <Text fontSize={"xl"} cursor={"pointer"}>
                  Kontakt
                </Text>
              </Link>
              <Link href={"/creator"} onClick={props.onClose}>
                <Text fontSize={"xl"} cursor={"pointer"}>
                  Creator
                </Text>
              </Link>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Link href={"/course"}>
        <Button variant={"ghost"} size={"lg"} onClick={props.onClose}>
          Kurse
        </Button>
      </Link>
      <Button
        variant={"ghost"}
        size={"lg"}
        rightIcon={<AiFillCaretDown />}
        onClick={props.onMoreMenuOpen}
      >
        Mehr
      </Button>
    </>
  );
}
