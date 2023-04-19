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
  Box,
  Button,
  ButtonGroup,
  Center,
  chakra,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  StackDivider,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useLoggedIn } from "@codeup/hooks";
import Link from "next/link";
import { FiAlertTriangle, FiPlus, FiRepeat, FiShuffle } from "react-icons/fi";
import { useEffect } from "react";
import REST from "@codeup/rest";
import {
  FaCheck,
  FaCogs,
  FaPlus,
  FaSitemap,
  FaTrash,
  FaUsers,
} from "react-icons/fa";
import PopupManager from "@codeup/web/src/global/PopupManager";
import { HiSwitchHorizontal } from "react-icons/hi";
import AccountManager from "@codeup/util/src/AccountManager";
import { useRouter } from "next/router";

export default function MenuButtons(props: {
  onClose: () => void;
  onUserAuthOpen: () => void;
  onLogoutOpen: () => void;
}) {
  const { loggedIn, userInfo } = useLoggedIn();
  const router = useRouter();

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
          <HStack gap={[6, 2]}>
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
                <MenuItem
                  icon={<FaPlus />}
                  onClick={() => {
                    router.push("/creator/studio");
                  }}
                  color={"blue.300"}
                  fontWeight={"bold"}
                >
                  Creator
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  icon={<FaUsers />}
                  onClick={() => {
                    const UserCard = (props: {
                      username: string;
                      firstName: string;
                      lastName: string;
                    }) => {
                      return (
                        <>
                          <HStack
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            <Box>
                              <HStack display={"flex"}>
                                <Avatar
                                  src={
                                    "/api/account/" +
                                    props.username +
                                    "/picture"
                                  }
                                  size={"lg"}
                                />
                                <Stack>
                                  <Heading size={"lg"}>
                                    {props.firstName}&nbsp;{props.lastName}
                                  </Heading>
                                  <Text color={"gray"}>@{props.username}</Text>
                                </Stack>
                              </HStack>
                            </Box>
                            {userInfo.username !== props.username ? (
                              <ButtonGroup isAttached>
                                <IconButton
                                  aria-label={"switch"}
                                  icon={<HiSwitchHorizontal />}
                                  onClick={async () => {
                                    const oldToken = localStorage.getItem(
                                      "token"
                                    ) as string;
                                    const ac =
                                      AccountManager.getAccounts().find(
                                        (a) => a.username === props.username
                                      );
                                    const newToken = ac!.token;

                                    AccountManager.removeAccount(ac!);
                                    await AccountManager.addAccount(oldToken);

                                    localStorage.setItem("token", newToken);

                                    PopupManager.removeCurrentPopup();
                                  }}
                                />
                                <IconButton
                                  aria-label={"delete"}
                                  icon={<FaTrash />}
                                  onClick={async () => {
                                    const ac =
                                      AccountManager.getAccounts().find(
                                        (a) => a.username === props.username
                                      );
                                    AccountManager.removeAccount(ac!);
                                    PopupManager.removeCurrentPopup();
                                  }}
                                />
                              </ButtonGroup>
                            ) : (
                              <>
                                <chakra.span color={"green.400"}>
                                  <FaCheck />
                                </chakra.span>
                              </>
                            )}
                          </HStack>
                        </>
                      );
                    };

                    PopupManager.alert({
                      title: "Account wechseln",
                      description: (
                        <>
                          <Stack w={"100%"}>
                            <UserCard
                              firstName={userInfo.firstName}
                              lastName={userInfo.lastName}
                              username={userInfo.username}
                            />
                            {AccountManager.getAccounts().map((account) => (
                              <>
                                <UserCard
                                  firstName={account.firstName}
                                  lastName={account.lastName}
                                  username={account.username}
                                />
                                <StackDivider />
                              </>
                            ))}
                            <StackDivider />
                            <Button
                              colorScheme={"green"}
                              leftIcon={<FaPlus />}
                              onClick={async () => {
                                await AccountManager.addAccount(
                                  localStorage.getItem("token") as string
                                );
                                localStorage.removeItem("token");

                                PopupManager.removeCurrentPopup();

                                window.dispatchEvent(
                                  new CustomEvent("codeup::open_login")
                                );
                              }}
                            >
                              Hinzufügen
                            </Button>
                          </Stack>
                        </>
                      ),
                    });
                  }}
                >
                  Account wechseln
                </MenuItem>
                <Link href={"/orgs"}>
                  <MenuItem icon={<FaSitemap />}>Organisationen</MenuItem>
                </Link>
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
            {userInfo.role === "admin" ? (
              <Tooltip
                label={`
                Du bist als Admin angemeldet.
                Du kannst alle Funktionen nutzen und auf die Admin-Seite zugreifen.
                Nutze deine Berechtigungen nicht aus und verhalte dich fair.
                `}
              >
                <Avatar
                  size={"md"}
                  backgroundColor={"red.200"}
                  icon={<FaCogs />}
                  cursor={"pointer"}
                  onClick={() => {
                    router.push("/admin");
                  }}
                />
              </Tooltip>
            ) : null}
          </HStack>
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
