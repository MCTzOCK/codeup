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
  Grid,
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
  FaUser,
  FaUsers,
} from "react-icons/fa";
import PopupManager from "@codeup/web/src/global/PopupManager";
import { HiSwitchHorizontal } from "react-icons/hi";
import AccountManager from "@codeup/util/src/AccountManager";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import ReactCountryFlag from "react-country-flag";
import {
  FaChevronDown,
  FaDesktop,
  FaInfo,
  FaRightFromBracket,
  FaRobot,
  FaTableColumns,
} from "react-icons/fa6";

export default function MenuButtons(props: {
  onClose: () => void;
  onUserAuthOpen: () => void;
  onLogoutOpen: () => void;
}) {
  const { t } = useTranslation(["base", "navbar"]);
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
            {t("account.login", { ns: "navbar" })}
          </Button>
        </>
      ) : null}
      {loggedIn ? (
        <>
          <HStack gap={6}>
            <IconButton
              aria-label={"Cloud-PC"}
              icon={<FaDesktop size={"28"} />}
              size={"lg"}
              borderRadius={"full"}
              variant={"outline"}
              as={"a"}
              href={"/cloud-pc/attach"}
            />
            <IconButton
              aria-label={"Artificial Intelligence"}
              icon={<FaRobot size={"28"} />}
              size={"lg"}
              borderRadius={"full"}
              variant={"outline"}
              as={"a"}
              href={"/ai"}
            />
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
              <MenuList
                bg={"#000"}
                zIndex={10}
                style={{
                  maxWidth: "250px",
                  overflow: "auto",
                }}
              >
                <IconButton
                  size={"sm"}
                  variant={"ghost"}
                  colorScheme={"red"}
                  aria-label={"Logout"}
                  icon={<FaRightFromBracket />}
                  onClick={() => {
                    props.onClose();
                    props.onLogoutOpen();
                  }}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
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
                    <MenuItem
                      w={"100%"}
                      as={"a"}
                      href={"/account/level"}
                      bg={"#000"}
                      _hover={{
                        bg: "#121212",
                      }}
                    >
                      <Box w={"100%"}>
                        <Text textAlign={"center"} fontWeight={"bold"}>
                          {t("account.level", { ns: "navbar" })}{" "}
                          {levelProgress.level}
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
                      <Text textAlign={"center"}>
                        {t("account.level.loading", { ns: "navbar" })}
                      </Text>
                    )}
                  </>
                )}
                <MenuDivider />
                <Grid
                  templateColumns={"repeat(3, 1fr)"}
                  gap={4}
                  p={2}
                  maxW={"100%"}
                  cursor={"default"}
                >
                  <FancyButton
                    icon={
                      <FaPlus
                        color={"var(--chakra-colors-blue-300)"}
                        size={"24"}
                      />
                    }
                    title={t("products.creator", { ns: "navbar" })}
                    props={{
                      as: "a",
                      href: "/creator/studio",
                    }}
                  />
                  <FancyButton
                    icon={<FaUsers size={"24"} />}
                    title={t("account.switch", { ns: "navbar" })}
                    props={{
                      onClick: () => {
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
                                          <Badge
                                            colorScheme={"orange"}
                                            size={"lg"}
                                          >
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
                                        await AccountManager.addAccount(
                                          oldToken
                                        );

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
                          title: t("account.switch", { ns: "navbar" }),
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
                                  {t("account.switch.add", { ns: "navbar" })}
                                </Button>
                              </Stack>
                            </>
                          ),
                        });
                      },
                    }}
                  />
                  <FancyButton
                    icon={<FaSitemap size={"24"} />}
                    title={t("account.organisations", { ns: "navbar" })}
                    props={{
                      as: "a",
                      href: "/orgs",
                    }}
                  />
                  <FancyButton
                    icon={<FaTableColumns size={"24"} />}
                    title={t("account.dashboard", { ns: "navbar" })}
                    props={{
                      as: "a",
                      href: "/dashboard/v2",
                    }}
                  />
                  <FancyButton
                    icon={<FaUser size={"24"} />}
                    title={t("account.my.profile", { ns: "navbar" })}
                    props={{
                      as: "a",
                      href: "/u/" + userInfo.username,
                    }}
                  />
                  <FancyButton
                    icon={<FaCogs size={"24"} />}
                    title={t("account.settings", { ns: "navbar" })}
                    props={{
                      as: "a",
                      href: "/account/settings",
                    }}
                  />
                </Grid>
              </MenuList>
            </Menu>
          </HStack>
        </>
      ) : null}
    </>
  );
}

export function FancyButton(props: {
  icon: React.ReactNode;
  title: String;
  props: any;
}) {
  return (
    <>
      <Stack gap={1}>
        <Box
          {...props.props}
          bg={"#121212"}
          cursor={"default"}
          _hover={{
            bg: "#212121",
          }}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          p={2}
          borderRadius={"lg"}
          aspectRatio={"1/1"}
        >
          {props.icon}
        </Box>
        <Text fontSize={"sm"} color={"gray"} textAlign={"center"}>
          {props.title}
        </Text>
      </Stack>
    </>
  );
}
