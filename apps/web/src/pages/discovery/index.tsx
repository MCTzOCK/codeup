/**
 * apps/web/src/pages/discovery/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.12.2022
 *
 */

import * as React from "react";
import REST from "@codeup/rest/src";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import { Box, Heading } from "@chakra-ui/react";
import { useLoggedIn } from "@codeup/hooks";
import { FaComment, FaEye, FaInfo, FaStar, FaUser } from "react-icons/fa";
import { useRouter } from "next/router";
import GridLayout from "@codeup/components/global/GridLayout";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../global/PopupManager";
import Head from "next/head";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function Discovery() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const { t } = useTranslation("discovery");

  const [projects, setProjects] = React.useState<
    {
      name: string;
      description: string;
      author: string;
      domain: string;
      id: string;
      stars: string[];
    }[]
  >([]);

  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    REST.Discovery.getDiscoveryProjects().then((res) => {
      if (res.status === 200) {
        setProjects(res.payload.projects);
      } else {
        setError(true);
      }
    });
  }, []);

  const router = useRouter();

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      {error ? (
        <>
          <ErrorComponent
            description={t("error.text")}
            title={t("base:control.error")}
          />
        </>
      ) : (
        <Box bg={"#000"} minH={"100vh"} h={"fit-content"}>
          <GridLayoutV2
            pageTitle={t("title")}
            search={{
              show: true,
              fields: true,
            }}
            topButtons={[]}
            entries={projects.map((p) => {
              return {
                title: p.name,
                fields: [
                  {
                    icon: <FaUser />,
                    text: t("author") + ": @" + p.author,
                  },
                  {
                    icon: <FaStar />,
                    text: t("stars") + ": " + p.stars.length,
                  },
                  {
                    icon: <FaInfo />,
                    text:
                      t("description") +
                      ": " +
                      p.description.substring(0, 100) +
                      "...",
                  },
                ],
                buttonRows: [
                  [
                    {
                      text: t("open"),
                      leftIcon: <FaEye />,
                      variant: "brand",
                      onClick: () => {
                        window.open("http://" + p.domain, "_blank");
                      },
                    },
                    {
                      text: p.stars.includes(userInfo.id)
                        ? t("stars.remove")
                        : t("stars.add"),
                      leftIcon: <FaStar />,
                      variant: "brand",
                      disabled: !loggedIn,
                      onClick: async () => {
                        const res = await REST.Discovery.starProject({
                          token: AccountManager.getActiveToken(),
                          projectId: p.id,
                        });

                        if (res.status === 200) {
                          setProjects(
                            projects.map((pr) => {
                              if (pr.id === p.id) {
                                return {
                                  ...pr,
                                  stars: res.payload.stars,
                                };
                              } else {
                                return pr;
                              }
                            })
                          );
                          PopupManager.alert({
                            title: t("success"),
                            description: t("success.text"),
                          });
                        } else {
                          PopupManager.alert({
                            title: t("base:control.error"),
                            description:
                              t("error.desc") + ": " + res.payload.error,
                          });
                        }
                      },
                    },
                  ],
                  [
                    {
                      text: t("comment"),
                      leftIcon: <FaComment />,
                      variant: "brand",
                      onClick: async () => {
                        const comment = await PopupManager.promptAsync({
                          title: t("comment.subj"),
                          helperText: t("comment.subj.helper"),
                          inputType: "TEXTAREA",
                        });

                        if (!comment) return;

                        const res = await REST.Discovery.commentProject({
                          token: AccountManager.getActiveToken(),
                          projectId: p.id,
                          comment: comment,
                        });

                        if (res.status === 200) {
                          PopupManager.alert({
                            title: t("success"),
                            description: t("comment.added"),
                          });
                          return;
                        }

                        PopupManager.alert({
                          title: t("base:control.error"),
                          description:
                            t("error.desc") + ": " + res.payload.error,
                        });
                      },
                      disabled: !loggedIn,
                    },
                  ],
                ],
              };
            })}
          />
        </Box>
      )}
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["discovery"])),
  };
}
