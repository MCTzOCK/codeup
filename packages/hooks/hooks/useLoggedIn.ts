/**
 * src/hooks/useLoggedIn.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import REST from "@codeup/rest";
import { useEffect, useState } from "react";

export function useLoggedIn(): {
  loggedIn: boolean;
  loaded: boolean;
  userInfo: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    _2fa: boolean;
    username: string;
    sso?: string | boolean;
    admin: boolean;
  };
} {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    _2fa: false,
    username: "",
    admin: false,
  });

  useEffect(() => {
    let token: string | null = null;
    const interval = setInterval(() => {
      const newToken = localStorage.getItem("token");
      if (newToken !== null) {
        if (newToken !== token) {
          REST.Account.verify(newToken).then(async (res) => {
            if (res.status === 200) {
              token = newToken;
              setLoggedIn(true);
              setUserInfo(res.payload.data);
            } else {
              token = null;
              setLoggedIn(false);
              localStorage.removeItem("token");
            }
            setLoaded(true);
          });
        }
      } else {
        token = null;
        setLoggedIn(false);
        setLoaded(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return {
    loggedIn,
    loaded,
    userInfo,
  };
}
