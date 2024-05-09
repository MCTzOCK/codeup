/**
 * apps/web/src/pages/pricing.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.06.23
 *
 */
import {
  chakra,
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  Button,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { BiCheck, BiCrown, BiX } from "react-icons/bi";
import { useLoggedIn } from "@codeup/hooks";
import React from "react";
import { Card, CardHeader } from "@chakra-ui/card";
import { FaCrown } from "react-icons/fa";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../global/PopupManager";
import { CHeading } from "@codeup/components/global/CHeading";

export default function Pricing(props: { ENABLE_PAYMENTS: boolean }) {
  const { userInfo, loggedIn } = useLoggedIn();

  return (
    <>
      <Flex
        w={"100%"}
        minH={"100vh"}
        h={"fit-content"}
        alignItems={"center"}
        direction={"column"}
        p={8}
        bg={"#000"}
      >
        <Box>
          <Heading
            as={"h1"}
            size={"2xl"}
            fontWeight={900}
            letterSpacing={-2}
            fontFamily={"Jetbrains Mono ExtraBold"}
            color={"brand.500"}
          >
            Preisgestaltung
          </Heading>
        </Box>
        <Box w={["100%", "60%"]}>
          <Flex
            direction={["column", "column", "row"]}
            justifyContent={"center"}
            mt={8}
            gap={16}
          >
            <Stack
              bg={"black"}
              p={6}
              rounded={"xl"}
              gap={8}
              w={"100%"}
              shadow={"xl"}
            >
              <CHeading size={"xl"}>Standard</CHeading>
              <Text fontSize={"2xl"}>Gratis</Text>
              {loggedIn ? (
                <>
                  <Button colorScheme={"gray"} disabled>
                    Bereits aktiv
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    colorScheme={"gray"}
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("codeup::open_login")
                      );
                    }}
                  >
                    Loslegen
                  </Button>
                </>
              )}
              <Stack gap={4}>
                <Accordion defaultIndex={[0]} allowMultiple allowToggle>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Kurse und Zertifikate
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <FeatureList
                        features={[
                          {
                            av: true,
                            t: "Zugriff auf alle kostenlosen  Kurse",
                          },
                          {
                            av: true,
                            t: "Zugriff auf alle kostenlosen Zertifikate",
                          },
                        ]}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Forum
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <FeatureList
                        features={[
                          {
                            av: true,
                            t: "Veröffentlichen von Artikeln",
                          },
                          {
                            av: true,
                            t: "Hochladen von Medien",
                          },
                          {
                            av: true,
                            t: "Zugriff auf Direktnachrichten",
                          },
                          {
                            av: true,
                            t: "Anzeigen von Zertifikaten",
                          },
                          {
                            av: false,
                            t: "Verändern der Biographie",
                          },
                          {
                            av: false,
                            t: "Verändern des Anzeigenamens",
                          },
                          {
                            av: false,
                            t: "Verändern des Webseite und des Ortes",
                          },
                        ]}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Editor
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <FeatureList
                        features={[
                          {
                            av: true,
                            t: "Erstellen von drei Projekten",
                          },
                          {
                            av: true,
                            t: "5 Seiten pro Projekt",
                          },
                          {
                            av: true,
                            t: "1 Serverseitige Funktion pro Projekt",
                          },
                          {
                            av: true,
                            t: "Hochladen von ∞ statischen Dateien",
                          },
                          {
                            av: false,
                            t: "Export des Projekt",
                          },
                          {
                            av: false,
                            t: "Zusammenarbeit mit anderen",
                          },
                        ]}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Weitere Funktionen
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <FeatureList
                        features={[
                          {
                            av: true,
                            t: "Zugriff auf das Discovery",
                          },
                          {
                            av: true,
                            t: "Zugriff auf alle Projektideen",
                          },
                          {
                            av: true,
                            t: "Erstellen von einer Roadmap",
                          },
                          {
                            av: true,
                            t: "Erstellen von zwei Kids Projekten",
                          },
                          {
                            av: true,
                            t: "Erstellen von drei Code-Snippets",
                          },
                          {
                            av: true,
                            t: "Erstellen von zwei Flows",
                          },
                          {
                            av: true,
                            t: "Erstellen von drei ToDo-Listen",
                          },
                          {
                            av: true,
                            t: "10 Einträge pro ToDo-Liste",
                          },
                        ]}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Stack>
            </Stack>
            <Stack bg={"black"} p={6} rounded={"xl"} gap={8} w={"100%"}>
              <CHeading size={"xl"}>CodeUp PRO</CHeading>
              <Text fontSize={"2xl"}>
                12 € <chakra.sub>/Monat</chakra.sub>
              </Text>
              {userInfo.subscription === "PRO" ? (
                <>
                  <Button variant={"brand"} leftIcon={<FaCrown />} disabled>
                    Bereits aktiv
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={"brand"}
                    onClick={async () => {
                      if (!props.ENABLE_PAYMENTS) {
                        await PopupManager.alertAsync({
                          title: "Deaktiviert",
                          description:
                            "Zum aktuellen Zeitpunkt sind keine Zahlungen möglich. Du kannst alle Funktionen des CodeUp PRO Pakets nutzen.",
                        });
                        return;
                      }

                      if (loggedIn) {
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
                      } else {
                        window.dispatchEvent(
                          new CustomEvent("codeup::open_login")
                        );
                      }
                    }}
                    leftIcon={<FaCrown />}
                  >
                    Aktivieren
                  </Button>
                </>
              )}
              <Stack gap={4}>
                <Accordion defaultIndex={[0]} allowMultiple allowToggle>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Kurse und Zertifikate
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <FeatureList
                        features={[
                          {
                            av: true,
                            t: "Zugriff auf alle Kurse",
                          },
                          {
                            av: true,
                            t: "Zugriff auf alle Zertifikate",
                          },
                        ]}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Forum
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <FeatureList
                        features={[
                          {
                            av: true,
                            t: "Veröffentlichen von Artikeln",
                          },
                          {
                            av: true,
                            t: "Hochladen von Medien",
                          },
                          {
                            av: true,
                            t: "Zugriff auf Direktnachrichten",
                          },
                          {
                            av: true,
                            t: "Anzeigen von Zertifikaten",
                          },
                          {
                            av: true,
                            t: "Verändern der Biographie",
                          },
                          {
                            av: true,
                            t: "Verändern des Anzeigenamens",
                          },
                          {
                            av: true,
                            t: "Verändern des Webseite und des Ortes",
                          },
                        ]}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Editor
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <FeatureList
                        features={[
                          {
                            av: true,
                            t: "Erstellen von ∞ Projekten",
                          },
                          {
                            av: true,
                            t: "∞ Seiten pro Projekt",
                          },
                          {
                            av: true,
                            t: "∞ Serverseitige Funktion",
                          },
                          {
                            av: true,
                            t: "Hochladen von ∞ statischen Dateien",
                          },
                          {
                            av: true,
                            t: "Export des Projekt",
                          },
                          {
                            av: true,
                            t: "Zusammenarbeit mit anderen",
                          },
                        ]}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Weitere Funktionen
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <FeatureList
                        features={[
                          {
                            av: true,
                            t: "Zugriff auf das Discovery",
                          },
                          {
                            av: true,
                            t: "Zugriff auf alle Projektideen",
                          },
                          {
                            av: true,
                            t: "Erstellen von ∞ Roadmap",
                          },
                          {
                            av: true,
                            t: "Erstellen von ∞ Kids Projekten",
                          },
                          {
                            av: true,
                            t: "Erstellen von ∞ Code-Snippets",
                          },
                          {
                            av: true,
                            t: "Erstellen von ∞ Flows",
                          },
                          {
                            av: true,
                            t: "Erstellen von ∞ ToDo-Listen",
                          },
                          {
                            av: true,
                            t: "∞ Einträge pro ToDo-Liste",
                          },
                        ]}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Stack>
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}

function FeatureList(props: { features: { av: boolean; t: string }[] }) {
  return (
    <>
      {props.features.map((item) => (
        <HStack fontSize={"xl"}>
          <Text color={item.av ? "brand.500" : "red.400"} fontSize={"4xl"}>
            {item.av ? <BiCheck /> : <BiX />}
          </Text>
          <Text color={"white"}>{item.t}</Text>
        </HStack>
      ))}
    </>
  );
}

export const getServerSideProps = async () => {
  return {
    props: {
      DISABLE_PAYMENTS: process.env.DISABLE_PAYMENTS,
    },
  };
};
