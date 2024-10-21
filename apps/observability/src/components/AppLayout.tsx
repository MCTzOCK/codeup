/**
 * apps/observability/src/components/AppLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.10.2024
 *
 */

import * as React from "react";
import { useLoggedIn, useUserLoggedInRedirect } from "@codeup/hooks";
import { useEffect } from "react";

export default function AppLayout(props: { children: React.ReactNode }) {
  const { loaded, loggedIn, userInfo } = useLoggedIn();

  useEffect(() => {
    if (!loaded) return;

    if (!loggedIn) {
      window.location.href = `https://codeup.space/account/authorize?appId=6716b5aa9fa93e4dc0283868&redirect=${
        window.location.origin + "/auth"
      }`;
    }
  }, [loaded, loggedIn, userInfo]);
  return <>{props.children}</>;
}
