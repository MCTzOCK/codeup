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
import { FaUserCircle } from "react-icons/fa";
import Head from "next/head";
import CodeUpModal from "@codeup/components/dist/codeup/CodeUpModal";
import * as qr from "qrcode";

export default function Settings() {
  const router = useRouter();
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  useEffect(() => {
    if (loaded && !loggedIn) {
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
      router.push("/#login");
    }
  }, [loaded, userInfo, loggedIn]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.has("component")) {
      switch (query.get("component")) {
        case "account":
          // @ts-ignore
          setCurrentComponent(<Account userInfo={userInfo} />);
          setCurrentSelected("account");
          break;
        default:
          setCurrentComponent(<Home userInfo={userInfo} />);
          setCurrentSelected("home");
          break;
      }
    } else {
      setCurrentComponent(<Home userInfo={userInfo} />);
      setCurrentSelected("home");
    }
    if (query.has("newToken")) {
      localStorage.setItem("token", query.get("newToken") as string);
    }

    console.log(userInfo);
  }, [userInfo]);

  const [currentComponent, setCurrentComponent] =
    React.useState<JSX.Element | null>(
      <>
        <Spinner size="xl" />
      </>
    );

  const [currentSelected, setCurrentSelected] = React.useState<string>("home");

  return (
    <>
      <Head>
        <title>Einstellungen - CodeUp</title>
      </Head>
      <Flex direction={["column", "row"]} minW={"100%"} minH={"100vh"}>
        <Flex
          direction={"column"}
          flex={"15%"}
          minH={"100%"}
          bgColor={useColorModeValue("gray.400", "gray.900")}
          p={"1.2rem"}
        >
          <Heading textAlign={"center"}>Einstellungen</Heading>
          <Button
            m={"1.2rem"}
            variant={currentSelected === "home" ? "solid" : "ghost"}
            leftIcon={<BsFillHouseDoorFill />}
            onClick={() => {
              setCurrentSelected("home");
              setCurrentComponent(<Home userInfo={userInfo} />);
              router.push("/account/settings?component=home");
            }}
          >
            Home
          </Button>
          <Button
            marginInline={"1.2rem"}
            variant={currentSelected === "account" ? "solid" : "ghost"}
            leftIcon={<FaUserCircle />}
            onClick={() => {
              setCurrentSelected("account");
              // @ts-ignore
              setCurrentComponent(<Account userInfo={userInfo} />);
              router.push("/account/settings?component=account");
            }}
          >
            Konto
          </Button>
        </Flex>
        <Flex direction={"column"} flex={"85%"} minH={"100%"}>
          {currentComponent}
        </Flex>
      </Flex>
    </>
  );
}

function Home(props: {
  userInfo: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}) {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      marginTop={"-2rem"}
      w={"100%"}
      h={"100vh"}
      direction={"column"}
      textAlign={"center"}
    >
      <Heading mb={"1.2rem"}>Willkommen, {props.userInfo.firstName}!</Heading>
      <Text>
        Hier kannst du dein Konto und andere Einstellungen anpassen, um CodeUp
        nach deinen Wünschen zu nutzen.
      </Text>
    </Flex>
  );
}

