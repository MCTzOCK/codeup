/**
 * src/hooks/useUserLoggedInRedirect.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2022
 *
 */
import useUserLoggedIn from "./useUserLoggedIn";
import {useEffect} from "react";
import useUserInfo from "./useUserInfo";


export default function useUserLoggedInRedirect(options: {
  allowAnonymous?: boolean,
  redirectTo?: string,
  redirectToLogin?: boolean,
}) {
  const userInfo = useUserInfo();

  useEffect(() => {
    if (userInfo.id !== "") {
      return;
    }

    if (options.redirectToLogin) {
      window.location.href = "/account/login?redirect=" + encodeURIComponent(window.location.href);
    }
  }, [userInfo]);
}