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
  FaInfo,
  FaLock,
  FaPen,
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

export default function Settings() {
  const router = useRouter();
  const { userInfo, loggedIn, loaded } = useLoggedIn();

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
        <title>Einstellungen - CodeUp</title>
      </Head>

      <Heading textAlign={"center"} mt={6} mb={6} size={"xl"}>
        Konto Einstellungen
      </Heading>

      <CodeUpModal
        onOpen={on2FASuccessOpen}
        onClose={on2FASuccessClose}
        isOpen={is2FASuccessOpen}
        title={"2-Faktor-Authentifizierung"}
      >
        <Text mb={"2rem"} fontSize={"lg"}>
          Scanne den folgenden QR-Code mit deiner Authentifizierungs-App, um die
          2-Faktor-Authentifizierung zu aktivieren. Wenn du noch keine
          Authentifizierungs-App hast, empfehlen wir dir{" "}
          <Link href={"https://authy.com/"} isExternal color={"blue.400"}>
            Authy
          </Link>
        </Text>
        <Flex alignItems={"center"} w={"100%"} justifyContent={"center"}>
          <img src={twoFactorURL as string} />
        </Flex>
      </CodeUpModal>

      <GridLayout
        search={{
          allow: false,
          searchFields: false,
        }}
        specialEntries={[]}
        entries={[
          {
            title: "Vorname",
            fields: [
              {
                text: "Aktueller Vorname: " + userInfo.firstName,
                icon: <FaInfo />,
              },
            ],
            buttonRows: [
              {
                buttons: [
                  {
                    text: "Bearbeiten",
                    icon: <FaPen />,
                    colorScheme: "blue",
                    onClick: async () => {
                      const newName = await PopupManager.promptAsync({
                        title: "Vornamen ändern",
                        helperText: "Bitte gebe deinen neuen Vornamen ein",
                      });

                      if (!newName) return;

                      const res = await REST.Account.update({
                        keyName: "firstName",
                        keyValue: newName,
                        token: localStorage.getItem("token") as string,
                      });

                      if (res.payload.success) {
                        localStorage.setItem("token", res.payload.newToken);
                        PopupManager.alert({
                          title: "Erfolgreich",
                          description:
                            "Dein Vorname wurde erfolgreich geändert!",
                        });
                      } else {
                        PopupManager.alert({
                          title: "Fehler",
                          description: res.payload.message,
                        });
                      }
                    },
                  },
                ],
              },
            ],
          },
          {
            title: "Nachname",
            fields: [
              {
                text: "Aktueller Nachname: " + userInfo.lastName,
                icon: <FaInfo />,
              },
            ],
            buttonRows: [
              {
                buttons: [
                  {
                    text: "Bearbeiten",
                    icon: <FaPen />,
                    colorScheme: "blue",
                    onClick: async () => {
                      const newName = await PopupManager.promptAsync({
                        title: "Nachnamen ändern",
                        helperText: "Bitte gebe deinen neuen Nachnamen ein",
                      });

                      if (!newName) return;

                      const res = await REST.Account.update({
                        keyName: "lastName",
                        keyValue: newName,
                        token: localStorage.getItem("token") as string,
                      });

                      if (res.payload.success) {
                        localStorage.setItem("token", res.payload.newToken);
                        PopupManager.alert({
                          title: "Erfolgreich",
                          description:
                            "Dein Nachname wurde erfolgreich geändert!",
                        });
                      } else {
                        PopupManager.alert({
                          title: "Fehler",
                          description: res.payload.message,
                        });
                      }
                    },
                  },
                ],
              },
            ],
          },
          {
            title: "E-Mail",
            fields: [
              {
                text: "Aktuelle E-Mail: " + userInfo.email,
                icon: <FaInfo />,
              },
            ],
            buttonRows: [
              {
                buttons: [
                  {
                    text: "Bearbeiten",
                    icon: <FaPen />,
                    colorScheme: "blue",
                    onClick: async () => {
                      const newMail = await PopupManager.promptAsync({
                        title: "E-Mail ändern",
                        helperText: "Bitte gebe deine neue E-Mail Adresse ein",
                      });

                      if (!newMail) return;

                      if (
                        !newMail.match(
                          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        )
                      ) {
                        PopupManager.alert({
                          title: "Fehler",
                          description: "Die E-Mail Adresse ist ungültig!",
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
                          title: "Erfolgreich",
                          description:
                            "Überprüfe dein Postfach, um deine neue E-Mail Adresse zu bestätigen!",
                        });
                      } else {
                        PopupManager.alert({
                          title: "Fehler",
                          description: res.payload.message,
                        });
                      }
                    },
                  },
                ],
              },
            ],
          },
          {
            title: "Zwei Faktor Authentifizierung",
            fields: [
              {
                text:
                  "Aktueller Status: " +
                  // @ts-ignore
                  (userInfo.twoFactorEnabled ? "Aktiv" : "Inaktiv"),
                icon: <FaInfo />,
              },
            ],
            buttonRows: [
              {
                buttons: [
                  {
                    text:
                      // @ts-ignore
                      userInfo.twoFactorEnabled ? "Deaktivieren" : "Aktivieren",
                    icon:
                      // @ts-ignore
                      userInfo.twoFactorEnabled ? <FaLock /> : <FaUnlock />,
                    colorScheme:
                      // @ts-ignore
                      userInfo.twoFactorEnabled ? "red" : "green",
                    onClick: async () => {
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
                            title: "Fehler",
                            description:
                              "Zwei Faktor Authentifizierung fehlgeschlagen: " +
                              res.payload.error,
                          });
                        }
                      } else {
                        const code = await PopupManager.promptAsync({
                          title: "Zwei Faktor Authentifizierung deaktivieren",
                          helperText:
                            "Bitte gebe den Code aus deiner Authentifizierungs App ein",
                        });

                        const res = await REST.Account.update2FA({
                          token: localStorage.getItem("token") as string,
                          enabled: false,
                          code: code,
                        });

                        if (res.status === 200) {
                          localStorage.setItem("token", res.payload.newToken);
                          PopupManager.alert({
                            title: "Erfolgreich",
                            description:
                              "Zwei Faktor Authentifizierung erfolgreich deaktiviert!",
                          });
                        } else {
                          PopupManager.alert({
                            title: "Fehler",
                            description:
                              "Zwei Faktor Authentifizierung fehlgeschlagen: " +
                              res.payload.error,
                          });
                        }
                      }
                    },
                  },
                ],
              },
            ],
          },
          {
            title: "Konto löschen",
            fields: [
              {
                text: "DIESE AKTION KANN NICHT RÜCKGÄNGIG GEMACHT WERDEN!",
                icon: <IoWarning />,
              },
            ],
            buttonRows: [
              {
                buttons: [
                  {
                    text: "LÖSCHEN",
                    icon: <FaTrash />,
                    colorScheme: "red",
                    onClick: async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: "Konto löschen",
                          question:
                            "Bist du dir sicher, dass du dein Konto löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden!",
                        }))
                      )
                        return;

                      const res = await REST.Account.deleteAccount(
                        localStorage.getItem("token") as string
                      );

                      localStorage.removeItem("token");
                      document.cookie = "jwt=;path=/";

                      await router.push("/");
                    },
                  },
                ],
              },
            ],
          },
          {
            title: "Passwort",
            fields: [
              {
                text: "Passwort deines Kontos ändern",
                icon: <FaInfo />,
              },
            ],
            buttonRows: [
              {
                buttons: [
                  {
                    text: "Ändern",
                    icon: <FaPen />,
                    colorScheme: "blue",
                    onClick: async () => {
                      const newPassword = await PopupManager.promptAsync({
                        title: "Passwort ändern",
                        helperText: "Bitte gebe dein neues Passwort ein",
                      });

                      if (!newPassword) return;

                      const newPasswordRepeat = await PopupManager.promptAsync({
                        title: "Passwort ändern",
                        helperText: "Bitte wiederhole dein neues Passwort",
                      });

                      if (!newPasswordRepeat) return;

                      if (newPassword !== newPasswordRepeat) {
                        PopupManager.alert({
                          title: "Fehler",
                          description: "Die Passwörter stimmen nicht überein!",
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
                          title: "Erfolgreich",
                          description: "Passwort erfolgreich geändert!",
                        });
                        return;
                      }

                      PopupManager.alert({
                        title: "Fehler",
                        description:
                          "Passwort konnte nicht geändert werden: " +
                          res.payload.error,
                      });
                    },
                  },
                ],
              },
            ],
          },
        ]}
      />
    </>
  );
}