function Account(props: {
  userInfo: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    twoFactorEnabled: boolean;
    sso: string;
  };
}) {
  const [firstNameButtonDisabled, setFirstNameButtonDisabled] =
    React.useState<boolean>(false);
  const [lastNameButtonDisabled, setLastNameButtonDisabled] =
    React.useState<boolean>(false);
  const [emailButtonDisabled, setEmailButtonDisabled] =
    React.useState<boolean>(false);
  const [_2faButtonDisabled, set_2faButtonDisabled] =
    React.useState<boolean>(false);
  const [deleteAccountDisabled, setDeleteAccountDisabled] =
    React.useState<boolean>(false);
  const [changePasswordDisabled, setChangePasswordDisabled] =
    React.useState<boolean>(false);

  const [firstNameError, setFirstNameError] = React.useState<string | null>(
    null
  );
  const [lastNameError, setLastNameError] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null);

  const toast = useToast({
    position: "top",
    isClosable: true,
    duration: 6000,
    variant: "solid",
  });

  const router = useRouter();

  const [twoFactorURL, setTwoFactorURL] = React.useState<string | null>(null);

  const {
    onOpen: on2FASuccessOpen,
    isOpen: is2FASuccessOpen,
    onClose: on2FASuccessClose,
  } = useDisclosure();

  return (
    <>
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

      <Heading textAlign={"center"} mb={"1.2rem"} mt={"1.2rem"}>
        Konto verwalten
      </Heading>
      <SimpleGrid
        minChildWidth={250}
        spacing={"2rem"}
        margin={"2rem"}
        columns={1}
        maxW={"85%"}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setFirstNameButtonDisabled(true);
            setFirstNameError(null);

            // @ts-ignore
            const firstName = e.target.elements.firstName.value;

            if (firstName === "") {
              setFirstNameError("Vorname kann nicht leer sein!");
              setFirstNameButtonDisabled(false);
              return;
            }

            const res = await REST.Account.update({
              keyName: "firstName",
              keyValue: firstName,
              token: localStorage.getItem("token") as string,
            });

            if (res.payload.success) {
              localStorage.setItem("token", res.payload.newToken);
              setFirstNameButtonDisabled(false);
            } else {
              setFirstNameError(res.payload.error);
              setFirstNameButtonDisabled(false);
            }
          }}
        >
          <Flex direction={"column"}>
            <FormControl isInvalid={firstNameError !== null}>
              <FormLabel htmlFor="firstName">Vorname</FormLabel>
              <Input id="firstName" defaultValue={props.userInfo.firstName} />
              <FormErrorMessage>{firstNameError}</FormErrorMessage>
              <Button
                type="submit"
                disabled={firstNameButtonDisabled}
                isLoading={firstNameButtonDisabled}
                colorScheme="blue"
                marginBlock={"1.2rem"}
              >
                Aktualisieren
              </Button>
            </FormControl>
          </Flex>
        </form>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLastNameButtonDisabled(true);
            setLastNameError(null);

            // @ts-ignore
            const lastName = e.target.elements.lastName.value;

            if (lastName === "") {
              setLastNameError("Nachname kann nicht leer sein!");
              setLastNameButtonDisabled(false);
              return;
            }

            const res = await REST.Account.update({
              keyName: "lastName",
              keyValue: lastName,
              token: localStorage.getItem("token") as string,
            });

            if (res.payload.success) {
              localStorage.setItem("token", res.payload.newToken);
              setLastNameButtonDisabled(false);
            } else {
              setLastNameError(res.payload.error);
              setLastNameButtonDisabled(false);
            }
          }}
        >
          <Flex direction={"column"}>
            <FormControl isInvalid={lastNameError !== null}>
              <FormLabel htmlFor="lastName">Nachname</FormLabel>
              <Input id="lastName" defaultValue={props.userInfo.lastName} />
              <FormErrorMessage>{lastNameError}</FormErrorMessage>
              <Button
                type="submit"
                disabled={lastNameButtonDisabled}
                isLoading={lastNameButtonDisabled}
                colorScheme="blue"
                marginBlock={"1.2rem"}
              >
                Aktualisieren
              </Button>
            </FormControl>
          </Flex>
        </form>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setEmailButtonDisabled(true);
            setEmailError(null);

            // @ts-ignore
            const email = e.target.elements.email.value;

            if (
              !email.match(
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              )
            ) {
              setEmailError("E-Mail is invalid!");
              setEmailButtonDisabled(false);
              return;
            }

            const res = await REST.Account.update({
              keyName: "email",
              keyValue: email,
              token: localStorage.getItem("token") as string,
            });

            if (res.payload.success) {
              setEmailError(
                "Überprüfe deine E-Mails, um deine neue E-Mail-Adresse zu bestätigen."
              );
              setEmailButtonDisabled(false);
            } else {
              setEmailError(res.payload.error);
              setEmailButtonDisabled(false);
            }
          }}
        >
          <Flex direction={"column"}>
            <FormControl isInvalid={emailError !== null}>
              <FormLabel htmlFor="email">E-Mail</FormLabel>
              <Input
                id="email"
                defaultValue={props.userInfo.email}
                disabled={props.userInfo.sso !== "no-sso"}
              />
              <FormErrorMessage>{emailError}</FormErrorMessage>
              <Button
                type="submit"
                disabled={
                  props.userInfo.sso !== "no-sso" || emailButtonDisabled
                }
                isLoading={emailButtonDisabled}
                colorScheme="blue"
                marginBlock={"1.2rem"}
              >
                Aktualisieren
              </Button>
            </FormControl>
          </Flex>
        </form>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            set_2faButtonDisabled(true);

            if (!props.userInfo.twoFactorEnabled) {
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
                set_2faButtonDisabled(false);
              } else {
                set_2faButtonDisabled(false);
                toast({
                  title: "Fehler",
                  description: res.payload.error,
                  status: "error",
                  duration: 1500,
                  isClosable: true,
                  position: "bottom-right",
                });
              }
            } else {
              const res = await REST.Account.update2FA({
                token: localStorage.getItem("token") as string,
                enabled: false,
                code: prompt("2FA Code") as string,
              });

              if (res.status === 200) {
                localStorage.setItem("token", res.payload.newToken);
                set_2faButtonDisabled(false);
              } else {
                set_2faButtonDisabled(false);
                toast({
                  title: "Fehler",
                  description: res.payload.error,
                  status: "error",
                  duration: 1500,
                  isClosable: true,
                  position: "bottom-right",
                });
              }
            }
          }}
        >
          <Flex direction={"column"}>
            <FormControl>
              <FormLabel>2 Faktor</FormLabel>
              <Text>
                Wenn aktiviert, erhälst du, <b>jedes Mal</b>, wenn du versuchst
                dich anzumelden, eine E-Mail mit der du den Login authorisieren
                musst. Diese Option steht dir nicht zur Verfügung, wenn du dich
                mit einem SSO Anbieter angemeldet hast.
              </Text>
              <Button
                type="submit"
                disabled={props.userInfo.sso !== "no-sso" || _2faButtonDisabled}
                isLoading={_2faButtonDisabled}
                colorScheme={props.userInfo.twoFactorEnabled ? "red" : "green"}
                mt={"1.2rem"}
              >
                {props.userInfo.twoFactorEnabled
                  ? "Deaktivieren"
                  : "Aktivieren"}
              </Button>
            </FormControl>
          </Flex>
        </form>
        <Flex direction={"column"}>
          <FormControl>
            <FormLabel>Konto löschen</FormLabel>
            <Text>
              Lösche dein Konto, um <b>ALLE</b> von uns gespeicherten Daten zu
              löschen.&nbsp;
              <b>ACHTUNG:&nbsp;</b>
              Diese Aktion kann nicht rückgängig gemacht werden.
            </Text>
            <Popover>
              <PopoverTrigger>
                <Button colorScheme={"red"} mt={"1.2rem"}>
                  Konto löschen
                </Button>
              </PopoverTrigger>
              <PopoverContent bgColor={"black"}>
                <PopoverArrow bgColor={"black"} />
                <PopoverCloseButton />
                <PopoverHeader>Konto Löschen</PopoverHeader>
                <PopoverBody>
                  Bist du dir sicher, dass du dein Konto wirklich löschen
                  möchtest. Diese Aktion kann <b>NICHT</b> rückgängig gemacht
                  werden. Alle persönlichen Daten werden von unseren Servern
                  gelöscht. Diese können <b>NICHT</b> wiederhergestellt werden.
                  <Button
                    disabled={deleteAccountDisabled}
                    isLoading={deleteAccountDisabled}
                    colorScheme={"red"}
                    mt={"1.2rem"}
                    onClick={async () => {
                      setDeleteAccountDisabled(true);

                      const res = await REST.Account.deleteAccount(
                        localStorage.getItem("token") as string
                      );

                      localStorage.removeItem("token");
                      document.cookie = "jwt=;path=/";

                      await router.push("/");
                    }}
                  >
                    Wirklich löschen
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </FormControl>
        </Flex>
        <Flex direction={"column"}>
          <FormControl>
            <FormLabel>Passwort ändern</FormLabel>
            <Text>
              Wenn du das Passwort deines Account änderst, wirst du nicht
              automatisch von allen Geräten abgemeldet. Diesen Schritt musst du
              manuell durchführen. Diese Option steht dir nicht zur Verfügung,
              wenn du dich mit einem SSO Anbieter angemeldet hast.
            </Text>
            <Popover>
              <PopoverTrigger>
                <Button
                  mt={"1.2rem"}
                  colorScheme={"blue"}
                  disabled={props.userInfo.sso !== "no-sso"}
                >
                  Passwort ändern
                </Button>
              </PopoverTrigger>
              <PopoverContent bgColor={"black"}>
                <PopoverArrow bgColor={"black"} />
                <PopoverCloseButton />
                <PopoverHeader>Passwort ändern</PopoverHeader>
                <PopoverBody>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setChangePasswordDisabled(true);

                      const res = await REST.Account.update({
                        keyName: "password",
                        // @ts-ignore
                        keyValue: e.target.elements.password.value,
                        token: localStorage.getItem("token") as string,
                      });

                      if (res.status === 200) {
                        toast({
                          status: "success",
                          title: "Erfolgreich",
                          description:
                            "Dein Passwort wurde erfolgreich geändert.",
                        });
                        setChangePasswordDisabled(false);
                      } else {
                        toast({
                          status: "error",
                          title: "Fehler",
                          description: res.payload.error,
                        });
                        setChangePasswordDisabled(false);
                      }
                    }}
                  >
                    <FormControl>
                      <FormLabel>Passwort</FormLabel>
                      <Input
                        placeholder={"Passwort"}
                        name={"password"}
                        id={"password"}
                        type={"password"}
                      />
                    </FormControl>
                    <Button
                      type={"submit"}
                      disabled={changePasswordDisabled}
                      isLoading={changePasswordDisabled}
                      mt={"1.2rem"}
                    >
                      Passwort ändern
                    </Button>
                  </form>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </FormControl>
        </Flex>
      </SimpleGrid>
    </>
  );
}
