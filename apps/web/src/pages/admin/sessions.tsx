/**
 * apps/web/src/pages/admin/sessions.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.07.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import AdminLayout from "@codeup/components/dist/admin/AdminLayout";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../global/PopupManager";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { FaClock, FaEnvelope, FaEye } from "react-icons/fa";
import {
  FaBox,
  FaFirefoxBrowser,
  FaInternetExplorer,
  FaRotate,
} from "react-icons/fa6";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import CodeUpModal from "@codeup/components/dist/codeup/CodeUpModal";
import * as rrwebPlayer from "rrweb-player";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Sessions() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const router = useRouter();

  const [sessions, setSessions] = React.useState<
    {
      _id: string;
      events: any[];
      userAgent: string;
      createdAt: string;
      sessionStarted: string;
      eventsCount: number;
      user: {
        _id: string;
        username: string;
        email: string;
        role: string;
        profilePicture: string;
      };
    }[]
  >([]);

  const reloadSessions = async () => {
    const res = await REST.Admin.SessionReplay.list(
      AccountManager.getActiveToken()
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Replays konnten nicht geladen werden: " + res.payload.error,
      });
      return;
    }

    setSessions(res.payload.sessions);
  };

  const reloadFilterSessions = async (filter: string) => {
    const res = await REST.Admin.SessionReplay.byUser(
      AccountManager.getActiveToken(),
      filter
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Replays konnten nicht geladen werden: " + res.payload.error,
      });
      return;
    }

    setSessions(res.payload.sessions);
  };

  React.useEffect(() => {
    if (router) {
      if (router.query && router.query.filter) {
        reloadFilterSessions(router.query.filter as string);
      } else {
        reloadSessions();
      }
    }
  }, [router]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Head>
        <title>Replay - CodeUp</title>
      </Head>
      <AdminLayout>
        <GridLayoutV2
          pageTitle={"Replay"}
          search={{
            show: true,
            fields: true,
          }}
          topButtons={[]}
          entries={sessions
            .sort((a, b) => {
              return (
                new Date(b.sessionStarted).getTime() -
                new Date(a.sessionStarted).getTime()
              );
            })
            .map((session) => {
              return {
                title: session.user ? session.user.username : "Anonymous",
                fields: [
                  {
                    text: new Date(session.sessionStarted).toLocaleString(),
                    icon: <FaClock />,
                  },
                  {
                    text: session.userAgent,
                  },
                  {
                    text: session.user
                      ? session.user.email
                      : "anon@anonymous.org",
                    icon: <FaEnvelope />,
                  },
                  {
                    text: session.eventsCount + " Events",
                    icon: <FaBox />,
                  },
                ],
                buttonRows: [
                  [
                    {
                      text: "Ansehen",
                      disabled: session.eventsCount === 0,
                      onClick: async () => {
                        const res = await REST.Admin.SessionReplay.get(
                          AccountManager.getActiveToken(),
                          session._id
                        );

                        if (res.status !== 200) {
                          await PopupManager.alertAsync({
                            title: "Fehler",
                            description:
                              "Replay konnte nicht geladen werden: " +
                              res.payload.error,
                          });
                          return;
                        }

                        onOpen();

                        setTimeout(() => {
                          const e = document.querySelector(
                            "#rrweb-replayer-div"
                          ) as HTMLDivElement;

                          const player = new rrwebPlayer.default({
                            target: document.getElementById(
                              "rrweb-replayer-div"
                            ) as HTMLDivElement,
                            props: {
                              events: res.payload.session.events as any,
                              autoPlay: true,
                              skipInactive: false,
                            },
                          });
                        }, 500);
                      },
                      leftIcon: <FaEye />,
                      variant: "brand",
                    },
                  ],
                ],
              };
            })}
        />
        <CodeUpModal
          onOpen={onOpen}
          onClose={onClose}
          isOpen={isOpen}
          title={"Replay"}
          customSize={"full"}
        >
          <Flex
            w={"100%"}
            h={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <div
              id={"rrweb-replayer-div"}
              style={{
                backgroundColor: "#000",
              }}
            ></div>
          </Flex>
        </CodeUpModal>
      </AdminLayout>
    </>
  );
}
