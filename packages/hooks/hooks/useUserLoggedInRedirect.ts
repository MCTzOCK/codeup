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
  onlyAdmin?: boolean;
}) {
  const { loaded, loggedIn, userInfo } = useLoggedIn();

  useEffect(() => {
    if (!loaded) return;

    if (!loggedIn && !options.allowAnonymous) {
      if (options.redirectTo) {
        window.location.href = options.redirectTo;
      } else {
        window.location.href = "/#login";
      }
    }

    if (options.onlyAdmin && userInfo && userInfo.role !== "admin") {
      window.location.href = "/";
    }
  }, [loaded, loggedIn, userInfo]);
}
