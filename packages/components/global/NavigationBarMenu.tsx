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
} from "@chakra-ui/react";
import { AiFillCaretDown } from "react-icons/ai";
import Link from "next/link";
import { useLoggedIn } from "@codeup/hooks";

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
      <Link href={"/about"}>
        <Button variant={"ghost"} size={"lg"} onClick={props.onClose}>
          Über Uns
        </Button>
      </Link>
      <Link href={"/explore"}>
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
      {loggedIn ? (
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
              <PopoverArrow bg={"black"} />
              <PopoverBody>
                <Flex w={"100%"} direction={"column"}>
                  <Link href={"/account/settings"}>
                    <Button
                      variant={"ghost"}
                      size={"lg"}
                      onClick={props.onClose}
                    >
                      Einstellungen
                    </Button>
                  </Link>

                  <Link href={"/dashboard"}>
                    <Button
                      variant={"ghost"}
                      size={"lg"}
                      onClick={props.onClose}
                    >
                      Dashboard
                    </Button>
                  </Link>

                  <Button
                    variant={"ghost"}
                    size={"lg"}
                    onClick={() => {
                      props.onClose();
                      props.onLogoutOpen();
                    }}
                  >
                    Abmelden
                  </Button>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </>
      ) : null}
    </>
  );
}
