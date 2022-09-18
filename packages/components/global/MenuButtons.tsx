/**
 * packages/components/global/MenuButtons.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import * as React from "react";
import {
  Avatar,
  Button,
  Center,
  chakra,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useLoggedIn } from "@codeup/hooks";
import Link from "next/link";

export default function MenuButtons(props: {
  onClose: () => void;
  onUserAuthOpen: () => void;
  onLogoutOpen: () => void;
}) {
  const { loggedIn, userInfo } = useLoggedIn();

  return (
    <>
      {!loggedIn ? (
        <>
          <Button
            variant={"solid"}
            onClick={() => {
              props.onClose();
              props.onUserAuthOpen();
            }}
            colorScheme={"whatsapp"}
          >
            Anmelden
          </Button>
        </>
      ) : null}
      {loggedIn ? (
        <>
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <Avatar
                src={"/api/account/" + userInfo.username + "/picture"}
                size={"md"}
              />
            </MenuButton>
            <MenuList bg={"black"} zIndex={10}>
              <br />
              <Center>
                <Avatar
                  src={"/api/account/" + userInfo.username + "/picture"}
                  size={"xl"}
                />
              </Center>
              <br />
              <Center>
                <Heading size={"lg"}>
                  {userInfo.firstName}&nbsp;{userInfo.lastName}
                </Heading>
              </Center>
              <Center>
                <Text color={"gray"}>@{userInfo.username}</Text>
              </Center>
              <MenuDivider />
              <Link href={"/dashboard"}>
                <MenuItem>Dashboard</MenuItem>
              </Link>
              <Link href={"/account/settings"}>
                <MenuItem>Einstellungen</MenuItem>
              </Link>
              <MenuItem
                color={"red"}
                onClick={() => {
                  localStorage.removeItem("token");
                }}
              >
                Abmelden
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      ) : null}
    </>
  );

  return (
    <>
      {!loggedIn ? (
        <>
          <Button
            variant={"solid"}
            onClick={() => {
              props.onClose();
              props.onUserAuthOpen();
            }}
            colorScheme={"whatsapp"}
          >
            Anmelden
          </Button>
        </>
      ) : (
        <>
          <Link href={"/dashboard"}>
            <Button
              variant={"solid"}
              colorScheme={"blue"}
              onClick={props.onClose}
            >
              Dashboard
            </Button>
          </Link>
          <Button
            variant={"solid"}
            colorScheme={"red"}
            onClick={() => {
              props.onClose();
              props.onLogoutOpen();
            }}
          >
            Abmelden
          </Button>
        </>
      )}
    </>
  );
}
