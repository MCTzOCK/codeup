/**
 * packages/components/admin/AdminLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.22
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  CircularProgress,
  Flex,
  Grid,
  Heading,
  Progress,
  Spinner,
} from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import AuthenticateLoadingIndicator from "./AuthenticateLoadingIndicator";
import ErrorComponent from "../global/ErrorComponent";

export default function AdminLayout(props: { children: ReactNode }) {
  const { loggedIn, userInfo, loaded: userLoaded } = useLoggedIn();

  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!userLoaded) return;

    if (!loggedIn) {
      setError("Du bist nicht dazu berechtigt diese Seite zu sehen!");
      return;
    }

    if (userInfo?.role !== "admin") {
      setError("Du bist nicht dazu berechtigt diese Seite zu sehen!");
    }
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
