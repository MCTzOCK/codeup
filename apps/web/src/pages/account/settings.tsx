/**
 * src/pages/settings.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useLoggedIn } from "@codeup/hooks";
import REST from "@codeup/rest";
import { default as redirect } from "@codeup/util/src/userworkflow/redirect";
import { useRouter } from "next/router";
import * as React from "react";
import { useEffect } from "react";
import { BsFillHouseDoorFill } from "react-icons/bs";
import {
  FaCrown,
  FaInfo,
  FaLock,
  FaPen,
  FaTimes,
  FaTrash,
  FaUnlock,
  FaUserCircle,
} from "react-icons/fa";
import Head from "next/head";
import CodeUpModal from "@codeup/components/dist/codeup/CodeUpModal";
import GridLayout from "@codeup/components/global/GridLayout";
import * as qr from "qrcode";
import PopupManager from "../../global/PopupManager";
import { IoWarning } from "react-icons/io5";
import AccountManager from "@codeup/util/dist/AccountManager";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Settings() {
  const router = useRouter();
  const { userInfo, loggedIn, loaded } = useLoggedIn();
  const { t } = useTranslation("account");

  useEffect(() => {
    if (loaded && !loggedIn) {
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
      router.push("/#login");
    }
  }, [loaded, userInfo, loggedIn]);

  const [currentComponent, setCurrentComponent] =
    React.useState<JSX.Element | null>(
      <>
        <Spinner size="xl" />
      </>
    );

  const [currentSelected, setCurrentSelected] = React.useState<string>("home");

  const [twoFactorURL, setTwoFactorURL] = React.useState<string | null>(null);

  const {
    onOpen: on2FASuccessOpen,
    isOpen: is2FASuccessOpen,
    onClose: on2FASuccessClose,
  } = useDisclosure();

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>

      <Box bg={"#000"} h={"fit-content"} minH={"100vh"}>
        <Flex pt={6} pb={6} w={"100%"} justifyContent={"center"}>
          <CHeading size={"xl"}>{t("title")}</CHeading>
        </Flex>

        <Flex alignItems={"center"} justifyContent={"center"}>
          <Box
            maxW={["90%", "90%", "60%"]}
            bg={"gray.900"}
            p={4}
            rounded={"xl"}
            minW={["100px", "200px", "400px"]}
          >
            <Stack gap={2}>
              <FormControl>
                <FormLabel>{t("name.first")}</FormLabel>
                <Input
                  id={"sett.firstname"}
                  placeholder={t("name.first")}
                  defaultValue={userInfo.firstName}
                />
              </FormControl>
              <Button
                variant={"brand"}
                onClick={async () => {
                  const newName = (
                    document.getElementById(
                      "sett.firstname"
                    ) as HTMLInputElement
                  ).value;

                  if (!newName) return;

                  const res = await REST.Account.update({
                    keyName: "firstName",
                    keyValue: newName,
                    token: localStorage.getItem("token") as string,
                  });

                  if (res.payload.success) {
                    localStorage.setItem("token", res.payload.newToken);
                    PopupManager.alert({
                      title: t("success"),
                      description: t("success.name.first"),
                    });
                  } else {
                    PopupManager.alert({
                      title: t("control.error", { ns: "base" }),
                      description: res.payload.message,
                    });
                  }
                }}
              >
                {t("save")}
              </Button>
            </Stack>
            <Stack gap={2} mt={2}>
              <FormControl>
                <FormLabel>{t("name.last")}</FormLabel>
                <Input
                  id={"sett.lastname"}
                  placeholder={t("name.last")}
                  defaultValue={userInfo.lastName}
                />
              </FormControl>
              <Button
                variant={"brand"}
                onClick={async () => {
                  const newName = (
                    document.getElementById("sett.lastname") as HTMLInputElement
                  ).value;

                  if (!newName) return;

                  const res = await REST.Account.update({
                    keyName: "lastName",
                    keyValue: newName,
                    token: localStorage.getItem("token") as string,
                  });

                  if (res.payload.success) {
                    localStorage.setItem("token", res.payload.newToken);
                    PopupManager.alert({
                      title: t("success"),
                      description: t("success.name.last"),
                    });
                  } else {
                    PopupManager.alert({
                      title: t("control.error", { ns: "base" }),
                      description: res.payload.message,
                    });
                  }
                }}
              >
                {t("save")}
              </Button>
            </Stack>
            <Stack gap={2} mt={2}>
              <FormControl>
                <FormLabel>{t("email")}</FormLabel>
                <Input
                  id={"sett.email"}
                  placeholder={t("email")}
                  defaultValue={userInfo.email}
                />
              </FormControl>
              <Button
                variant={"brand"}
                onClick={async () => {
                  const newMail = (
                    document.getElementById("sett.lastname") as HTMLInputElement
                  ).value;
                  if (
                    !newMail.match(
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )
                  ) {
                    PopupManager.alert({
                      title: t("control.error", { ns: "base" }),
                      description: t("failed.email"),
                    });
                    return;
                  }

                  const res = await REST.Account.update({
                    keyName: "email",
                    keyValue: newMail,
                    token: localStorage.getItem("token") as string,
                  });

                  if (res.payload.success) {
                    localStorage.setItem("token", res.payload.newToken);
                    PopupManager.alert({
                      title: t("success"),
                      description: t("success.email"),
                    });
                  } else {
                    PopupManager.alert({
                      title: t("control.error", { ns: "base" }),
                      description: res.payload.message,
                    });
                  }
                }}
              >
                {t("save")}
              </Button>
            </Stack>
            <Stack gap={2} mt={2}>
              <FormControl>
                <FormLabel>{t("2fa")}</FormLabel>
                <Button
                  w={"100%"}
                  variant={"brand"}
                  onClick={async () => {
                    // @ts-ignore
                    if (!userInfo.twoFactorEnabled) {
                      const res = await REST.Account.update2FA({
                        token: localStorage.getItem("token") as string,
                        enabled: true,
                      });

                      if (res.status === 200) {
                        setTwoFactorURL(
                          (await qr.toCanvas(res.payload.url)).toDataURL()
                        );

                        on2FASuccessOpen();

                        localStorage.setItem("token", res.payload.newToken);
                      } else {
                        PopupManager.alert({
                          title: t("control.error", { ns: "base" }),
                          description: t("2fa.failed") + res.payload.error,
                        });
                      }
                    } else {
                      const code = await PopupManager.promptAsync({
                        title: t("2fa.disable"),
                        helperText: t("2fa.disable.text"),
                      });

                      const res = await REST.Account.update2FA({
                        token: localStorage.getItem("token") as string,
                        enabled: false,
                        code: code,
                      });

                      if (res.status === 200) {
                        localStorage.setItem("token", res.payload.newToken);
                        PopupManager.alert({
                          title: t("success"),
                          description: t("2fa.disabled"),
                        });
                      } else {
                        PopupManager.alert({
                          title: t("control.error", { ns: "base" }),
                          description: t("2fa.failed") + res.payload.error,
                        });
                      }
                    }
                  }}
                >
                  {
                    // @ts-ignore
                    userInfo.twoFactorEnabled ? t("deactivate") : t("activate")
                  }
                </Button>
              </FormControl>
            </Stack>
            <Stack gap={2} mt={2}>
              <FormControl>
                <FormLabel>{t("password")}</FormLabel>
                <Button
                  w={"100%"}
                  variant={"brand"}
                  onClick={async () => {
                    const newPassword = await PopupManager.promptAsync({
                      title: t("password.change"),
                      helperText: t("password.change.text"),
                    });

                    if (!newPassword) return;

                    const newPasswordRepeat = await PopupManager.promptAsync({
                      title: t("password.change"),
                      helperText: t("password.change.repeat"),
                    });

                    if (!newPasswordRepeat) return;

                    if (newPassword !== newPasswordRepeat) {
                      PopupManager.alert({
                        title: t("control.error", { ns: "base" }),
                        description: t("password.change.failed"),
                      });
                      return;
                    }

                    const res = await REST.Account.update({
                      keyName: "password",
                      keyValue: newPassword,
                      token: AccountManager.getActiveToken(),
                    });

                    if (res.status === 200) {
                      PopupManager.alert({
                        title: t("success"),
                        description: t("password.change.success"),
                      });
                      return;
                    }

                    PopupManager.alert({
                      title: t("control.error", { ns: "base" }),
                      description:
                        t("password.change.failed.unknown") + res.payload.error,
                    });
                  }}
                >
                  {t("password.change")}
                </Button>
              </FormControl>
            </Stack>
            <Stack gap={2} mt={2}>
              <FormControl>
                <FormLabel>
                  CodeUp PRO (
                  {userInfo.subscription === "PRO"
                    ? t("active")
                    : t("inactive")}
                  )
                </FormLabel>
                <Button
                  w={"100%"}
                  variant={"brand"}
                  onClick={async () => {
                    if (userInfo.subscription === "PRO") {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: t("cancel"),
                          question: t("cancel.confirm"),
                        }))
                      ) {
                        return;
                      }

                      const res = await REST.Payments.cancelSubscription(
                        AccountManager.getActiveToken()
                      );
                      if (res.status === 200) {
                        await PopupManager.alertAsync({
                          title: t("success"),
                          description: t("cancel.success"),
                        });
                        AccountManager.overrideActiveToken(res.payload.jwt);
                      } else {
                        PopupManager.alert({
                          title: t("control.error", { ns: "base" }),
                          description: t("cancel.failed") + res.payload.error,
                        });
                      }
                    } else {
                      const res = await REST.Payments.createCheckoutLink(
                        AccountManager.getActiveToken()
                      );

                      if (res.status === 200) {
                        window.location.href = res.payload.url;
                      } else {
                        PopupManager.alert({
                          title: t("control.error", { ns: "base" }),
                          description:
                            t("control.error.request", { ns: "base" }) +
                            res.payload.error,
                        });
                      }
                    }
                  }}
                >
                  {
                    // @ts-ignore
                    userInfo.subscription === "PRO"
                      ? t("cancel")
                      : t("activate")
                  }
                </Button>
              </FormControl>
            </Stack>
            <Stack gap={2} mt={2}>
              <FormControl>
                <FormLabel>{t("account.delete")}</FormLabel>
                <Text>{t("account.delete.text")}</Text>
                <Button
                  w={"100%"}
                  colorScheme={"red"}
                  onClick={async () => {
                    if (
                      !(await PopupManager.confirmAsync({
                        title: t("account.delete"),
                        question: t("account.delete.confirm"),
                      }))
                    )
                      return;

                    const res = await REST.Account.deleteAccount(
                      localStorage.getItem("token") as string
                    );

                    localStorage.removeItem("token");
                    document.cookie = "jwt=;path=/";

                    await router.push("/");
                  }}
                  textTransform={"uppercase"}
                >
                  {t("account.delete")}
                </Button>
              </FormControl>
            </Stack>
          </Box>
        </Flex>
      </Box>

      <CodeUpModal
        onOpen={on2FASuccessOpen}
        onClose={on2FASuccessClose}
        isOpen={is2FASuccessOpen}
        title={t("2fa")}
      >
        <Text mb={"2rem"} fontSize={"lg"}>
          {t("2fa.modal.text")}{" "}
          <Link href={"https://authy.com/"} isExternal color={"blue.400"}>
            Authy
          </Link>
        </Text>
        <Flex alignItems={"center"} w={"100%"} justifyContent={"center"}>
          <img src={twoFactorURL as string} />
        </Flex>
      </CodeUpModal>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["account"])),
  };
}
