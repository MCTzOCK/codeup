/**
 * src/hooks/useLoggedIn.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import REST from "@codeup/rest/dist";
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
    role: string;
    subscription?: string;
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
    role: "user",
  });

  useEffect(() => {
    let token: string | null = null;
    const interval = setInterval(() => {
      const newToken = localStorage.getItem("token");
      if (newToken !== null) {
        if (newToken !== token) {
          REST.Account.verify(newToken).then(async (res) => {
            if (res.status === 200) {
              if (res.payload.token) {
                localStorage.setItem("token", res.payload.token);
                token = res.payload.token;

                const r = await REST.Account.verify(token as string);

                if (r.status === 200) {
                  setLoggedIn(true);
                  if (process.env.NEXT_PUBLIC_DISABLE_PAYMENTS === "true") {
                    setUserInfo({
                      ...r.payload.data,
                      subscription: "PRO",
                    });
                  } else {
                    setUserInfo(r.payload.data);
                  }
                } else {
                  setLoggedIn(false);
                }
                return;
              }

              token = newToken;
              setLoggedIn(true);
              if (process.env.NEXT_PUBLIC_DISABLE_PAYMENTS === "true") {
                setUserInfo({
                  ...res.payload.data,
                  subscription: "PRO",
                });
              } else {
                setUserInfo(res.payload.data);
              }
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
