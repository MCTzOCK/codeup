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
  Progress,
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
  FaCrown,
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

  const [levelError, setLevelError] = React.useState<string | null>(null);

  const [levelProgress, setLevelProgress] = React.useState<{
    level: number;
    xp: number;
    xpNeeded: number;
    transactions: {
      xp: number;
      reason: string;
      createdAt: Date;
    }[];
  } | null>(null);

  const reloadLevel = async () => {
    const res = await REST.Account.getLevelProgress(
      AccountManager.getActiveToken()
    );

    if (res.status === 200) {
      setLevelProgress(res.payload.data);
    } else {
      setLevelError(res.payload.error);
    }
  };

  React.useEffect(() => {
    reloadLevel();
  }, []);

  return (
    <>
      {!loggedIn ? (
        <>
          <Button
            onClick={() => {
              props.onClose();
              props.onUserAuthOpen();
            }}
            variant={"brand"}
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
                />
              </MenuButton>
              <MenuList bg={"#000"} zIndex={10}>
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
                <Center display={"flex"} alignItems={"center"} gap={2}>
                  <Text color={"gray"}>@{userInfo.username}</Text>
                  {userInfo.subscription === "PRO" ||
                  userInfo.role === "admin" ? (
                    <Badge colorScheme={"brand"}>PRO</Badge>
                  ) : null}
                </Center>
                <MenuDivider />
                {levelProgress ? (
                  <>
                    <MenuItem w={"100%"} as={"a"} href={"/account/level"}>
                      <Box w={"100%"}>
                        <Text textAlign={"center"} fontWeight={"bold"}>
                          Level {levelProgress.level}
                        </Text>
                        <Progress
                          rounded={"md"}
                          value={levelProgress.xp}
                          max={levelProgress.xpNeeded}
                          variant={"brand"}
                        />
                        <Text textAlign={"center"}>
                          {levelProgress.xp} / {levelProgress.xpNeeded} XP
                        </Text>
                      </Box>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    {levelError ? (
                      <Text textAlign={"center"}>{levelError}</Text>
                    ) : (
                      <Text textAlign={"center"}>Level wird geladen...</Text>
                    )}
                  </>
                )}
                <MenuDivider />
                {userInfo.subscription === "FREE" && userInfo.role !== "admin" && (
                  <MenuItem
                    onClick={async () => {
                      const res = await REST.Payments.createCheckoutLink(
                        AccountManager.getActiveToken()
                      );

                      if (res.status === 200) {
                        window.location.href = res.payload.url;
                      } else {
                        PopupManager.alert({
                          title: "Fehler",
                          description:
                            "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut: " +
                            res.payload.error,
                        });
                      }
                    }}
                    color={"orange.400"}
                    fontWeight={"bold"}
                    icon={<FaCrown />}
                  >
                    Upgrade auf PRO
                  </MenuItem>
                )}
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
                      pro: boolean;
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
                                  <HStack>
                                    <Text color={"gray"}>
                                      @{props.username}
                                    </Text>
                                    {props.pro && (
                                      <Badge colorScheme={"orange"} size={"lg"}>
                                        PRO
                                      </Badge>
                                    )}
                                  </HStack>
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
                              pro={userInfo.subscription === "PRO"}
                            />
                            {AccountManager.getAccounts().map((account) => (
                              <>
                                <UserCard
                                  firstName={account.firstName}
                                  lastName={account.lastName}
                                  username={account.username}
                                  pro={userInfo.subscription === "PRO"}
                                />
                                <StackDivider />
                              </>
                            ))}
                            <StackDivider />
                            <Button
                              variant={"brand"}
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
                <Link href={"/dashboard/v2"}>
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
