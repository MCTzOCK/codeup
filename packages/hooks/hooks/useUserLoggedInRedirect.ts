/**
 * src/hooks/useUserLoggedInRedirect.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2022
 *
 */
import { useEffect } from "react";
import useUserInfo from "./useUserInfo";
import { useLoggedIn } from "./useLoggedIn";

export default function useUserLoggedInRedirect(options: {
  allowAnonymous?: boolean;
  redirectTo?: string;
  redirectToLogin?: boolean;
}) {
  const { loaded, loggedIn } = useLoggedIn();

  useEffect(() => {
    if (!loaded) return;

    if (!loggedIn && !options.allowAnonymous) {
      window.location.href = "/#login";
    }
  }, [loaded, loggedIn]);
}
