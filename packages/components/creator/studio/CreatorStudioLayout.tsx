/**
 * packages/components/creator/studio/CreatorStudioLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.11.2022
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { ReactNode, useEffect, useState } from "react";
import ErrorComponent from "../../global/ErrorComponent";
import AuthenticateLoadingIndicator from "../../admin/AuthenticateLoadingIndicator";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

export default function CreatorStudioLayout(props: { children: ReactNode }) {
  const { t } = useTranslation("creator-studio");
  const { loggedIn, userInfo, loaded: userLoaded } = useLoggedIn();

  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!userLoaded) return;

    if (!loggedIn) {
      setError(t("error.auth"));
      return;
    }

    /* -- REMOVE CREATOR LOCK -- */
    /*
    if (!["admin", "editor"].includes(userInfo?.role)) {
      setError("Du bist nicht dazu berechtigt diese Seite zu sehen!");
    }
    */
  }, [loggedIn, userInfo, userLoaded]);

  return (
    <>
      {error !== "" ? (
        <>
          <ErrorComponent description={error} title={t("error.auth.noun")} />
        </>
      ) : null}
      {!userLoaded && error === "" ? (
        <>
          <AuthenticateLoadingIndicator />
        </>
      ) : null}
      {userLoaded && error === "" ? (
        <Box bg={"#000"} h={"fit-content"} minH={"100vh"}>
          {props.children}
        </Box>
      ) : null}
    </>
  );
}
