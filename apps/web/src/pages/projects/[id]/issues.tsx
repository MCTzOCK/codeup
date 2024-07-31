/**
 * apps/web/src/pages/projects/[id]/issues.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.05.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../../types/IProject";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/dist/editorv2/EditorProjectLayout";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { IIssue } from "../../../types/IIssue";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import {
  FaClock,
  FaEye,
  FaPen,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function Issues() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("projects");

  const [project, setProject] = React.useState<IProject | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then(async (res) => {
      if (res.status === 200) {
        setProject(res.payload.project);

        reloadIssues();
      } else {
        PopupManager.alertAsync({
          title: t("base:control.error"),
          description: t("project.loading.error") + ": " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const [issues, setIssues] = React.useState<IIssue[]>([]);

  const reloadIssues = async () => {
    const x = await REST.Projects.getIssues(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (x.status === 200) {
      setIssues(x.payload.issues);
    } else {
      PopupManager.alertAsync({
        title: t("base:control.error"),
        description: t("issues.loading.error") + ": " + x.payload.error,
      });
    }
  };
  return (
    <>
      <Head>
        <title>{t("issues.doc.title")}</title>
      </Head>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={2}>
          <GridLayoutV2
            pageTitle={t("issues.title")}
            search={{
              show: true,
              fields: true,
            }}
            topButtons={[
              {
                text: t("issues.new"),
                onClick: async () => {
                  await PopupManager.alertAsync({
                    title: t("issues.new"),
                    description: (
                      <>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();

                            const formD = new FormData(
                              e.target as HTMLFormElement
                            );

                            const title = formD.get("title") as string;
                            const description = formD.get(
                              "description"
                            ) as string;
                            const priority = formD.get("priority") as string;
                            const status = "open";

                            const res = await REST.Projects.createIssue(
                              AccountManager.getActiveToken(),
                              router.query.id as string,
                              title,
                              description,
                              priority,
                              status
                            );

                            if (res.status === 200) {
                              await reloadIssues();
                              PopupManager.removeCurrentPopup();
                            } else {
                              PopupManager.removeCurrentPopup();

                              await PopupManager.alertAsync({
                                title: t("base:control.error"),
                                description:
                                  t("issues.new.error") +
                                  ": " +
                                  res.payload.error,
                              });
                            }
                          }}
                        >
                          <Stack spacing={4}>
                            <FormControl isRequired>
                              <FormLabel>{t("issues.f.title")}</FormLabel>
                              <Input
                                name={"title"}
                                placeholder={t("issues.f.title")}
                              />
                            </FormControl>
                            <FormControl isRequired>
                              <FormLabel>{t("issues.f.description")}</FormLabel>
                              <Textarea
                                name={"description"}
                                placeholder={t(
                                  "issues.f.description.placeholder"
                                )}
                              />
                            </FormControl>
                            <FormControl isRequired>
                              <FormLabel>{t("issues.prio")}</FormLabel>
                              <Select
                                name={"priority"}
                                placeholder={t("issues.prio.choose")}
                              >
                                <option value={"low"}>{t("prio.low")}</option>
                                <option value={"medium"}>
                                  {t("prio.medium")}
                                </option>
                                <option value={"high"}>{t("prio.high")}</option>
                              </Select>
                            </FormControl>
                            <Button variant={"brand"} type={"submit"}>
                              {t("create")}
                            </Button>
                          </Stack>
                        </form>
                      </>
                    ),
                  });
                },
                variant: "brand",
                leftIcon: <FaPlus />,
              },
            ]}
            entries={issues.map((issue) => {
              return {
                title: issue.title,
                buttonRows: [
                  [
                    {
                      text: t("issues.open"),
                      leftIcon: <FaEye />,
                      variant: "brand",
                      onClick: async () => {
                        await PopupManager.alertAsync({
                          title: issue.title,
                          description: (
                            <>
                              <Box>
                                <b>{t("issues.f.description")}:</b>
                                <br />
                                {issue.description}
                              </Box>
                              <Box>
                                <b>{t("issues.f.created")}:</b>
                                <br />
                                {new Date(issue.createdAt).toLocaleString()}
                              </Box>
                              <Box>
                                <b>{t("issues.status")}:</b>
                                <br />
                                {issue.status === "open"
                                  ? t("issues.status.open")
                                  : issue.status === "closed"
                                  ? t("issues.status.closed")
                                  : t("issues.status.work")}
                              </Box>
                              <Box>
                                <b>{t("issues.prio")}:</b>
                                <br />
                                {issue.priority === "low"
                                  ? t("prio.low")
                                  : issue.priority === "medium"
                                  ? t("prio.medium")
                                  : t("prio.high")}
                              </Box>
                            </>
                          ),
                        });
                      },
                    },
                    {
                      text: t("close"),
                      leftIcon: <FaTimesCircle />,
                      colorScheme: "red",
                      onClick: async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: t("close"),
                            question: t("issues.close.confirm"),
                          }))
                        )
                          return;

                        const res = await REST.Projects.updateIssue(
                          AccountManager.getActiveToken(),
                          router.query.id as string,
                          issue._id,
                          issue.title,
                          issue.description,
                          issue.priority,
                          "closed"
                        );

                        if (res.status === 200) {
                          await reloadIssues();
                        } else {
                          PopupManager.alertAsync({
                            title: t("base:control.error"),
                            description:
                              t("issues.close.error") +
                              ": " +
                              res.payload.error,
                          });
                        }
                      },
                      disabled: issue.status === "closed",
                    },
                  ],
                  [
                    {
                      text: t("edit"),
                      leftIcon: <FaPen />,
                      variant: "brand",
                      onClick: async () => {
                        await PopupManager.alertAsync({
                          title: t("edit"),
                          description: (
                            <>
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();

                                  const formD = new FormData(
                                    e.target as HTMLFormElement
                                  );

                                  const title = formD.get("title") as string;
                                  const description = formD.get(
                                    "description"
                                  ) as string;
                                  const priority = formD.get(
                                    "priority"
                                  ) as string;

                                  const res = await REST.Projects.updateIssue(
                                    AccountManager.getActiveToken(),
                                    router.query.id as string,
                                    issue._id,
                                    title,
                                    description,
                                    priority,
                                    issue.status
                                  );

                                  if (res.status === 200) {
                                    await reloadIssues();
                                    PopupManager.removeCurrentPopup();
                                  } else {
                                    PopupManager.removeCurrentPopup();

                                    await PopupManager.alertAsync({
                                      title: t("base:control.error"),
                                      description:
                                        t("issue.edit.error") +
                                        ": " +
                                        res.payload.error,
                                    });
                                  }
                                }}
                              >
                                <Stack spacing={4}>
                                  <FormControl isRequired>
                                    <FormLabel>{t("issues.f.title")}</FormLabel>
                                    <Input
                                      name={"title"}
                                      placeholder={t("issues.f.title")}
                                      defaultValue={issue.title}
                                    />
                                  </FormControl>
                                  <FormControl isRequired>
                                    <FormLabel>
                                      {t("issues.f.description")}
                                    </FormLabel>
                                    <Textarea
                                      name={"description"}
                                      placeholder={t(
                                        "issues.f.description.placeholder"
                                      )}
                                      defaultValue={issue.description}
                                    />
                                  </FormControl>
                                  <FormControl isRequired>
                                    <FormLabel>{t("issues.prio")}</FormLabel>
                                    <Select
                                      name={"priority"}
                                      placeholder={t("issues.prio.choose")}
                                      defaultValue={issue.priority}
                                    >
                                      <option value={"low"}>
                                        {t("prio.low")}
                                      </option>
                                      <option value={"medium"}>
                                        {t("prio.medium")}
                                      </option>
                                      <option value={"high"}>
                                        {t("prio.high")}
                                      </option>
                                    </Select>
                                  </FormControl>
                                  <Button variant={"brand"} type={"submit"}>
                                    {t("save")}
                                  </Button>
                                </Stack>
                              </form>
                            </>
                          ),
                        });
                      },
                      disabled: issue.status === "closed",
                    },
                    {
                      text: t("delete"),
                      leftIcon: <FaTrash />,
                      colorScheme: "red",
                      onClick: async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: t("delete"),
                            question: t("issue.delete.confirm"),
                          }))
                        )
                          return;

                        const res = await REST.Projects.deleteIssue(
                          AccountManager.getActiveToken(),
                          router.query.id as string,
                          issue._id
                        );

                        if (res.status === 200) {
                          await reloadIssues();
                        } else {
                          PopupManager.alertAsync({
                            title: t("base:control.error"),
                            description:
                              t("issue.delete.error") +
                              ": " +
                              res.payload.error,
                          });
                        }
                      },
                    },
                  ],
                ],
                fields: [
                  {
                    text:
                      t("issue.f.created") +
                      ": " +
                      new Date(issue.createdAt).toLocaleString(),
                    icon: <FaClock />,
                  },
                  {
                    text:
                      t("issue.status") +
                      ": " +
                      (issue.status === "open"
                        ? t("issue.status.open")
                        : issue.status === "closed"
                        ? t("issue.status.closed")
                        : t("issue.status.work")),
                  },
                  {
                    text:
                      t("issue.prio") +
                      ": " +
                      (issue.priority === "low"
                        ? t("prio.low")
                        : issue.priority === "medium"
                        ? t("prio.medium")
                        : t("prio.high")),
                  },
                ],
              };
            })}
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
