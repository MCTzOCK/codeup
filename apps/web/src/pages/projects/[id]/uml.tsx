/**
 * apps/web/src/pages/projects/[id]/uml.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.06.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { useRouter } from "next/router";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { IProject } from "../../../types/IProject";
import { useEffect } from "react";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/editorv2/EditorProjectLayout";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import {
  FaClock,
  FaCode,
  FaExchangeAlt,
  FaEye,
  FaHtml5,
  FaPlus,
  FaSitemap,
  FaTrash,
} from "react-icons/fa";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { FaCube, FaHardDrive } from "react-icons/fa6";
import byteSize from "byte-size";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function UML() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("projects");

  const [project, setProject] = React.useState<IProject | null>(null);
  const [umls, setUmls] = React.useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then((res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reloadUmls();
      } else {
        PopupManager.alertAsync({
          title: t("base:control.error"),
          description: t("project.loading.error") + ": " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const reloadUmls = async () => {
    const res = await REST.Projects.umlDiagrams(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (res.status === 200) {
      setUmls(res.payload.umls);
    } else {
      PopupManager.alertAsync({
        title: t("base:control.error"),
        description: t("umls.loading.error") + ": " + res.payload.error,
      });
    }
  };

  const uml_types: {
    name: string;
    description: string;
    icon: any;
    identifier: string;
  }[] = [
    {
      name: t("umls.type.impl"),
      description: t("umls.type.impl.text"),
      icon: <FaCube />,
      identifier: "impl",
    },
    {
      name: t("umls.type.er"),
      description: t("umls.type.er.text"),
      icon: <FaSitemap />,
      identifier: "er",
    },
    {
      name: t("umls.type.seq"),
      description: t("umls.type.seq.text"),
      icon: <FaExchangeAlt />,
      identifier: "seq",
    },
    {
      name: t("umls.type.adv"),
      description: t("umls.type.adv.text"),
      icon: <FaCode />,
      identifier: "adv",
    },
  ];

  return (
    <>
      <Head>
        <title>{t("umls.doc.title")}</title>
      </Head>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={2}>
          <GridLayoutV2
            pageTitle={t("umls.title")}
            search={{
              show: true,
              fields: true,
            }}
            topButtons={[
              {
                text: t("new"),
                variant: "brand",
                onClick: async () => {
                  const name = await PopupManager.promptAsync({
                    title: t("umls.new"),
                    helperText: t("umls.new.name"),
                  });

                  if (!name) return;

                  const x = await new Promise(async (resolve) => {
                    await PopupManager.alertAsync({
                      title: t("umls.new.type"),
                      description: (
                        <>
                          <Text>{t("umls.new.choose.type")}</Text>
                          <Grid
                            templateColumns={[
                              "repeat(1, 1fr)",
                              "repeat(2, 1fr)",
                            ]}
                            pt={6}
                            gap={4}
                          >
                            {uml_types.map((type) => (
                              <>
                                <Box
                                  bg={"#000"}
                                  rounded={"xl"}
                                  cursor={"pointer"}
                                  _hover={{
                                    outline: "1px solid #F7DE1F",
                                  }}
                                  p={4}
                                  onClick={async () => {
                                    resolve(type.identifier);
                                    PopupManager.removeCurrentPopup();
                                  }}
                                >
                                  <Flex
                                    fontSize={"4xl"}
                                    w={"100%"}
                                    justifyContent={"center"}
                                    color={"white"}
                                    align={"center"}
                                  >
                                    {type.icon}
                                  </Flex>
                                  <Box mt={2} textAlign={"center"}>
                                    <CHeading size={"md"}>{type.name}</CHeading>
                                  </Box>
                                  <Text
                                    fontSize={"sm"}
                                    color={"white"}
                                    textAlign={"center"}
                                    mt={2}
                                  >
                                    {type.description}
                                  </Text>
                                </Box>
                              </>
                            ))}
                          </Grid>
                        </>
                      ),
                    });
                  });

                  if (!x) return;

                  const res = await REST.Projects.createUmlDiagram(
                    AccountManager.getActiveToken(),
                    router.query.id as string,
                    name,
                    JSON.stringify({}),
                    x as string
                  );

                  if (res.status !== 200) {
                    await PopupManager.alertAsync({
                      title: t("base:control.error"),
                      description:
                        t("umls.new.error") + ": " + res.payload.error,
                    });
                    return;
                  }

                  await reloadUmls();
                },
                leftIcon: <FaPlus />,
              },
            ]}
            entries={umls.map((u) => ({
              title: u.name,
              buttonRows: [
                [
                  {
                    text: t("open"),
                    onClick: () => {
                      router.push(
                        "/projects/" +
                          router.query.id +
                          "/uml/" +
                          u._id +
                          "?type=" +
                          u.type
                      );
                    },
                    leftIcon: <FaEye />,
                    variant: "brand",
                  },
                  {
                    text: t("delete"),
                    onClick: async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: t("delete"),
                          question: t("umls.delete.confirm"),
                        }))
                      )
                        return;

                      const res = await REST.Projects.deleteUmlDiagram(
                        AccountManager.getActiveToken(),
                        router.query.id as string,
                        u._id
                      );

                      if (res.status !== 200) {
                        await PopupManager.alertAsync({
                          title: t("base:control.error"),
                          description:
                            t("umls.delete.error") + ": " + res.payload.error,
                        });
                        return;
                      }

                      await reloadUmls();
                    },
                    leftIcon: <FaTrash />,
                    colorScheme: "red",
                  },
                ],
              ],
              fields: [
                {
                  text:
                    t("umls.created") +
                    ": " +
                    new Date(u.createdAt).toLocaleString(),
                  icon: <FaClock />,
                },
                {
                  text:
                    t("type") +
                    ": " +
                    (uml_types.find((t) => t.identifier === u.type)?.name ??
                      t("type.other")),
                  icon: uml_types.find((t) => t.identifier === u.type)
                    ?.icon ?? <FaHtml5 />,
                },
                {
                  text:
                    t("umls.saved.data") +
                    ": " +
                    byteSize(u.data.length).toString(),
                  icon: <FaHardDrive />,
                },
              ],
            }))}
          />
        </Box>
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
