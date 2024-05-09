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

export default function Discovery() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

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
        <title>Discovery - CodeUp</title>
      </Head>
      {error ? (
        <>
          <ErrorComponent
            description={"Ein Fehler ist aufgetreten!"}
            title={"Fehler"}
          />
        </>
      ) : (
        <Box bg={"#000"} minH={"100vh"} h={"fit-content"}>
          <GridLayoutV2
            pageTitle={"Discovery"}
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
                    text: "Autor: @" + p.author,
                  },
                  {
                    icon: <FaStar />,
                    text: "Sterne: " + p.stars.length,
                  },
                  {
                    icon: <FaInfo />,
                    text:
                      "Beschreibung: " +
                      p.description.substring(0, 100) +
                      "...",
                  },
                ],
                buttonRows: [
                  [
                    {
                      text: "Ansehen",
                      leftIcon: <FaEye />,
                      variant: "brand",
                      onClick: () => {
                        window.open("http://" + p.domain, "_blank");
                      },
                    },
                    {
                      text: p.stars.includes(userInfo.id)
                        ? "Stern entfernen"
                        : "Stern hinzufügen",
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
                            title: "Erfolgreich",
                            description:
                              "Deine Aktion wurde erfolgreich ausgeführt!",
                          });
                        } else {
                          PopupManager.alert({
                            title: "Fehler",
                            description:
                              "Ein Fehler ist aufgetreten: " +
                              res.payload.error,
                          });
                        }
                      },
                    },
                  ],
                  [
                    {
                      text: "Kommentieren",
                      leftIcon: <FaComment />,
                      variant: "brand",
                      onClick: async () => {
                        const comment = await PopupManager.promptAsync({
                          title: "Kommentar",
                          helperText:
                            "Gib deinen Kommentar ein. Achte dabei auf deine Wortwahl!",
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
                            title: "Erfolgreich",
                            description:
                              "Dein Kommentar wurde erfolgreich hinzugefügt!",
                          });
                          return;
                        }

                        PopupManager.alert({
                          title: "Fehler",
                          description:
                            "Ein Fehler ist aufgetreten: " + res.payload.error,
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
