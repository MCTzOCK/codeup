/**
 * apps/web/src/pages/projects/[id]/i18n.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.06.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../../types/IProject";
import { IWikiPage } from "../../../types/IWikiPage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/dist/editorv2/EditorProjectLayout";
import {
  Box,
  chakra,
  Button,
  Text,
  Grid,
  Stack,
  HStack,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { FaTrash, FaHammer } from "react-icons/fa";

export default function I18n() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const [project, setProject] = React.useState<IProject | null>(null);
  const [i18n, setI18n] = React.useState<any | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then(async (res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reloadI18n();
      } else {
        PopupManager.alertAsync({
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const reloadI18n = async () => {
    const res = await REST.Projects.getI18nData(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (res.status === 200) {
      setI18n(res.payload.i18n);
    } else {
      PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die Lokalisierungsdaten konnten nicht empfangen werden: " +
          res.payload.error,
      });
    }
  };

  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        {i18n && (
          <>
            <Box p={2}>
              <Box textAlign={"center"}>
                <CHeading size={"lg"}>Lokalisierung</CHeading>
                <Text fontSize={"lg"}>
                  Hier kannst du verschiedene Sprachen für dein Projekt
                  verwalten. Es werden Sprachkürzel wie "de" oder "en"
                  verwendet. <br />
                  Um die Sprachen in dein Projekt zu integrieren, kannst du die
                  JavaScript-Bibliothek{" "}
                  <chakra.a
                    color={"brand.500"}
                    target={"_blank"}
                    href={"https://npmjs.com/@codeupspace/i18n"}
                  >
                    @codeupspace/i18n
                  </chakra.a>{" "}
                  verwenden.
                </Text>
              </Box>
              <Grid
                templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
                gap={6}
                p={4}
                mt={"2rem"}
              >
                <Box rounded={"md"} p={4} bg={"gray.900"} h={"100%"}>
                  <CHeading size={"lg"}>Sprachen</CHeading>
                  <Text size={"lg"}>
                    Deine App unterstützt folgende Sprachen:{" "}
                  </Text>
                  <Button
                    variant={"brand"}
                    mt={4}
                    onClick={async () => {
                      const langCode = await PopupManager.promptAsync({
                        title: "Sprache hinzufügen",
                        helperText:
                          "Bitte gib das Sprachkürzel ein (z.B. 'de')",
                      });

                      if (!langCode) return;

                      const res = await REST.Projects.i18nAddLanguage(
                        AccountManager.getActiveToken(),
                        router.query.id as string,
                        langCode
                      );

                      if (res.status === 200) {
                        reloadI18n();
                      } else {
                        await PopupManager.alertAsync({
                          title: "Fehler",
                          description:
                            "Die Sprache konnte nicht hinzugefügt werden: " +
                            res.payload.error,
                        });
                      }
                    }}
                  >
                    Sprache hinzufügen
                  </Button>
                  <Stack gap={2} pt={4}>
                    {i18n.languages.map((l: string) => {
                      return (
                        <HStack spacing={2}>
                          <Text size={"lg"}>{l}</Text>
                          {i18n.defaultLanguage === l && (
                            <>
                              <Text size={"lg"}>&nbsp;(Standard)</Text>
                            </>
                          )}
                          <ButtonGroup>
                            <IconButton
                              aria-label={"Entfernen"}
                              icon={<FaTrash />}
                              colorScheme={"red"}
                              variant={"ghost"}
                              onClick={async () => {
                                if (
                                  !(await PopupManager.confirmAsync({
                                    title: "Sprache entfernen",
                                    question:
                                      "Möchtest du die Sprache wirklich entfernen?",
                                  }))
                                )
                                  return;

                                const res =
                                  await REST.Projects.i18nRemoveLanguage(
                                    AccountManager.getActiveToken(),
                                    router.query.id as string,
                                    l
                                  );

                                if (res.status === 200) {
                                  reloadI18n();
                                } else {
                                  await PopupManager.alertAsync({
                                    title: "Fehler",
                                    description:
                                      "Die Sprache konnte nicht entfernt werden: " +
                                      res.payload.error,
                                  });
                                }
                              }}
                            />
                            <IconButton
                              aria-label={"Standard machen"}
                              icon={<FaHammer />}
                              variant={"ghost"}
                              colorScheme={"brand"}
                              onClick={async () => {
                                if (
                                  !(await PopupManager.confirmAsync({
                                    title: "Standard-Sprache",
                                    question:
                                      "Möchtest du diese Sprache als Standard festlegen?",
                                  }))
                                )
                                  return;

                                const res =
                                  await REST.Projects.i18nSetDefaultLanguage(
                                    AccountManager.getActiveToken(),
                                    router.query.id as string,
                                    l
                                  );

                                if (res.status === 200) {
                                  reloadI18n();
                                } else {
                                  await PopupManager.alertAsync({
                                    title: "Fehler",
                                    description:
                                      "Die Sprache konnte nicht als Standard festgelegt werden: " +
                                      res.payload.error,
                                  });
                                }
                              }}
                              display={
                                i18n.defaultLanguage === l ? "none" : undefined
                              }
                            />
                          </ButtonGroup>
                        </HStack>
                      );
                    })}
                  </Stack>
                </Box>
                <Box rounded={"md"} p={4} bg={"gray.900"} h={"100%"}>
                  <CHeading size={"lg"}>Übersetzungen</CHeading>
                </Box>
              </Grid>
            </Box>
          </>
        )}
      </EditorProjectLayout>
    </>
  );
}
