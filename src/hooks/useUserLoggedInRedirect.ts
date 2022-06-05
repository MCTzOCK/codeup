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


export default function useUserLoggedInRedirect() {
  const userLoggedIn = useUserLoggedIn();

  useEffect(() => {
    if(userLoggedIn) {
      console.log("123")
      if(["/account/login", "/account/register"].includes(window.location.pathname)) {
        window.location.href = "/dashboard";
      }
    } else {
      if(!["/account/login", "/account/register", "/"].includes(window.location.pathname)) {
        window.location.href = "/account/login";
      }
    }
  }, [userLoggedIn])
}