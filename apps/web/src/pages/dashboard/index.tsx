/**
 * apps/web/src/pages/dashboard/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.08.2022
 *
 */

import * as React from "react";
import {
  Box,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useHover, useLoggedIn } from "@codeup/hooks";
import { NextRouter, useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import REST from "@codeup/rest";
import redirect from "@codeup/util/src/userworkflow/redirect";
import Head from "next/head";
import {
  FaCertificate,
  FaCheck,
  FaCode,
  FaEye,
  FaInfo,
  FaPlus,
  FaProjectDiagram,
} from "react-icons/fa";
import byteSize from "byte-size";
import GridLayout from "@codeup/components/global/GridLayout";
import AccountManager from "@codeup/util/dist/AccountManager";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";

export default function Dashboard() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const [projectEntries, setProjectEntries] = useState<
    { isNewItem?: boolean; title: string; description?: string; href: string }[]
  >([]);
  const [certificates, setCertificates] = useState<
    {
      isNewItem?: boolean;
      title: string;
      description?: string;
      href: string;
    }[]
  >([]);

  const [todoEntries, setTodoEntries] = useState<
    { isNewItem?: boolean; title: string; description?: string; href: string }[]
  >([]);

  const [projectPlanningEntries, setProjectPlanningEntries] = useState<
    { isNewItem?: boolean; title: string; description?: string; href: string }[]
  >([]);

  const router = useRouter();

  useEffect(() => {
    if (loaded && !loggedIn) {
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
      router.push("/#login");
    }
  }, [loaded, userInfo, loggedIn]);

  useEffect(() => {
    if (loaded && loggedIn) {
      REST.Editor.getProjectsV2(AccountManager.getActiveToken()).then((res) => {
        let x = [];
        for (const project of res.payload.projects) {
          x.push({
            title: project.name,
            href: "/editor/" + project._id,
            description:
              "Erstellt: " + new Date(project.created_at).toLocaleString(),
          });
        }

        if (x.length === 0) {
          x.push({
            isNewItem: true,
            title: "Keine Projekte vorhanden",
            href: "/editor",
            description: "Klicke, um ein neues Projekt zu erstellen",
          });
        }

        setProjectEntries(x as any);
      });
      REST.ToDo.V2.getMyLists(localStorage.getItem("token") as string).then(
        (res) => {
          let x = [];
          for (const list of res.payload.lists) {
            x.push({
              title: list.name,
              href: "/todo",
              description:
                list.items.length > 0
                  ? "Noch " + list.items.length + " Aufgaben"
                  : "Alle Aufgaben erledigt",
            });
          }

          if (x.length === 0) {
            x.push({
              isNewItem: true,
              title: "Keine Listen vorhanden",
              href: "/todo",
              description: "Klicke, um eine neue Liste zu erstellen",
            });
          }

          setTodoEntries(x as any);
        }
      );

      REST.Certificates.getObtainedCertificates(
        localStorage.getItem("token") as string
      ).then((res) => {
        if (res.status !== 200) {
          setCertificates([
            {
              isNewItem: true,
              title: "Keine Zertifikate erhalten",
              href: "/certificates",
              description: "Klicke, um Zertifikate zu erhalten",
            },
          ]);
          return;
        }
        let x = [];
        for (const cert of res.payload.certs) {
          x.push({
            title: cert.course,
            href: "/user-cert/" + cert._id,
            description:
              "Bestanden am " +
              new Date(cert.date).toLocaleString().replace(",", " um") +
              " mit " +
              cert.percentage +
              "%",
          });
        }

        if (x.length === 0) {
          x.push({
            isNewItem: true,
            title: "Keine Zertifikate erhalten",
            href: "/certificates",
            description: "Klicke, um Zertifikate zu erhalten",
          });
        }

        setCertificates(x as any);
      });

      REST.ToDo.getV2Projects(localStorage.getItem("token") as string).then(
        (res) => {
          let x = [];
          for (const project of res.payload.projects) {
            x.push({
              title: project.name,
              href: "/planning/" + project._id,
              description:
                "Gespeicherte Daten: " +
                byteSize(project.saved.length).toString(),
            });
          }

          if (x.length === 0) {
            x.push({
              isNewItem: true,
              title: "Keine Projekte vorhanden",
              href: "/planning",
              description: "Klicke, um ein neues Projekt zu erstellen",
            });
          }

          setProjectPlanningEntries(x as any);
        }
      );
    }
  }, [loaded, loggedIn]);

  return (
    <>
      <Head>
        <title>Dashboard - CodeUp</title>
      </Head>
      <Flex
        direction={"column"}
        pt={"2rem"}
        bg={"#000"}
        h={"fit-content"}
        minH={"100vh"}
      >
        <Box textAlign={"center"}>
          <CHeading>Willkommen, {userInfo.firstName}!</CHeading>
        </Box>
        <Box padding={[".4rem", "2rem"]}>
          <DSection
            title={"Projekte"}
            entries={projectEntries}
            icon={<FaCode />}
            router={router}
          />
          <DSection
            title={"Projektplanung"}
            entries={projectPlanningEntries}
            icon={<FaProjectDiagram />}
            router={router}
          />
          <DSection
            title={"Todo-Listen"}
            entries={todoEntries}
            icon={<FaCheck />}
            router={router}
          />
          <DSection
            title={"Zertifikate"}
            entries={certificates}
            icon={<FaCertificate />}
            router={router}
          />
        </Box>
      </Flex>
    </>
  );
}

function DSection(props: {
  title: string;
  entries: {
    title: string;
    description?: string;
    href: string;
    isNewItem?: boolean;
  }[];
  icon: any;
  router: NextRouter;
}) {
  return (
    <>
      <GridLayoutV2
        pageTitle={props.title}
        search={{
          show: false,
          fields: false,
        }}
        topButtons={[]}
        entries={props.entries
          .filter((x) => x.isNewItem !== true)
          .map((y) => {
            return {
              title: y.title,
              fields: [
                {
                  icon: (<FaInfo />) as ReactNode,
                  text: y.description as string,
                },
              ],
              buttonRows: [
                [
                  {
                    icon: (<FaEye />) as ReactNode,
                    onClick: () => {
                      props.router.push(y.href);
                    },
                    text: "Ansehen",
                    variant: "brand",
                  },
                ],
              ],
            };
          })}
      />
    </>
  );
}
