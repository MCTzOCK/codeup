/**
 * apps/web/src/pages/projects/[id]/dbs.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../../types/IProject";
import { IWikiPage } from "../../../types/IWikiPage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/dist/editorv2/EditorProjectLayout";
import { Box, Grid, Input } from "@chakra-ui/react";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { FaClock, FaEye, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { CHeading } from "@codeup/components/dist/global/CHeading";

export default function Dbs() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const [project, setProject] = React.useState<IProject | null>(null);
  const [credentials, setCredentials] = React.useState<{
    username: string;
    password: string;
    host: string;
    port: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then(async (res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reloadCreds();
      } else {
        PopupManager.alertAsync({
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const reloadCreds = async () => {
    const res = await REST.Projects.DB.getCredentials(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die Datenbank-Credentials konnten nicht geladen werden: " +
          res.payload.error,
      });
    }

    setCredentials(res.payload.data);
  };

  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={2}>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
            gap={2}
            p={4}
          >
            <Box rounded={"md"} bg={"gray.900"} p={2}>
              <CHeading size={"lg"}>Login-Daten</CHeading>
              <Box mt={2}>
                <CHeading size={"md"}>Host:</CHeading>
                <Box>{credentials?.host}</Box>
                <CHeading size={"md"}>Port:</CHeading>
                <Box>{credentials?.port}</Box>
                <CHeading size={"md"}>Username:</CHeading>
                <Box>{credentials?.username}</Box>
                <CHeading size={"md"}>Passwort:</CHeading>
                <Box>{credentials?.password}</Box>
                <CHeading size={"md"}>Zusammenfassung:</CHeading>
                <Input
                  placeholder={"Connection string"}
                  value={`mysql://${credentials?.username}:${credentials?.password}@${credentials?.host}:${credentials?.port}/${router.query.id}`}
                  isReadOnly={true}
                  mt={2}
                />
              </Box>
            </Box>
          </Grid>
        </Box>
      </EditorProjectLayout>
    </>
  );
}
