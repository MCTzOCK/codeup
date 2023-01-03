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
  AvatarBadge,
  Badge,
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
import { FiAlertTriangle, FiPlus } from "react-icons/fi";
import { useEffect } from "react";
import REST from "@codeup/rest";

export default function MenuButtons(props: {
  onClose: () => void;
  onUserAuthOpen: () => void;
  onLogoutOpen: () => void;
}) {
  const { loggedIn, userInfo } = useLoggedIn();

  const [contactCount, setContactCount] = React.useState(0);

  useEffect(() => {
    if (userInfo.role === "admin") {
      reload();
      const i = setInterval(reload, 20000);
      return () => clearInterval(i);
    }
  }, [userInfo]);

  const reload = () => {
    if (userInfo.role === "admin") {
      REST.Admin.getContactMessageCount(
        localStorage.getItem("token") as string
      ).then((res) => {
        if (res.status === 200) {
          setContactCount(res.payload.count);
        }
      });
    }
  };

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
              >
                {userInfo.role === "admin" && contactCount > 0 ? (
                  <>
                    <AvatarBadge boxSize={"1.5em"} bg={"red.500"}>
                      {contactCount < 9 ? contactCount : "9+"}
                    </AvatarBadge>
                  </>
                ) : null}
              </Avatar>
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
              {userInfo.role === "admin" ? (
                <>
                  <Link href={"/admin/users"}>
                    <MenuItem
                      color={"red.300"}
                      fontWeight={"bold"}
                      icon={<FiAlertTriangle />}
                    >
                      ADMIN&nbsp;
                      <Badge color={"red"}>
                        {contactCount < 9 ? contactCount : "9+"}
                      </Badge>
                    </MenuItem>
                  </Link>
                </>
              ) : null}
              {["admin", "editor"].includes(userInfo.role) ? (
                <>
                  <Link href={"/creator/studio"}>
                    <MenuItem
                      color={"blue.300"}
                      fontWeight={"bold"}
                      icon={<FiPlus />}
                    >
                      CREATOR STUDIO
                    </MenuItem>
                  </Link>
                </>
              ) : null}

              <MenuDivider />
              <Link href={"/dashboard"}>
                <MenuItem>Dashboard</MenuItem>
              </Link>
              <Link href={"/account/settings"}>
                <MenuItem>Einstellungen</MenuItem>
              </Link>
              <MenuItem
                color={"red.300"}
                onClick={() => {
                  props.onLogoutOpen();
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
