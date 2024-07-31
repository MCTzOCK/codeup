/**
 * apps/web/src/pages/projects/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.05.2024
 *
 */

import * as React from "react";
import { Box, chakra, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../types/IProject";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../global/PopupManager";
import GridLayoutV2 from "@codeup/components/global/GridLayoutV2";
import {
  FaClock,
  FaCode,
  FaDownload,
  FaHtml5,
  FaInfo,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { useRouter } from "next/router";
import { RiNextjsFill } from "react-icons/ri";
import { SiExpress, SiVite } from "react-icons/si";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function Projects() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("projects");

  const router = useRouter();

  const [projects, setProjects] = React.useState<IProject[]>([]);

  const reload = async () => {
    const res = await REST.Projects.myProjects(AccountManager.getActiveToken());

    if (res.status === 200) {
      setProjects(res.payload.data);
    } else {
      await PopupManager.alertAsync({
        title: t("base:control.error"),
        description: res.payload.error,
      });
    }
  };

  React.useEffect(() => {
    reload();
  }, []);

  const project_types: {
    name: string;
    description: string;
    icon: any;
    identifier: string;
  }[] = [
    {
      name: t("project.types.static"),
      description: t("project.types.static.description"),
      icon: <FaHtml5 />,
      identifier: "static",
    },
    {
      name: t("project.types.vite"),
      description: t("project.types.vite.description"),
      icon: <SiVite />,
      identifier: "vite-react",
    },
    {
      name: t("project.types.express"),
      description: t("project.types.express.description"),
      icon: <SiExpress />,
      identifier: "express",
    },
  ];

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      <Box minH={"100vh"} h={"fit-content"} bg={"#000"}>
        <GridLayoutV2
          pageTitle={t("title")}
          search={{
            show: true,
            fields: true,
          }}
          topButtons={[
            {
              text: t("new"),
              leftIcon: <FaPlus />,
              onClick: async () => {
                const name = await PopupManager.promptAsync({
                  title: t("project.new"),
                  helperText: t("project.new.name"),
                });

                if (!name) return;

                const x = await new Promise(async (resolve) => {
                  await PopupManager.alertAsync({
                    title: t("project.type.choose"),
                    description: (
                      <>
                        <Text>{t("project.type.choose.text")}</Text>
                        <Grid
                          templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
                          pt={6}
                          gap={4}
                        >
                          {project_types.map((type) => (
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

                const res = await REST.Projects.createProject({
                  token: AccountManager.getActiveToken(),
                  name,
                  projectType: x as string,
                  modifiers: ["private"],
                });

                await reload();
              },
              variant: "brand",
            },
          ]}
          entries={projects.map((p) => ({
            title: p.name,
            fields: [
              {
                icon: <FaCode />,
                text: t("project.template") + ": " + p.projectType,
              },
              {
                icon: <FaInfo />,
                text: t("project.id") + ": " + p._id,
              },
              {
                icon: <FaClock />,
                text:
                  t("project.created") +
                  ": " +
                  new Date(p.createdAt).toLocaleString(),
              },
            ],
            buttonRows: [
              [
                {
                  text: t("open"),
                  onClick: () => {
                    router.push("/projects/" + p._id);
                  },
                  leftIcon: <FaCode />,
                  variant: "brand",
                },
                {
                  text: t("delete"),
                  onClick: async () => {
                    if (
                      !(await PopupManager.confirmAsync({
                        title: t("project.delete"),
                        question: t("project.delete.confirm"),
                      }))
                    )
                      return;

                    const res = await REST.Projects.deleteProject(
                      AccountManager.getActiveToken(),
                      p._id
                    );

                    if (res.status === 200) {
                      await reload();
                    } else {
                      await PopupManager.alertAsync({
                        title: t("base:control.error"),
                        description: res.payload.error,
                      });
                    }
                  },
                  leftIcon: <FaTrash />,
                  colorScheme: "red",
                },
              ],
              [
                {
                  text: t("project.export"),
                  onClick: async () => {
                    window.open(
                      "/api/projects/" +
                        p._id +
                        "/download?token=" +
                        AccountManager.getActiveToken()
                    );
                  },
                  leftIcon: <FaDownload />,
                  variant: "brand",
                },
              ],
            ],
          }))}
        />
      </Box>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["projects"])),
  };
}
