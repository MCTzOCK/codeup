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

export default function CreatorStudioLayout(props: { children: ReactNode }) {
  const { loggedIn, userInfo, loaded: userLoaded } = useLoggedIn();

  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!userLoaded) return;

    if (!loggedIn) {
      setError("Du bist nicht dazu berechtigt diese Seite zu sehen!");
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
          <ErrorComponent
            description={error}
            title={"Authentifizierungsfehler"}
          />
        </>
      ) : null}
      {!userLoaded && error === "" ? (
        <>
          <AuthenticateLoadingIndicator />
        </>
      ) : null}
      {userLoaded && error === "" ? <>{props.children}</> : null}
    </>
  );
}
