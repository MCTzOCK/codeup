/**
 * apps/web/src/pages/projects/[id]/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.05.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import AppShell from "@codeup/components/dist/global/AppShell";
import { IProject } from "../../../types/IProject";
import { useEffect } from "react";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";

export default function Index() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const [project, setProject] = React.useState<IProject | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then((res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
      } else {
        PopupManager.alertAsync({
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);
  return (
    <>
      <AppShell title={"Projekt"} sub_pages={[]}>
        <>123</>
      </AppShell>
    </>
  );
}
