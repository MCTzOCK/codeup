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
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  Input,
} from "@chakra-ui/react";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { FaTrash, FaHammer, FaLanguage } from "react-icons/fa";
import { translateOnlineV3 } from "../../../global/i18n/onlineTranslateV3";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function I18n() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("projects");

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
          title: t("base:control.error"),
          description: t("project.loading.error") + ": " + res.payload.error,
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
        title: t("base:control.error"),
        description: t("i18n.loading.error") + ": " + res.payload.error,
      });
    }
  };

  return (
    <>
      <Head>
        <title>{t("i18n.doc.title")}</title>
      </Head>
      <EditorProjectLayout project_id={router.query.id as string}>
        {i18n && (
          <>
            <Box p={2}>
              <Box textAlign={"center"}>
                <CHeading size={"lg"}>{t("i18n.title")}</CHeading>
                <Text fontSize={"lg"}>
                  {t("i18n.text")}{" "}
                  <chakra.a
                    color={"brand.500"}
                    target={"_blank"}
                    href={"https://npmjs.com/@codeupspace/i18n"}
                  >
                    @codeupspace/i18n
                  </chakra.a>
                </Text>
              </Box>
              <Grid
                templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
                gap={6}
                p={4}
                mt={"2rem"}
              >
                <Box rounded={"md"} p={4} bg={"gray.900"} h={"100%"}>
                  <CHeading size={"lg"}>{t("i18n.languages")}</CHeading>
                  <Text size={"lg"}>
                    {t("i18n.languages.supported")} {i18n.languages.join(", ")}
                  </Text>
                  <Button
                    variant={"brand"}
                    mt={4}
                    onClick={async () => {
                      const langCode = await PopupManager.promptAsync({
                        title: t("i18n.languages.add"),
                        helperText: t("i18n.languages.add.short"),
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
                          title: t("base:control.error"),
                          description:
                            t("i18n.languages.add.error") +
                            ": " +
                            res.payload.error,
                        });
                      }
                    }}
                  >
                    {t("i18n.languages.add")}
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
                              aria-label={t("remove")}
                              icon={<FaTrash />}
                              colorScheme={"red"}
                              variant={"ghost"}
                              onClick={async () => {
                                if (
                                  !(await PopupManager.confirmAsync({
                                    title: t("i18n.languages.remove"),
                                    question: t(
                                      "i18n.languages.remove.confirm"
                                    ),
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
                                    title: t("base:control.error"),
                                    description:
                                      t("i18n.languages.remove.error") +
                                      ": " +
                                      res.payload.error,
                                  });
                                }
                              }}
                            />
                            <IconButton
                              aria-label={t("i18n.languages.make.default")}
                              icon={<FaHammer />}
                              variant={"ghost"}
                              colorScheme={"brand"}
                              onClick={async () => {
                                if (
                                  !(await PopupManager.confirmAsync({
                                    title: t("i18n.languages.default"),
                                    question: t(
                                      "i18n.languages.make.default.confirm"
                                    ),
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
                                    title: t("base:control.error"),
                                    description:
                                      t("i18n.languages.make.default.error") +
                                      ": " +
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
                  <CHeading size={"lg"}>{t("i18n.translations")}</CHeading>
                  <Button
                    variant={"brand"}
                    mt={4}
                    onClick={async () => {
                      const key = await PopupManager.promptAsync({
                        title: t("i18n.add.key"),
                        helperText: t("i18n.enter.key"),
                      });

                      if (!key) return;

                      for (const l of i18n.languages) {
                        const res = await REST.Projects.i18nSetKey(
                          AccountManager.getActiveToken(),
                          router.query.id as string,
                          l,
                          key,
                          ""
                        );
                      }

                      await reloadI18n();
                    }}
                  >
                    {t("add")}
                  </Button>
                  <Table mt={4}>
                    <Thead>
                      <Th>{t("i18n.key")}</Th>
                      <Th>{t("i18n.default")}</Th>
                    </Thead>
                    <Tbody>
                      {i18n.translations[i18n.defaultLanguage] &&
                        Object.keys(
                          i18n.translations[i18n.defaultLanguage]
                        ).map((t: any) => {
                          return (
                            <>
                              <Tr
                                _hover={{
                                  bg: "gray.700",
                                  cursor: "pointer",
                                }}
                                onClick={async () => {
                                  await PopupManager.alertAsync({
                                    title: t("i18n.edit.translation"),
                                    description: (
                                      <>
                                        <form
                                          onSubmit={async (e) => {
                                            e.preventDefault();

                                            const fd = new FormData(
                                              e.target as HTMLFormElement
                                            );

                                            let res: {
                                              [key: string]: string;
                                            } = {};

                                            for (const l of i18n.languages) {
                                              res[l] = fd.get(
                                                "t-" + l
                                              ) as string;
                                            }

                                            for (const k of Object.keys(res)) {
                                              const r =
                                                await REST.Projects.i18nSetKey(
                                                  AccountManager.getActiveToken(),
                                                  router.query.id as string,
                                                  k,
                                                  t,
                                                  res[k]
                                                );
                                            }

                                            PopupManager.removeCurrentPopup();

                                            await reloadI18n();
                                          }}
                                        >
                                          <Stack spacing={4}>
                                            {i18n.languages.map((l: string) => {
                                              return (
                                                <HStack spacing={2}>
                                                  <Text size={"lg"}>{l}</Text>
                                                  <Input
                                                    size={"lg"}
                                                    name={"t-" + l}
                                                    id={"t-" + l}
                                                    defaultValue={
                                                      i18n.translations[l]
                                                        ? i18n.translations[l][
                                                            t
                                                          ]
                                                        : ""
                                                    }
                                                  />
                                                  <IconButton
                                                    aria-label={
                                                      "Auto-Translate"
                                                    }
                                                    icon={<FaLanguage />}
                                                    onClick={async () => {
                                                      const x =
                                                        await translateOnlineV3(
                                                          {
                                                            text: (
                                                              document.querySelector(
                                                                "#t-" +
                                                                  i18n.defaultLanguage
                                                              ) as HTMLInputElement
                                                            ).value,
                                                            from: i18n.defaultLanguage,
                                                            to: l,
                                                          }
                                                        );

                                                      (
                                                        document.querySelector(
                                                          "#t-" + l
                                                        ) as HTMLInputElement
                                                      ).value = x;
                                                    }}
                                                    variant={"brand"}
                                                    display={
                                                      i18n.defaultLanguage === l
                                                        ? "none"
                                                        : undefined
                                                    }
                                                  />
                                                </HStack>
                                              );
                                            })}
                                            <ButtonGroup w={"100%"}>
                                              <Button
                                                variant={"brand"}
                                                w={"100%"}
                                                type={"submit"}
                                              >
                                                {t("save")}
                                              </Button>
                                              <Button
                                                colorScheme={"red"}
                                                w={"100%"}
                                                onClick={async () => {
                                                  if (
                                                    !(await PopupManager.confirmAsync(
                                                      {
                                                        title: t("delete"),
                                                        question: t(
                                                          "i18n.delete.key.confirm"
                                                        ),
                                                      }
                                                    ))
                                                  )
                                                    return;

                                                  for (const k of Object.keys(
                                                    i18n.translations
                                                  )) {
                                                    await REST.Projects.i18nDeleteKey(
                                                      AccountManager.getActiveToken(),
                                                      router.query.id as string,
                                                      k,
                                                      t
                                                    );
                                                  }

                                                  PopupManager.removeCurrentPopup();

                                                  await reloadI18n();
                                                }}
                                              >
                                                {t("delete")}
                                              </Button>
                                            </ButtonGroup>
                                          </Stack>
                                        </form>
                                      </>
                                    ),
                                  });
                                }}
                              >
                                <Td>
                                  <Text size={"lg"}>{t}</Text>
                                </Td>
                                <Td>
                                  <Text size={"lg"}>
                                    {i18n.translations[i18n.defaultLanguage][t]}
                                  </Text>
                                </Td>
                              </Tr>
                            </>
                          );
                        })}
                    </Tbody>
                  </Table>
                </Box>
              </Grid>
            </Box>
          </>
        )}
      </EditorProjectLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["projects"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
